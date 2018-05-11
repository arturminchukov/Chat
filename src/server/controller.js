const { findUserBySid, getUsers, addUser, setCurrentUser, logoutUser, updateUserAvatar } = require('./database/user');
const {
    joinRoom, leaveRoom, getRooms, getUserRooms, createRoom, getRoom, dropRoom, updateUserTime
} = require('./database/room');
const { getMessages, sendMessage } = require('./database/messages');
const TYPES = require('./messages');

/**
 * @param {Db} db
 * @param {*} io
 */
module.exports = function (db, io) {
    const ONLINE = {};

    /**
     * @param {Pagination<User>} users
     * @return {Pagination<User>}
     */
    function fillUsersWithStatus(users) {
        users.items = users.items.map(user => ({ ...user, online: Boolean(ONLINE[user._id]) }));

        return users;
    }

    /**
     * Connection is created
     */
    io.on('connection', (socket) => {
        let { sid } = socket.request.cookies,
            isDisconnected = false;
        let userInRoom = { status: false, roomId: null };
        socket.join('broadcast');

        /**
         * Invoke callback and handle errors
         *
         * @param callback
         */
        function wrapCallback(callback) {
            return function (...args) {
                const printErr = (err) => {
                    console.error(err);

                    socket.emit(TYPES.ERROR, {
                        message: err.message,
                        stack: err.stack,
                    });

                    throw err;
                };

                try {
                    return callback(...args).catch(printErr);
                } catch (err) {
                    printErr(err);
                }
            };
        }

        function requestResponse(type, callback) {
            socket.on(type, wrapCallback(async ({ id, payload }) => {
                socket.emit(type + id, await callback(payload));
            }));
        }

        /**
         * Send notification to every user about status change
         *
         * @param {string} userId
         */
        function userChangeOnlineStatus(userId) {
            socket.broadcast.emit(TYPES.ONLINE, {
                status: ONLINE[userId],
                userId,
            });
        }

        /**
         * Join to socket channel, to broadcast messages inside Room
         *
         * @param {string} roomId
         */
        function joinToRoomChannel(roomId) {
            socket.join(`room:${roomId}`);
        }

        /**
         * Join to socket channel, to broadcast messages inside Room
         *
         * @param {string} userId
         */
        function userJoinToChannel(userId) {
            socket.join(`id:${userId}`);
        }

        /**
         * Leave socket channel, to broadcast messages inside Room
         *
         * @param {string} userId
         */
        function userLeaveChannel(userId) {
            socket.leave(`id:${userId}`);
        }


        /**
         * Broadcast messages inside Room about user joined
         *
         * @param {string} userId
         * @param {object} room
         */
        function userJoinedToRoom({ userId }, room) {
            socket.to(`id:${userId}`).emit(TYPES.USER_JOINED, room);
        }

        /**
         * Leave socket channel
         *
         * @param {string} roomId
         */
        function leaveRoomChannel(roomId) {
            socket.leave(`room:${roomId}`);
        }

        // Join current user to room channel
        requestResponse(TYPES.CURRENT_USER_JOIN_CHANNEL, (roomId) => joinToRoomChannel(roomId));

        // Leave current user from room channel
        requestResponse(TYPES.CURRENT_USER_LEAVE_CHANNEL, (roomId) => leaveRoomChannel(roomId));

        /**
         * Broadcast messages inside Room about user leave
         *
         * @param {string} userId
         * @param {string} roomId
         */
        function userLeaveRoom(userId, roomId) {
            socket.to(`id:${userId}`).emit(TYPES.USER_LEAVED, roomId);
        }


        /**
         * New message coming to room
         *
         * @param {Message} message
         */
        function newMessage(message) {
            socket.to(`room:${message.roomId}`).emit(TYPES.MESSAGE, message);
        }

        // Load user information for next usage
        async function CurrentUser() {
            return await findUserBySid(db, sid);
        }

        // Receive current user information
        requestResponse(TYPES.CURRENT_USER, async () => {
            let user = await CurrentUser();
            if (user) {
                delete user.password;
                userJoinToChannel(user._id.toString());
            }
            return user;
        });

        // Set current user avatar
        requestResponse(TYPES.SET_CURRENT_USER_AVATAR, async (newAvatar) => {
            let user = await CurrentUser();
            user.avatar = newAvatar;
            return await updateUserAvatar(db, user);
        });

        // Return list of all users with
        requestResponse(TYPES.USERS, async (params) => {
            return fillUsersWithStatus(await getUsers(db, params || {}));
        });

        // Add new user
        requestResponse(TYPES.ADD_USER, async (payload) => {
            return await addUser(db, {
                ...payload,
            });
        });

        // Create room
        requestResponse(TYPES.CREATE_ROOM, async (params) => {
            const currentUser = await CurrentUser();

            return createRoom(db, currentUser, params);
        });

        // Create room
        requestResponse(TYPES.ROOMS, (params) => {
            return getRooms(db, params || {});
        });

        // Get Users Of room
        requestResponse(TYPES.GET_USERS_OF_ROOM, async (roomId) => {
            const room = await getRoom(db, roomId);
            return await getUsers(db, {
                _id: { '$in': room.users },
                limit: 100
            });
        });

        // Set a current user
        requestResponse(TYPES.SET_CURRENT_USER, async (payload) => {
            payload = {
                ...payload,
                sid: sid,
            };
            return await setCurrentUser(db, payload);
        });

        // Logout current user
        requestResponse(TYPES.LOGOUT_CURRENT_USER, async () => {
            const user = await CurrentUser();
            getUserRooms(db, user._id, { limit: 0 })
                .then(rooms => {
                    rooms.forEach(room => {
                        leaveRoomChannel(room._id);
                    })
                });
            userLeaveChannel(user._id);
            return await logoutUser(db, sid);
        });

        // Rooms of current user
        requestResponse(TYPES.CURRENT_USER_ROOMS, async (params) => {
            const currentUser = await CurrentUser();
            if (userInRoom.status) {
                await updateUserTime(db, currentUser._id, userInRoom.roomId);
                userInRoom.status = false;
                userInRoom.roomId = null;
            }
            let rooms = (await getUserRooms(db, currentUser._id, params)),
                items = rooms.items;
            for (let item of rooms.items) {
                joinToRoomChannel(item._id);
            }

            return await Promise.all(items.map((item => {
                return getMessages(db, {
                    roomId: item._id, limit: 1
                });
            })))
                .then((lastMessages => {
                    lastMessages.forEach(lastMessage => {
                        if (lastMessage.items[0]) {
                            for (let i = 0; i < rooms.items.length; i++) {
                                if ((lastMessage.items[0].roomId.toString() === rooms.items[i]._id.toString())) {
                                    rooms.items[i].lastMessage = lastMessage.items[0];
                                    break;
                                }
                            }
                        }
                    });
                    return Promise.all(lastMessages.map((lastMessage) => {
                        if (lastMessage && lastMessage.items && lastMessage.items[0])
                            return getUsers(db, { _id: lastMessage.items[0].userId, limit: 1 });
                        else
                            return null;
                    }))
                }))

                .then((users) => {
                    if (users) {
                        rooms.items.forEach(room => {
                            for (let i = 0; i < users.length; i++) {
                                if (users[i] && users[i].items && users[i].items.length && room.lastMessage && (users[i].items[0]._id.toString() === room.lastMessage.userId.toString())) {
                                    room.lastMessage.user = users[i].items[0];
                                    if (room && room.lastTime && room.lastTime[currentUser._id]
                                        && (room.lastMessage.userId.toString() === currentUser._id.toString()
                                        || room.lastMessage.created_at < room.lastTime[currentUser._id].time))
                                        room.lastMessage.readByUser = true;
                                    else
                                        room.lastMessage.readByUser = false;
                                    break;
                                }
                            }
                        });
                        return rooms;
                    }
                })
                .catch((error) => {
                        Promise.reject(error);
                    }
                );
        });

        // Join current user to room
        requestResponse(TYPES.DROP_ROOM, async (roomId) => {
            const room = await getRoom(db, roomId);
            if (room && room.users && room.users.length === 1) {
                userLeaveRoom(room.users[0].toString(), roomId);
            }
            return await dropRoom(db, roomId);
        });

        // Join current user to room
        requestResponse(TYPES.CURRENT_USER_JOIN_ROOM, async ({ roomId }) => {
            const currentUser = await CurrentUser();

            joinToRoomChannel(roomId);
            const payload = {
                roomId,
                userId: currentUser._id,
            };

            return joinRoom(db, payload);
        });

        // Join user to room
        requestResponse(TYPES.USER_JOIN_ROOM, async (payload) => {

            joinToRoomChannel();
            const room = await getRoom(db, payload.roomId);
            userJoinedToRoom(payload, room);
            return joinRoom(db, payload);
        });

        // Leave current user to room
        requestResponse(TYPES.CURRENT_USER_LEAVE_ROOM, async ({ roomId }) => {
            const currentUser = await CurrentUser();

            const payload = {
                roomId,
                userId: currentUser._id,
            };

            leaveRoomChannel(roomId);

            return leaveRoom(db, payload);
        });

        // Remove user from room
        requestResponse(TYPES.REMOVE_USER_FROM_ROOM, async ({ userId, roomId }) => {
            const payload = {
                roomId,
                userId
            };

            leaveRoomChannel(roomId);
            userLeaveRoom(payload);

            return leaveRoom(db, payload);
        });

        // Send message
        requestResponse(TYPES.SEND_MESSAGE, async (payload) => {
            const currentUser = await CurrentUser();
            /**
             * Обновляем время если посылаем сообщение*/
            if (userInRoom.status) {
                userInRoom.roomId = payload.roomId;
                updateUserTime(db, currentUser._id, payload.roomId)
            }

            const message = await sendMessage(db, {
                ...payload,
                userId: currentUser._id,
            });

            newMessage(message);

            return message;
        });

        // Get messages
        requestResponse(TYPES.MESSAGES, (payload) => {
            CurrentUser()
                .then(user => {
                    if (!userInRoom.status) {
                        userInRoom.status = true;
                        userInRoom.roomId = payload.roomId;
                        updateUserTime(db, user._id, userInRoom.roomId)
                    }
                });
            return getMessages(db, payload);
        });


        CurrentUser().then(async (user) => {
            if (!user) {
                return
            }
            if (!isDisconnected) {
                ONLINE[user._id] = true;
            }

            userChangeOnlineStatus(user._id);

            // Get of user groups
            const rooms = await getUserRooms(db, user._id);

            rooms.items.forEach((room) => {
                joinToRoomChannel(db, room._id);
            });
        });

        socket.on('disconnect', async () => {
            isDisconnected = true;
            const user = await CurrentUser();
            if (userInRoom.status) {
                userInRoom.status = false;
                updateUserTime(db, user._id, userInRoom.roomId);
            }

            ONLINE[user._id] = false;

            userChangeOnlineStatus(user._id);
        });
    });
};

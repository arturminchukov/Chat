const { ObjectId } = require('mongodb');
const { insertOrUpdateEntity, pageableCollection } = require('./helpers');
const { getUser } = require('./user');


const TABLE = 'rooms';

/**
 * @typedef {{
 *  [_id]: string,
 *  name: string,
 *  users: string[]
 * }} Room
 */

/**
 * @param {Db} db
 * @param {string} id
 *
 * @return {Promise<Room>}
 */
async function getRoom(db, id) {
    return db.collection(TABLE).findOne({ _id: ObjectId(id.toString()) });
}

/**
 * @param {Db} db
 * @param {Room} room
 *
 * @return {Promise<Room>}
 */
async function saveRoom(db, room) {
    return insertOrUpdateEntity(db.collection(TABLE), room);
}

/**
 * @param {Db} db
 * @param {Room} roomId
 * @param {User} userId
 *
 * @return {Promise<Room>}
 */
async function updateUserTime(db,userId, roomId) {
    let room = await getRoom(db,roomId);

    if(!room)
        return;

    if(!room.lastTime)
        room.lastTime = {};

    if(!room.lastTime[userId])
        room.lastTime[userId] = {};

    if(!room.lastTime[userId].userId)
        room.lastTime[userId].userId = userId;

    room.lastTime[userId].time = Date.now();
    return await insertOrUpdateEntity(db.collection(TABLE), room);
}


/**
 * @param {Db} db
 * @param {Room} roomId
 * @param {time} lastMessageTime
 *
 * @return {Promise<Room>}
 */
async function updateLastMessageTime(db,lastMessageTime, roomId) {
    let room = await getRoom(db,roomId);

    if(!room)
        return;

    room.lastMessageTime = lastMessageTime;
    return await insertOrUpdateEntity(db.collection(TABLE), room);
}

/**
 * @param {Db} db
 * @param {{}} filter
 *
 * @return {Promise<Pagination<Room>>}
 */
async function getRooms(db, filter) {
    return pageableCollection(db.collection(TABLE), filter);
}

/**
 * @param {Db} db
 * @param {string} userId
 * @param {{}} [filter]
 *
 * @return {Promise<Pagination<Room>>}
 */
async function getUserRooms(db, userId, filter) {
    const selectModifier = filter && filter.lastTime;
    return pageableCollection(db.collection(TABLE), {
            ...filter,
            order: {
                lastMessageTime: -1,
            },
            users: ObjectId(userId.toString()),
        },
        null,
        selectModifier
    );
}

/**
 * @param {Db} db
 * @param {User} currentUser
 * @param {Room} room
 *
 * @return {Promise<Room>}
 */
async function createRoom(db, currentUser, room) {
    // if (!room.name) {
    //     throw new Error('Cannot create room without name');
    // }
    let existsRoom = false,
        collection = db.collection(TABLE);
    if (room.name) {
        existsRoom = await collection.findOne({ name: room.name });
    }

    if (existsRoom) {
        // If we clone room
        delete room._id;
    }
    console.log(1);
    room.users = room.users || [];
    room.users.push(currentUser._id);

    return insertOrUpdateEntity(collection, room);
}

/**
 *
 * @param {Db} db
 * @param {string} roomId
 * @param {string} userId
 *
 * @return {Promise<Room>}
 */
async function joinRoom(db, { roomId, userId }) {
    if (!roomId) {
        throw new Error('You must specify roomId to join');
    }

    if (!userId) {
        throw new Error('You must specify userId to join');
    }

    let collection = db.collection(TABLE),
     [ room, user ] = await Promise.all([getRoom(db, roomId), getUser(db, userId)]);


    if (!room) {
        throw new Error(`Cannot find room with id=${roomId}`);
    }

    if (!user) {
        throw new Error(`Unknown user with id=${userId}`);
    }

    const users = room.users.map(user => user.toString());

    if (users.indexOf(userId.toString()) > -1) {
        return room;
    }

    users.push(userId.toString());

    // Make array unique
    room.users = [...new Set(users)].map(userId => ObjectId(userId));

    // Save users to database
    await collection.updateOne({ _id: room._id }, { $set: { users: room.users } });

    return room;
}

/**
 * @param {Db} db
 * @param {string} roomId
 *
 * @return {Promise<Room>}
 */
async function dropRoom(db, roomId) {
    if (!roomId) {
        throw new Error('You must specify roomId to drop');
    }

    const query = {
        _id:ObjectId(roomId.toString()),
    };

    return await db.collection(TABLE).deleteOne(query);
}

/**
 * @param {Db} db
 * @param {string} roomId
 * @param {string} userId
 *
 * @return {Promise<Room>}
 */
async function leaveRoom(db, { roomId, userId }) {
    if (!roomId) {
        throw new Error('You must specify roomId to leave');
    }

    if (!userId) {
        throw new Error('You must specify userId to leave');
    }

    let collection = db.collection(TABLE),
        [room, user] = await Promise.all([getRoom(db, roomId), getUser(db, userId)]);

    if (!room) {
        throw new Error(`Cannot find room with id=${roomId}`);
    }

    if (!user) {
        throw new Error(`Unknown user with id=${userId}`);
    }

    room.users = room.users
        .filter(user => user.toString() !== userId.toString());

    // Save users to database
    await collection.updateOne({ _id: room._id }, { $set: { users: room.users } });

    return room;
}

module.exports = {
    saveRoom,
    getRooms,
    getUserRooms,
    createRoom,
    getRoom,
    joinRoom,
    leaveRoom,
    dropRoom,
    updateUserTime,
    updateLastMessageTime,
};

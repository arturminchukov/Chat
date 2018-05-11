import api from '../api';
import { routeNavigation } from './route';

export default function addRoom(name, usersId) {
    return async function (dispatch) {
        try {
            // Loading
            let room = null;
            room = await api.createRoom(name);
            api.currentUserJoinRoom(room._id);

            Promise.all(usersId.map(userId => api.userJoinRoom(userId,room._id)));

            let usersName = {},
            users = await Promise.all(usersId.map(userId=>api.getUser(userId)));

            for (let user of users) {
                usersName[user._id] = user;
            }

            dispatch({
                type: 'ROOM_ADD',
                room,
            });
            dispatch(routeNavigation({
                page: 'chat_page',
                payload: {
                    /*...this.props.payload,*/
                    usersName: usersName,
                    currentRoom: room._id,
                    prevPage: 'chat_list',
                },
            }));
        } catch (error) {
            dispatch({
                type: 'ROOM_ADD_ERROR',
                error,
            });
        } finally {
            dispatch({
                type: 'FEED_LOADING',
            });
        }
    };
}

export function updateLastMessage(message) {
    return async function (dispatch) {
        try {
            message.user = await api.getUser(message.userId);
            dispatch({
                type: 'ROOMS_UPDATE_LAST_MESSAGE',
                newMessage: message
            });
        }catch (error){
            return {
                type: 'ROOM_ERROR',
                error,
            }
        }
    };
}

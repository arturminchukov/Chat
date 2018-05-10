import api from '../api';

export const userJoinedRoom = (room) => {
    room.lastMessage= {
        readByUser:false,
    };
    api.currentUserJoinChannel(room._id);
    return {
        type: 'ROOM_ADD',
        room,
    }
};
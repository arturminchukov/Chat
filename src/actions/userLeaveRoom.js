export const userLeaveRoom = (roomId)=>{
    return {
        type:'ROOM_DELETED',
        roomId,
    }
};
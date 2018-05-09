import { compareMessages } from '../helpers/compareMessages';

export default function rooms(state, action) {
    if (!state) {
        return {
            items: [],
            next: true,
            error: null,
        };
    }
    switch (action.type) {
        case 'ROOM_ADD':
            return {
                ...state,
                items: [action.room,...state.items],
                newRoom: action.room,
            };
        case 'ROOM_DELETED':
            const newRooms = state.items.filter(room => room._id.toString()!== action.roomId.toString());
            return {
                ...state,
                items: newRooms,
            };
        case 'ROOMS_FETCH':
            return {
                ...state,
                items: [...state.items, ...action.items],
                next: action.next,
                end: action.end,
            };
        case 'USER_SIGN_OUT':
            return {
                items: [],
                next: true,
            };
        case 'ROOMS_RESET':
            return {
                ...state,
                items: [],
                next: null,
            };
        case 'ROOMS_UPDATE_LAST_MESSAGE':
            let newItems = [...state.items],
                newState = {
                    ...state,
                };
            newItems.forEach((item) => {
                if (item._id === (action && action.newMessage.roomId)) {
                    item.lastMessage = action.newMessage;
                    item.lastMessage.readByUser = false;
                    newState.items =  newItems;
                }
            });
            newState.items.sort(compareMessages);
            return newState;
        case 'ROOMS_ERROR':
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
}

import api from '../api';
import { compareMessages } from '../helpers/compareMessages';

export default function fetchRooms() {
    return async function (dispatch, getState) {
        try {
            const state = getState().rooms;
            let rooms;
            if (state && !state.next)
                return;
            else if (state && state.next && state.next.lastId)
                rooms = await api.getCurrentUserRooms(state.next);
            else
                rooms = await api.getCurrentUserRooms();
            const { items, next } = rooms;

            items.sort(compareMessages);
            dispatch({
                type: 'ROOMS_FETCH',
                items,
                next,
            });
        } catch (error) {
            dispatch({
                type: 'ROOMS_ERROR',
                error,
            });
        }
    };
}

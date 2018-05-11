import api from '../api';

export default function fetchUsers() {
    return async function (dispatch, getState) {
        try {
            const state = getState().users;
            const users = await getUsers(state);
            if(!users)
                return;

            const {next,items} = users;
            dispatch({
                type: 'USERS_FETCH',
                items,
                next,
            });
        } catch (error) {
            dispatch({
                type: 'ROOM_ERROR',
                error,
            });
        }
    };
}

async function getUsers(state) {
    if (state && !state.next)
        return null;
    else if (state && state.next && state.next.lastId)
        return await api.getUsers(state.next);
    else
        return await api.getUsers();
}

import api from '../api';

export default function fetchMessages(roomId) {
    return async function (dispatch, getState) {
        dispatch({
            type: 'MESSAGES_LOADING',
            loading: true
        });

        try {
            let state = getState();
            let messages;
            if(state && state.messages && !state.messages.next)
                return;
            else if (state && state.messages && state.messages.next && state.messages.next.lastId)
                messages = await api.getMessages(state.messages.next);
            else
                messages = await api.getRoomMessages(roomId);
            dispatch({
                type: 'MESSAGES_LOADED',
                messages
            });
        } catch (error) {
            dispatch({
                type: 'MESSAGES_LOAD_ERROR',
                error,
            });
        } finally {
            dispatch({
                type: 'MESSAGES_LOADING',
                loading: false,
            });
        }
    };
}

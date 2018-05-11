const route = (state, action) => {
    if (!state) {
        return {
            page: null,
            payload: {}
        };
    }

    switch (action.type) {
        case 'ROUTE_NAVIGATE':
            return {
                ...state,
                page: action.page,
                payload: {
                    ...state.payload,
                    ...action.payload,
                }
            };

        case 'USER_ADDED_TO_CHAT':
            return {
                ...state,
                page: 'chat_settings',
                payload: {
                    ...state.payload,
                    chatUsers: action.chatUsers.items,
                    prevPage: state.payload.prevPrevPage ? state.payload.prevPrevPage : '',
                    prevPrevPage: state.payload.prevPrevPrevPage ? state.payload.prevPrevPrevPage : '',
                }
            };
        default:
            return state;
    }
};

export default route;

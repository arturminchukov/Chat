const route = (state, action) => {
    if (!state) {
        return {
            page: 'authorization',
        };
    }

    switch (action.type) {
    case 'ROUTE_NAVIGATE':
        return {
            ...state,
            page: action.page,
            payload: action.payload,
        };
    default:
        return state;
    }
};

export default route;
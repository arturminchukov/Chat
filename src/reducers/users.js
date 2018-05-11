export default function users(state, action) {
    if (!state) {
        return {
            items: [],
            next: true,
        };
    }
    switch (action.type) {
        case 'USERS_FETCH':
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
        case 'USERS_RESET':
            return {
                items: [],
                next: true,
            };
        default:
            return state;
    }
}

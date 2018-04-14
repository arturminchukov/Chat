export default function user(state, action) {
    if (!state) {
        return {
            _id: -1,
        };
    }
    switch (action.type) {
    case 'USER_SIGN_IN':
        return {
            ...state,
            _id: action._id,
            curUserInfo: action.curUserInfo,
        };
    case 'USER_GET_INFO':
        return {
            ...state,
            curUserInfo: action.curUserInfo,
        };
    case 'USER_SIGN_OUT':
        return {
            _id: -1,
        };
    default:
        return state;
    }
}

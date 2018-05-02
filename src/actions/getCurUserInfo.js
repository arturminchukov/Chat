export const getCurUserInfo = (user) => {
    return {
        type: 'USER_GET_INFO',
        curUserInfo: user,
    }
};

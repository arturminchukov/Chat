export const getCurUserInfo = (user) => {
    return {
        type: 'USER_GET_INFO',
        curUserInfo: user,
    }
};

export const updateUserAvatar = (avatar) => {
    return {
        type: 'USER_UPDATE_AVATAR',
        avatar: avatar,
    }
};

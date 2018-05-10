import React from 'react';
import { Avatar } from '../components/Avatar/Avatar';
import CryptoJS from 'crypto-js';

export default function createAvatar(avatar, user, modifier) {
    let src = avatar;
    if (!avatar) {
        let hash = CryptoJS.MD5(user.email?user.email:'');
        src = `https://www.gravatar.com/avatar/${encodeURIComponent(hash)}?d=robohash`;
    }
    const modClass = modifier ? `avatar-${modifier}` : 'avatar';
    return <Avatar id='user_photo' image={{
        src: src,
        modifier: modClass,
    }}/>;
}
import React from 'react';
import { ChatQuote } from '../ChatQuote/ChatQuote';
import createAvatar from '../../helpers/createAvatar';
import './ChatField.css';

export function ChatField(props) {
    const message = props.message,
        authorId = props.message.userId,
        name = props.author && props.author.name,
        userId = props.userId,
        author = props.author,
        avatarUrl = author && author.avatar;

    let direction = 'ChatField_right',
        avatar = '';

    if (authorId !== userId) {
        direction = 'ChatField_left';
        avatar = createAvatar(avatarUrl,author,'xs');
    }
    return (
      <div className={direction}>
          {avatar}
          <ChatQuote message={message} userId={userId} name={name}/>
        </div>
    );
}

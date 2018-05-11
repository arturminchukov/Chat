import React from 'react';
import { UserList } from '../UserList/UserList';
import { LinkBtn } from '../Buttons/LinkBtn/LinkBtn';
import './GroupChatSettings.css';
import { ConnectedHeader } from '../Header/Header';
import { connect } from 'react-redux';
import leaveRoom from '../../actions/leaveRoom';
import { routeNavigation } from '../../actions/route';
import fetchUsers from '../../actions/fetchUsers';

const stateToProps = state => ({
    payload: state.route.payload,
    users: state.users.items,
    next: state.users.next,
});

export const GroupChatSettings = connect(stateToProps)(
    (props, dispatch) => {
        const membersQuan = props.payload.chatUsers.length,
            groupName = 'BCG',
            onClickExit = removeUserFromChat.bind(props),
            fetchNext = props.dispatch.bind(props, fetchUsers()),
            onClickAddNewUser = addNewUserToChat.bind(props, fetchNext),
            handleClick = openUserMenu.bind(props);
        return (
            <div className="GroupChatSettings">
                <section className="GroupChatSettings__section">
                    <div className="">
                        <ConnectedHeader contentTitle={groupName} contentDesc="" buttonBack buttonSearch={false}
                                         buttonSettings={false} contentType="chat"/>
                    </div>
                </section>
                <section className="GroupChatSettings__section">
                    <h4 className="GroupChatSettings__section__title">Members ({membersQuan})</h4>
                    <LinkBtn className="GroupChatSettings__exit" btnText="Добавить участника"
                             onclick={onClickAddNewUser}/>
                    <UserList
                        users={props.payload.chatUsers} handleClick={handleClick}
                    />
                </section>
                <section className="GroupChatSettings__section">
                    <LinkBtn className="GroupChatSettings__exit" btnText="Exit" onclick={onClickExit}/>
                </section>
            </div>
        );
    });

function removeUserFromChat() {
    this.dispatch(leaveRoom(this.payload.currentRoom));
}

function addNewUserToChat() {
    this.dispatch(routeNavigation({
        page: 'add_new_user_to_chat_page',
        payload: {
            prevPage: 'chat_settings',
            prevPrevPage: this.payload.prevPage,
            prevPrevPrevPage:this.payload.prevPrevPage,
            allUsers: this.users,
        }
    }));
}

function openUserMenu(contactId){
    /*Здесь меню действий над пользователем в групповом чате*/
}

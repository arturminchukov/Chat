import React, { Component } from 'react';
import { connect } from 'react-redux';
import {routeNavigation} from '../../actions/route';
import { addMessage } from '../../actions/messages';
import { updateLastMessage } from '../../actions/rooms';
import { getCurUserInfo } from '../../actions/getCurUserInfo';
import { userJoinedRoom } from '../../actions/userJoinedRoom';
import { userLeaveRoom } from '../../actions/userLeaveRoom';

import './App.css';
import { AuthorizationPage } from '../AuthorizationPage/AuthorizationPage';
import { ChatListPage } from '../ChatListPage/ChatListPage';
import { AddRoomPage } from '../AddRoomPage/AddRoomPage';
import { ConnectedChatPage } from '../ChatPage/ChatPage';
import { ConnectedUserPage } from '../UserPage/UserPage';
import { ConnectedContactsListPage } from '../ContactsListPage/ContactsListPage';
import { GroupChatSettings } from '../GroupChatSettings/GroupChatSettings';
import { ConnectedUserList } from '../UserList/UserList';
import { ConnectedAddUserToChatPage } from '../AddUserToChatPage/AddUserToChatPage';
import { ConnectedStickerStore } from '../StickersStore/StickersStore';
import createBrowserNotification from '../../helpers/createBrowserNotification';
import api from '../../api';

// TODO: create page for the settings

const routeConfig = {
    authorization: {
        view: AuthorizationPage,
    },
    'chat_list': {
        view: ChatListPage
    },
    'contacts_list': {
        view: ConnectedContactsListPage
    },
    add_room_page: {
        view: AddRoomPage,
    },
    chat_page: {
        view: ConnectedChatPage,
    },
    'user_list':{
        view: ConnectedUserList,
    },
    'settings': {
        view: ConnectedUserPage,
    },
    'chat_settings': {
        view: GroupChatSettings,
    },
    'add_new_user_to_chat_page':{
        view: ConnectedAddUserToChatPage,
    },
    'stickers_store':{
        view: ConnectedStickerStore,
    }
};

const stateToProps = state => ({
    route: state.route,
    payload: state.route.payload
});

class App extends Component {

    constructor(props) {
        super(props);
        this.loadApp = this.loadApp.bind(this);

        api.onMessage(message => {
            if (this.destroy) {
                return;
            }

            if (this.props.payload.currentRoom === message.roomId) {
                this.props.dispatch(addMessage(message));
            }

            this.props.dispatch(updateLastMessage(message));

            if ((Notification.permission === 'granted')) {
                const { roomId, userId, message: messageText } = message;

                Promise.all([api.getUser(userId), api.getRoom(roomId)]).then((result) => {
                    const [{ name: userName }, { name: roomName }] = result;

                    createBrowserNotification(
                        roomName,
                        `${userName}: ${messageText}`,
                    );
                });
            }
        });

        api.onUserJoinedRoom(room => this.props.dispatch(userJoinedRoom(room)));

        api.onUserLeavedRoom((roomId)=>this.props.dispatch(userLeaveRoom(roomId)));
    }

    componentWillMount() {
        this.loadApp()
            .then((user) => {
                if (user) {
                    this.props.dispatch(getCurUserInfo(user));
                    this.props.dispatch(routeNavigation({
                        page: 'chat_list',
                        payload: {
                            footerNav: {
                                active: 'chat'
                            }
                        }
                    }));
                }
                else {
                    this.props.dispatch(routeNavigation({
                        page: 'authorization',
                        payload: {}
                    }));
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }

    loadApp(){
        return api.getCurrentUser();
    }



    render() {
        const Page = routeConfig[this.props.route.page] && routeConfig[this.props.route.page].view;

        if (!Page) {
            return  (
                <div className="spinner">
                    <div className="rect1" />
                    <div className="rect2" />
                    <div className="rect3" />
                    <div className="rect4" />
                    <div className="rect5" />
                </div>
            );
        }
        return (
            <Page />
        );
    }
}

export default connect(stateToProps)(App);

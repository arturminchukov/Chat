import React, { Component } from 'react';
import Header from '../Header/Header';
import { UserList } from '../UserList/UserList';
import { FooterNav } from '../FooterNav/FooterNav';
import { connect } from 'react-redux';
import fetchUsers from '../../actions/fetchUsers';
import addRoom from '../../actions/rooms';
import { routeNavigation } from '../../actions/route';
import api from '../../api';

import './ContactsListPage.css';

const stateToProps = state => ({
    users: state.users.items,
    next: state.users.next,
    end: state.users.end,
    error: state.users.error,
    currentUserRooms: state.rooms.items,
    newRoom: state.rooms.newRoom,
    curUserInfo: state.user.curUserInfo
});


export class ContactsListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            searchTerm: '',
            displayedContacts: this.props.users
        };
        this.fetch = this.fetch.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.resetSearch = this.resetSearch.bind(this);
    }

    fetch() {
        return this.props.dispatch(fetchUsers());
    }

    componentWillReceiveProps(props) {
        if (props.newRoom && (!this.props.newRoom || props.newRoom._id !== this.props.newRoom._id)) {
            this.enterRoom(props.newRoom._id);
        }
    }

    enterRoom = async(roomId) => {
        const users = await api.getUsersOfRoom(roomId),
            usersName = {};
        users.items.forEach(user => {
            usersName[user._id]=user.name;
        });
        this.props.dispatch(routeNavigation({
            page: 'chat_page',
            payload: {
                ...this.props.payload,
                usersName: usersName,
                currentRoom: roomId,
                prevPage: 'contacts_list'
            },
        }));
    };

    createRoom = async (contactId) => {
        const userName = await api.getUser(contactId);
        const curUser = this.props.curUserInfo;
        this.props.dispatch(addRoom({
                usersName: [
                    {
                        _id: curUser._id,
                        userName: curUser.name,
                    },
                    {
                        _id: userName._id,
                        userName: userName.name,
                    }
                ]
            },
            [userName._id]
        ));
    };

    handleClick(contactId) {
        /*
         * if !next all currentUserRooms has been fetched
         */
        const curUserInfo = this.props.curUserInfo;
        let createRoom = this.createRoom;
        let enterRoom = this.enterRoom;

        function searchCommonRoom(currentUserRooms) {
            const userRooms = currentUserRooms.items || currentUserRooms;
            return userRooms.filter((room) => {
                const { users } = room;
                if(!contactId === curUserInfo._id)
                    return (users.length === 2 && users.includes(contactId) && !room.name);
                else
                    return (users.length === 1 && users.includes(contactId) && !room.name)
            });
        }

        async function decideAsync(createRoom, enterRoom) {
            let currentUserRooms = await api.getCurrentUserRooms({limit:0});
            let commonRoom = searchCommonRoom(currentUserRooms);
            if (!commonRoom.length) {
                createRoom(contactId);
            } else if (commonRoom.length === 1) {
                enterRoom(commonRoom[0]._id);
            }

        }

        let currentUserRooms = [];
        if (!this.props.next) {
            currentUserRooms = this.props.currentUserRooms;
            let commonRoom = searchCommonRoom(currentUserRooms);
            if (!commonRoom.length) {
                createRoom(contactId);
            } else if (commonRoom.length === 1) {
                enterRoom(commonRoom[0]._id);
            }
        } else {
            decideAsync(createRoom, enterRoom);
        }
    }

    handleSearch(event){
        const searchQuery = event.target.value.toLowerCase();

        this.setState({
            searchTerm: searchQuery,
        });
    }

    resetSearch(){
        this.setState({
            searchTerm: '',
        });
    }

    render() {
        let displayedContacts = [];
        let searchQuery = this.state.searchTerm;
        if(searchQuery && this.props.users){
            displayedContacts = this.props.users.filter( (user) => {
                return (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()));
            })
        } else {
            displayedContacts = this.props.users;
        }
        return (
            <div className="ContactsListPage">
                <Header buttonBack={false} buttonSearch searchIsOn={searchQuery} resetSearch={this.resetSearch} handleSearch={this.handleSearch}  buttonSettings={false} contentType="contacts" />
                <UserList
                    users={displayedContacts}
                    fetchNext={this.fetch}
                    next={this.props.next}
                    handleClick={this.handleClick}
                />
                <FooterNav active="user"/>
            </div>
        );
    }
}

export const ConnectedContactsListPage = connect(stateToProps)(ContactsListPage);

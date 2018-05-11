import * as React from 'react';
import { connect } from 'react-redux';
import './AddRoomPage.css';
import { ConnectedHeader } from '../Header/Header';
import fetchUsers from '../../actions/fetchUsers';
import  { UserList } from '../UserList/UserList';
import addRoom from '../../actions/rooms';

const stateToProps = state => ({
    users: state.users.items,
    next: state.users.next,
    end: state.users.end,
    currentUser: state.user,
});

export const AddRoomPage = connect(stateToProps)(class AddRoomPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            activeContacts: {},
            error: null,
        };
        this.fetch = this.fetch.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.addRoomHandle = this.addRoomHandle.bind(this);
    }

    handleClick(contactId) {
        let activeContacts = this.state.activeContacts;

        if (activeContacts && activeContacts[contactId])
            delete activeContacts[contactId];
        else
            activeContacts[contactId] = contactId;

        const error =  null;

        this.setState({
            activeContacts: activeContacts,
            error
        });
    }

    async addRoomHandle() {
        const nameRoom = document.getElementById('Room-name').value;
        let roomUsers = [];
        if (this.state.activeContacts) {
            for (let user in this.state.activeContacts) {
                if (this.state.activeContacts.hasOwnProperty(user))
                    roomUsers.push(user);
            }
        }

        if (roomUsers.length === 0) {
            this.setState({
                error: 'Choose one or more users',
            });
            return;
        }

        if (!nameRoom) {
            this.setState({
                error: 'Input your name of room',
            });
            return;
        }

        return this.props.dispatch(addRoom({ name: nameRoom }, roomUsers));
    }

    fetch() {
        return this.props.dispatch(fetchUsers());
    }

    render() {
        let displayedContacts = this.props.users;
        displayedContacts.filter(user =>
            user._id !== this.props.currentUser._id
        );


        return (
            <div className="AddRoomPage">
                <div className="AddRoomPage__Header">
                    <ConnectedHeader buttonBack buttonSearch={false} buttonSettings={false} contentType="add-room"/>
                    <div className='AddRoomPage__Info_area'>
                        {this.state.error}
                    </div>
                    <div className="AddForm_InputField">
                        <input type="text" id="Room-name" className="InputField_Name"
                               style={{animationName: this.state.error==='Input your name of room' ? 'input-error' : ''}} placeholder="Введите название беседы"/>
                        <p>
                            <button className="InputField_Accept" onClick={this.addRoomHandle}>
                                OK
                            </button>
                        </p>
                    </div>
                </div>
                <div className="AddRoomPage__Content">
                    <UserList
                        users={displayedContacts}
                        fetchNext={this.fetch}
                        next={this.props.next}
                        handleClick={this.handleClick}
                        activeContacts={this.state.activeContacts}
                    />
                </div>
            </div>
        );
    }
});


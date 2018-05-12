import * as React from 'react';
import { InstanceSummaryElement } from '../InstanceSummaryElement/InstanceSummaryElement';
import './ChatList.css';
import { InfiniteScroll } from '../InfiniteScroll/InfiniteScroll';
import { connect } from 'react-redux';
import { routeNavigation } from '../../actions/route';
import api from '../../api';
import  createDateStamp  from '../../helpers/createDateStamp';

const stateToProps = state => ({
    payload: state.route.payload,
    curUserInfo: state.user.curUserInfo,
});

export const ChatList = connect(stateToProps)(class ChatList extends React.Component {

    async enterRoom(roomId) {
        let selectedRoom;
        for (let room of this.props.rooms) {
            if (roomId === room._id.toString())
                selectedRoom = { ...room };
        }
        const users = await api.getUsersOfRoom(roomId),
            usersName = {};

        for (let user of users.items) {
            usersName[user._id] = user;
        }

        this.props.dispatch(routeNavigation({
            page: 'chat_page',
            payload: {
                /*...this.props.payload,*/
                usersName: usersName,
                currentRoom: roomId,
                roomInfo: selectedRoom,
                prevPage: 'chat_list',
            },
        }));
    }

    render() {
        const { rooms, fetchNext, next ,curUserInfo} = this.props;


        return (
            <InfiniteScroll fetchNext={fetchNext} next={next} scrollDirection='down'>
                <div>
                {rooms.map((room) => {
                    let roomName = room.name ? room.name : '';
                    let usersName = room.usersName;
                    if(!room.name) {
                        usersName = usersName.filter(
                            userName => userName._id !== curUserInfo._id
                        );

                        if(usersName.length === 1 ){
                            roomName=usersName[0].userName;
                        }else if(usersName.length >1 ){
                            usersName.forEach(userName => roomName+=userName.userName+'');
                        }
                    }

                    let date = new Date(),
                        author = '',
                        description = '',
                        timestamp = '';
                    if (room && room.lastMessage && room.lastMessage.user) {
                        date.setTime(room.lastMessage.created_at);
                        author = room.lastMessage.user;
                        description = room.lastMessage.message;
                        timestamp = createDateStamp(date);
                    }

                    let typeModifier;
                    if (room && room.lastMessage)
                        typeModifier = !room.lastMessage.readByUser;

                    const messageAuthor = author.name ? author.name : '';
                    return (<InstanceSummaryElement
                        key={room._id}
                        summary={{
                            contact: author,
                            title: `${roomName}`,
                            timestamp: `${timestamp}`,
                            author: `${messageAuthor}`,
                            description: `${description}`,
                            id: `${room._id}`,
                            typeModifier: typeModifier,
                        }}
                        onclick={this.enterRoom.bind(this)}
                    />);
                })}
                </div>
            </InfiniteScroll>
        );
    }
});


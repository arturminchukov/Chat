import React, { Component } from 'react';
import { InstanceSummaryElement } from '../InstanceSummaryElement/InstanceSummaryElement';
import { InfiniteScroll } from '../InfiniteScroll/InfiniteScroll';
import './UserList.css';
import { connect } from 'react-redux';

const stateToProps = state => ({
    users: state.users.items,
    fetchNext: state.route.payload.fetchNext,
    next: state.users.next,
});

export class UserList extends Component {

    clickHandler(contactId) {
        this.props.handleClick(contactId);
    }

    render() {
        const { users, fetchNext, next ,activeContacts} = this.props;

        let userListContent = '';
        if (users && users.length) {
            userListContent = users.map(contact => {
                let activeClassModifier=false;
                if(activeContacts && activeContacts[contact._id])
                    activeClassModifier=true;
                return <InstanceSummaryElement
                    key={contact._id}
                    active={activeClassModifier}
                    summary={{
                        contact,
                        title: `${contact.name}`,
                        author: `${contact.online ? 'online' : ''}`,
                        id: `${contact._id}`,
                        typeModifier:activeClassModifier,
                    }}
                    onclick={this.clickHandler.bind(this)}
                />
            });
        } else {
            userListContent = '';
        }

        return (
            <InfiniteScroll fetchNext={fetchNext} scrollDirection="down" next={next}>
                <div className="UserList">
                    {userListContent}
                </div>
            </InfiniteScroll>

        );
    }
}

export const ConnectedUserList = connect(stateToProps)(UserList);

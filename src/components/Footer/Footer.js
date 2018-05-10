import React, { Component } from 'react';
import { connect } from 'react-redux';
import sendMessage from '../../actions/sendMessage';
import {Button} from '../Button/Button';
import './Footer.css';
import { routeNavigation } from '../../actions/route';

const stateToProps = state => ({
    payload: state.route.payload
});


export class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageText: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onClick = this.openStickers.bind(this);
    }

    openStickers(){
        this.props.dispatch(routeNavigation({
            page: 'stickers_store',
            payload: {
                prevPage: 'chat_page',
                prevPrevPage: this.props.payload.prevPage,
            }
        }))
    }

    handleChange(e) {
        this.setState({ messageText: e.target.value });
    }

    handleSubmit = () => {
        const roomId = this.props.payload.currentRoom;
        const currentMessage = this.state.messageText;
        this.setState({
            messageText: '',
        });
        this.props.dispatch(sendMessage(roomId, currentMessage));
    };

    render() {
        return (
          <footer className="Footer Footer_TextField">
              <Button type='stickers' circle={true} active={true} modifier='s' onClick={this.onClick}/>
              <textarea
                    className="Footer__TextArea"
                    onChange={this.handleChange}
                    rows="1"
                    value={this.state.messageText}
                    placeholder="Type message..."
                >
                </textarea>
              <button
                className='Footer__Button Footer__SubmitButton'
                onClick={this.handleSubmit}
              >
              </button>
            </footer>
        );
    }
}

export const ConnectedFooter = connect(stateToProps)(Footer);

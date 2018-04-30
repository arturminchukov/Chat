import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Header.css';
import { HeaderCenterItems } from '../HeaderCenterItems/HeaderCenterItems';
import { Button } from '../Button/Button';
import { routeNavigation } from '../../actions/route';

const stateToProps = state => ({
    payload: state.route.payload,
    page: state.route.page,
});

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: false,
            select: 'gifs',
        };
    }

    goBack() {
        const payload = this.props.payload;
        if (!payload || !payload.prevPage || payload.prevPage === 'authorization') {
            return null;
        }
        const prevPage = this.props.payload.prevPage;
        this.props.dispatch(routeNavigation({
            page: prevPage,
            payload: {
                ...this.props.payload,
                prevPage: this.props.payload.prevPrevPage ? this.props.payload.prevPrevPage : '',
                prevPrevPage: this.props.payload.prevPrevPrevPage ? this.props.payload.prevPrevPrevPage : '',
            },
        }));
    }

    startSearch() {
        this.setState({
            search: true,
        });
    }

    openChatSettings() {
        this.props.openChatSettings();
    }

    handleSearch(event) {
        this.props.handleSearch(event);
    }

    resetSearch(event) {
        this.props.resetSearch(event);
    }

    cancelSearch() {
        this.setState({
            search: false,
        });
    }

    render() {
        const {
            buttonBack,
            buttonSearch,
            buttonSettings,
            contentType,
        } = this.props;
        const btnFillerStyle = { width: '30px', height: '30px' };
        const btnFiller = <div style={btnFillerStyle}>&nbsp;</div>;
        const leftControl = buttonBack ?
            <Button type="back" active modifier="s" circle onClick={this.goBack.bind(this)}>''</Button> : btnFiller;
        let rightControl = btnFiller,
            changeSelectView;

        if (buttonSearch) {
            rightControl = <Button type="search" active modifier="s" circle onClick={this.startSearch.bind(this)}/>;
        } else if (buttonSettings) {
            rightControl =
                <Button type="settings" active modifier="s" circle onClick={this.openChatSettings.bind(this)}/>;
        }

        let contentTitle = '';
        let contentDesc = '';
        switch (contentType) {
            case 'chats':
                contentTitle = 'BCG';
                break;
            case 'add-room':
                contentTitle = 'Создать kомнату';
                break;
            case 'contacts':
                contentTitle = 'Contacts';
                break;
            case 'add-user':
                contentTitle = 'Select contact';
                break;
            case 'settings':
                contentTitle = 'Settings';
                break;
            case 'chat':
                contentTitle = this.props.contentTitle || 'Chat';
                contentDesc = this.props.contentDesc || '';
                break;
            case 'store':
                contentTitle = '';
                break;
            default:
                contentTitle = 'BCG';
                break;
        }

        let headerContent = '';
        if (this.state.search || this.props.searchIsOn) {
            headerContent = (<div className="Header__search_wrapper">
                <Button type="back" active modifier="s" circle onClick={this.cancelSearch.bind(this)}/>
                <input autoFocus type="text" className="Header__search_input" onChange={this.handleSearch.bind(this)}
                       value={this.props.searchIsOn}/>
                <Button type="delete" active modifier="s" circle onClick={this.resetSearch.bind(this)}/>
            </div>);
        } else {
            headerContent = <HeaderCenterItems title={contentTitle} desc={contentDesc}/>;
        }


        return (
            <header className="Header">
                {leftControl}
                {changeSelectView}
                {headerContent}
                {rightControl}
            </header>
        );
    }
}

export const ConnectedHeader = connect(stateToProps)(Header);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ConnectedHeader } from '../Header/Header';
import { FooterNav } from '../FooterNav/FooterNav';
import { routeNavigation } from '../../actions/route';
import api from '../../api';
import get64BaseImage from '../../helpers/get64BaseImage';
import createAvatar from '../../helpers/createAvatar';
import { updateUserAvatar } from '../../actions/getCurUserInfo';


import './UserPage.css';

const stateToProps = state => ({
    payload: state.route.payload,
    curUserInfo: state.user.curUserInfo,
});

export class UserPage extends Component {
    constructor(props) {
        super(props);

        let avatar = this.props && this.props.curUserInfo && this.props.curUserInfo.avatar;

        this.state = {
            updatePhoto: false,
            userAvatar: avatar,
            newAvatar: avatar,
            fileName: 'Choose photo',
        };
        this.exitHandle = this.exitHandle.bind(this);
        this.submitAvatar = this.submitAvatar.bind(this);
        this.cancelAvatar = this.cancelAvatar.bind(this);
        this.deleteAvatar = this.deleteAvatar.bind(this);
        this.updatePhoto = this.updatePhoto.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.get64BaseImage = get64BaseImage.bind(this);
        this.createAvatar = createAvatar.bind(this);
    }

    exitHandle() {
        api.logoutCurrentUser().then(() => {
            this.props.dispatch({ type: 'USER_SIGN_OUT' });
            this.props.dispatch(routeNavigation({ page: 'authorization' }));
        });
    }

    submitAvatar() {
        api.setCurrentUserAvatar(this.state.newAvatar);
        this.setState({
            updatePhoto: false,
            userAvatar: this.state.newAvatar,
        });
        this.props.dispatch(updateUserAvatar(this.state.newAvatar));
    }

    cancelAvatar() {
        this.setState({
                updatePhoto: false,
            }
        )
    }

    deleteAvatar() {
        this.setState({
            newAvatar: '',
        })
    }

    updatePhoto() {
        this.setState({
            updatePhoto: true,
        })
    }

    handleChange(target) {
        if (target.currentTarget && target.currentTarget.files && target.currentTarget.files['0'] && target.currentTarget.files['0'].name) {
            const photo = target.currentTarget.files['0'];
            this.get64BaseImage(photo);
        }

    }

    render() {

        let name,
            phone = '',
            updatePhotoView = '';
        if (this.props.curUserInfo) {
            ({ name, phone } = this.props.curUserInfo);
        }

        const userAvatar = this.createAvatar(this.state.userAvatar,this.props.curUserInfo,null);
        const newAvatar = this.createAvatar(this.state.newAvatar,this.props.curUserInfo,null);

        if (this.state.updatePhoto) {
            updatePhotoView = <div className='UserPage__ChangePhoto__Overlay'>
                <div className='UserPage__ChangePhoto__Overlay_photo'>
                    <div className='UserPage__ChangePhoto__Overlay_photo_image'>
                        {newAvatar}
                    </div>
                    <div className="UserPage__ChangePhoto__Overlay_photo_upload">
                        <label>
                            <input onChange={this.handleChange} accept=".png, .jpg, .jpeg" type="file" name="file"/>
                            <span>{this.state.fileName}</span>
                        </label>
                    </div>
                    <button onClick={this.deleteAvatar} className="UserPage__ChangePhoto__Overlay_photo_delete"><u>Delete
                        photo</u></button>
                </div>

                <div className="UserPage__ChangePhoto__Overlay_photo_submit">
                    <button onClick={this.cancelAvatar} name='cancel'>Cancel</button>
                    <button onClick={this.submitAvatar} name='submit'>Sumbit</button>
                </div>
            </div>;
        }

        return (
            <div className="UserPage">
                <ConnectedHeader buttonBack={false} contentType="settings"/>
                <div className="UserPage__UserInfo">
                    <h1 className="UserPage__UserName">
                        {name}
                    </h1>
                    <h4 className="UserPage__UserPhone">
                        {phone}
                    </h4>
                    {userAvatar}
                    <p className='UserPage__UserInfo_updatePhoto' onClick={this.updatePhoto}>Update photo</p>

                </div>
                <div className="UserPage__UserControls">
                    <button key="Exit" onClick={this.exitHandle}>
                        <u>Log out</u>
                    </button>
                </div>
                <FooterNav active={this.props.payload.footerNav.active}/>
                {updatePhotoView}
            </div>
        );
    }
}
export const ConnectedUserPage = connect(stateToProps)(UserPage);

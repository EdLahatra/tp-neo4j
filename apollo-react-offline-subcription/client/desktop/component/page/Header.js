import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';
import createHistory from 'history/createBrowserHistory';
import Dropzone from 'react-dropzone';
import Modal from 'react-responsive-modal';
import CommonMainContainer, { reduxConnect } from 'common/component/mainContainer';
import InputText from '../input/text';
import InputPassword from '../input/password';
import UserAvatar from './UserAvatar';


const history = createHistory();

const moment = require('moment-timezone');

const timezon = moment.tz.names();
let disabledRegisterButton = true;

const RegisterButton = (props) => {
  if (props.isFetching) {
    return (<span>Save</span>);
  }

  return (
    <button
      disabled={disabledRegisterButton}
      onClick={props.onClick}
      className={classNames(
        'btn btn-primary',
        {
          disabled: disabledRegisterButton,
        },
      )}
    >Save</button>
  );
};

RegisterButton.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

let disabledNewPassword = false;

const SendNewPasswordButton = (props) => {
  if (props.isFetching) {
    return (<span>Send new password ...</span>);
  }

  return (
    <button
      disabled={disabledNewPassword}
      onClick={props.onClick}
      className="btn btn-primary flat"
    >Send new password</button>);
};

SendNewPasswordButton.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};


class Header extends CommonMainContainer {
  constructor(props) {
    super(props);

    this.changeRegisterTimezone = this.changeRegisterTimezone.bind(this);
  }

  changeRegisterTimezone(e) {
    this.validateRegister(this.state.register);
    this.setState({
      register: {
        ...this.state.register,
        timezone: e.target.value,
      },
    });
  }

  render() {
    disabledRegisterButton = true;
    disabledNewPassword = true;
    if (this.state.buttonNewPassword) {
      disabledNewPassword = false;
    }
    if (this.state.buttonRegister) {
      disabledRegisterButton = false;
    }
    let tmzone = [];
    if (timezon && this.state.editUser) {
      tmzone = (
        <select
          value={this.state.register.timezone ? this.state.register.timezone : ''}
          onChange={this.changeRegisterTimezone}
        >
          <option key={0} value="" />
          {timezon.map(item => (
            <option key={item} value={item}>
              {item}
            </option>),
          )}
        </select>);
    }
    return (
      <div id="header">
        <div className="left">
          <p>Share.place</p>
          <span className="share-url">{window.location.href}</span>
        </div>
        <span
          role="menu"
          tabIndex={0}
          onClick={this.openEditUser}
          className="user-profil-detail"
        >
          <UserAvatar
            user={this.props.user}
            width="32"
            height="32"
            crop="fill"
            className="user-profil"
          />

        </span>
        <Modal
          open={this.state.editUser}
          closeOnEscape={this.oncloseEditUser}
          onClose={this.oncloseEditUser}
          little
          showCloseIcon={false}
          classNames={{ modal: 'edit-profil' }}
        >
          <FontAwesome.FaClose onClick={this.oncloseEditUser} className="close-btn" />
          <div className="edit-wrapper">
            <div className="header">
              <Dropzone
                onDrop={this.addAvatar}
                className="profil-img-edit"
              >
                <div className="overlay-icon">
                  <FontAwesome.FaCamera className="icon-edit-profil" />
                </div>
                <UserAvatar
                  user={this.props.user}
                  width="80"
                  height="80"
                  crop="fill"
                  className="user-profil large-view"
                />
              </Dropzone>
              <span className="user-name">
                <strong>{this.state.register.lastname} {this.state.register.firstname}</strong>
              </span>
              <span
                className="logout"
                onClick={() => { history.push('/'); this.logout(); localStorage.clear(); }}
                role="presentation"
              >
                <FontAwesome.FaSignOut className="icon" />
                Logout
              </span>
            </div>
            {this.state.uptadePassword ?
              <div className="contents">
                <div className="contents">
                  <div className="field">
                    Current Password
                    <InputPassword
                      value={this.state.oldPassword ? this.state.oldPassword : ''}
                      onChange={this.changeOldPassword}
                      placeholder={'New password'}
                    />
                  </div>
                  <div className="field">
                    Password
                    <InputPassword
                      value={this.state.register.password ? this.state.register.password : ''}
                      onChange={this.changeRegisterPassword}
                      placeholder={'New password'}
                    />
                  </div>
                  <div className={this.state.errors.password ? 'invalid-field' : null}>
                    {this.state.errors.password}
                  </div>
                  <div className="field">
                    Confirmed Password
                    <InputPassword
                      value={this.state.passwordConfirm}
                      onChange={this.changePasswordConfirm}
                      placeholder={'Confirm'}
                    />
                  </div>
                  <div className={this.state.errors.passwordConfirm ? 'invalid-field' : null}>
                    {this.state.errors.passwordConfirm}
                  </div>
                </div>
                <div className="centered">
                  <button
                    onClick={this.toogleEditUser}
                    className="btn btn-warning flat"
                    style={{ marginRight: '10px' }}
                  >
                    Back to informations
                  </button>
                  <SendNewPasswordButton
                    isFetching={this.props.isFetchingEdit}
                    onClick={this.updatePassword}
                  />
                </div>
                <div className="error-message">{this.props.info}</div>
              </div>
              : <div className="contents">
                <div className="field">
                  <strong>Email</strong>
                  <InputText
                    value={this.state.register.email ? this.state.register.email : ''}
                    onChange={this.changeRegisterEmail}
                    placeholder={'example@mail.com'}
                    autoFocus
                  />
                </div>
                <div className={this.state.errors.email ? 'invalid-field' : null}>
                  {this.state.errors.email}
                </div>
                <div
                  className="field"
                  style={{
                    display: 'inline-block',
                    width: '49%',
                  }}
                >
                  <strong>Firstname</strong>
                  <InputText
                    value={this.state.register.firstname ? this.state.register.firstname : ''}
                    onChange={this.changeRegisterFirstname}
                    placeholder={'Your firstname'}
                  />
                </div>
                <div
                  className="field"
                  style={{
                    display: 'inline-block',
                    width: '49%',
                    marginLeft: '7px',
                  }}
                >
                  <strong>Lastname</strong>
                  <InputText
                    value={this.state.register.lastname ? this.state.register.lastname : ''}
                    onChange={this.changeRegisterLastname}
                    placeholder={'Your lastname'}
                  />
                </div>
                <div className="field">
                  <strong>Skype</strong>
                  <InputText
                    value={this.state.register.skype ? this.state.register.skype : ''}
                    onChange={this.changeRegisterSkype}
                    placeholder={'Your skype ID'}
                  />
                </div>
                <div className="field">
                  <div>
                    <strong>Timezone</strong>
                    {tmzone}
                  </div>
                </div>
                <span
                  onClick={this.toogleEditUser}
                  role="presentation"
                  className="change-pwd"
                >
                  <FontAwesome.FaLock /> Change password
                </span>
                <div className="footer centered">
                  <div className="field">
                    <RegisterButton
                      isFetching={this.props.isFetchingEdit}
                      onClick={this.tryEdit}
                    />
                  </div>
                </div>
              </div>}
          </div>
        </Modal>
      </div>
    );
  }
}

export default reduxConnect(Header);

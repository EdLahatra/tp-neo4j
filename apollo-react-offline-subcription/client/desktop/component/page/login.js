import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';
import { GoogleLogin } from 'react-google-login';
import createHistory from 'history/createBrowserHistory';
import CommonPageLogin, { reduxConnect } from 'common/component/page/login';
import { validatePassword, validateEmail } from 'common/services/validation';
import InputText from '../input/text';
import InputPassword from '../input/password';
import logo from '../../images/logo.svg';

const moment = require('moment-timezone');

const timezon = moment.tz.names();

const history = createHistory();

// Get the current location.
const location = history.location;

const pathname = location.pathname.split('/password/reset/');
let disabledLoginButton = true;
let disabledRegisterButton = true;
let disabledForgotPasswordButton = true;
let disabledNewPassword = true;

const LoginButton = (props) => {
  if (props.isFetching) {
    return (<span>Connecting ...</span>);
  }

  return (
    <button
      onClick={props.onClick}
      disabled={disabledLoginButton}
      className="btn btn-primary"
    >Connect</button>);
};

LoginButton.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const RegisterButton = (props) => {
  if (props.isFetching) {
    return (<span>Sign up ...</span>);
  }

  return (
    <button
      disabled={disabledRegisterButton}
      onClick={props.onClick}
      className={classNames(
        'btn btn-primary sign-up-btn',
        {
          disabled: disabledRegisterButton,
        },
      )}
    >Sign up!</button>
  );
};

RegisterButton.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const ForgotPasswordButton = (props) => {
  if (props.isFetching) {
    return (<span>Send email ...</span>);
  }

  return (
    <button
      onClick={props.onClick}
      className={classNames(
        'btn btn-primary',
        {
          disabled: disabledForgotPasswordButton,
        },
      )}
    >Send email</button>
  );
};

ForgotPasswordButton.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const SendNewPasswordButton = (props) => {
  if (props.isFetching) {
    return (<span>Send new password ...</span>);
  }

  return (
    <button
      disabled={disabledNewPassword}
      onClick={props.onClick}
      className="btn btn-primary"
    >Send new password</button>);
};

SendNewPasswordButton.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

class PageLogin extends CommonPageLogin {
  constructor(props) {
    super(props);

    this.googleAuth = this.googleAuth.bind(this);
    this.onClickGoogleAuth = this.onClickGoogleAuth.bind(this);
    this.userConnectFaildAferOnclick = this.userConnectFaildAferOnclick.bind(this);
  }

  componentWillMount() {
    if (pathname.length === 2) {
      this.setState({ token: pathname[1] });
    }
    if (validateEmail(this.state.email) && validatePassword(this.state.password)) {
      this.setState({ buttonLogin: true });
      disabledLoginButton = false;
    }
  }

  userConnectFaildAferOnclick() {
    if (this.state.google) {
      this.userConnectFaild();
    }
  }

  componentDidMount() {
    document.addEventListener('keyup', (e) => {
      const key = e.which || e.keyCode;
      if (key === 13 && !this.props.connected) {
        if (this.state.displayRegister && this.state.buttonRegister) {
          this.tryRegister();
        } else if (this.state.token) {
          this.userSendNewPassword();
        } else if (this.state.forgotPassword) {
          this.tryForgotPassword();
        } else if (this.state.buttonLogin && !this.state.displayRegister) {
          this.tryLogin();
        }
      }
    });
  }

  googleAuth(response) {
    if (this.state.google) {
      this.props.googleAuth(response.tokenId);
    }
  }

  onClickGoogleAuth() {
    this.setState({ google: true });
  }

  changeRegisterTimezone(e) {
    this.setState({
      register: {
        ...this.state.register,
        timezone: e.target.value,
      },
    });
  }

  render() {
    let tmzone = [];
    if (timezon && this.state.displayRegister) {
      tmzone = (<select value={this.state.register.timezone} onChange={this.changeRegisterTimezone}>
        <option key={0} value="" />
        {timezon.map(item => (
          <option key={item} value={item}>
            {item}
          </option>),
        )}
      </select>);
    }
    disabledForgotPasswordButton = true;
    disabledRegisterButton = true;
    disabledLoginButton = true;
    disabledNewPassword = true;
    if (this.state.buttonRegister) {
      disabledRegisterButton = false;
    }
    if (this.state.register.email.length && this.state.errors.email === '') {
      disabledForgotPasswordButton = false;
    }
    if (this.state.buttonLogin) {
      disabledLoginButton = false;
    }
    if (this.state.buttonNewPassword) {
      disabledNewPassword = false;
    }
    if (this.props.isNewPassword) {
      history.push('/');
      this.setState({
        token: null,
        info: this.props.info,
        email: '',
        password: '',
      });
    }
    if (this.state.token) {
      return (
        <div className="login forgot-pwd">
          <FontAwesome.FaClose onClick={this.toggleLogin} className="close-btn" />
          <div className="header">
            <h3 className="title-l">New Password</h3>
          </div>
          <div className="contents">
            <div className="field">
              Email
              <InputText
                value={this.state.register.email}
                onChange={this.changeRegisterEmail}
                placeholder={'example@mail.com'}
              />
            </div>
            <div className={this.state.errors.email ? 'invalid-field' : null}>
              {this.state.errors.email}
            </div>
            <div className="field">
              Password
              <InputPassword
                value={this.state.register.password}
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
            <div className={this.state.errors.password ? 'invalid-field' : null}>
              {this.state.errors.password}
            </div>
          </div>
          <div>
            <SendNewPasswordButton
              isFetching={this.props.isFetchingRegister}
              onClick={this.userSendNewPassword}
            />
          </div>
          <div className="error-message">{this.props.info}</div>
        </div>
      );
    }

    if (this.state.forgotPassword) {
      return (
        <div className="login forgot-pwd">
          <FontAwesome.FaClose onClick={this.toggleLogin} className="close-btn" />
          { this.props.isForgotPassword ? <div
            className="centered"
            style={{
              'padding-top': '30px',
              'font-size': '16px',
            }}
          >
            <FontAwesome.FaCheckCircleO style={{
              color: '#26c875',
              'font-size': '50px',
              display: 'block',
              margin: '0 auto 10px',
            }}
            />
            Mail sent successfuly
          </div>
            : <div>
              <div className="header">
                <h3 className="title-l">Forgot Password ?</h3>
              </div>
              <div className="contents">
                <div className="field">
                Email
                  <InputText
                    value={this.state.register.email}
                    onChange={this.changeRegisterEmail}
                    placeholder={'example@mail.com'}
                  />
                </div>
                <div className={this.state.errors.email ? 'invalid-field' : null}>
                  {this.state.errors.email}
                </div>
                <div>{this.props.info}</div>
                <div className="footer centered">
                  <div className="field">
                    <ForgotPasswordButton
                      onClick={this.tryForgotPassword}
                      isFetching={this.props.isFetchingForgotPassword}
                    />
                  </div>
                  <div className={this.state.errors.password ? 'invalid-field' : null}>
                    {this.state.errors.password}
                  </div>
                </div>
              </div>
              <div className="error-message">{this.state.errors.email ? this.props.info : ''}</div>
            </div> }
        </div>
      );
    }

    if (this.state.displayRegister) {
      return (
        <div className="login signup">
          <div className="header">
            <img src={logo} alt="Share.Place logo" className="logo" />
            <h3 className="title-l">Welcome to Share.Place</h3>
          </div>
          <FontAwesome.FaClose onClick={this.toggleRegister} className="close-btn" />
          <div className="contents">
            <div className="field">
              Email
              <InputText
                value={this.state.register.email}
                onChange={this.changeRegisterEmail}
                placeholder={'example@mail.com'}
                autoFocus
              />
            </div>
            <div className={this.state.errors.email ? 'invalid-field' : null}>
              {this.state.errors.email}
            </div>
            <div className="field">
              Password
              <InputPassword
                value={this.state.register.password}
                onChange={this.changeRegisterPassword}
                placeholder={'Choose a password'}
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
                placeholder={'Confirm the password'}
              />
            </div>
            <div className={this.state.errors.passwordConfirm ? 'invalid-field' : null}>
              {this.state.errors.passwordConfirm}
            </div>
            <div className="field">
              Firstname
              <InputText
                value={this.state.register.firstname}
                onChange={this.changeRegisterFirstname}
                placeholder={'Your firstname'}
              />
            </div>
            <div className="field">
              Lastname
              <InputText
                value={this.state.register.lastname}
                onChange={this.changeRegisterLastname}
                placeholder={'Your lastname'}
              />
            </div>
            <div className="field">
              Skype
              <InputText
                value={this.state.register.skype}
                onChange={this.changeRegisterSkype}
                placeholder={'Your skype ID'}
              />
            </div>
            <div className="field">
              <div>
              Timezone
                {tmzone}
              </div>
            </div>
          </div>
          <div className="error-message">{this.props.info}</div>
          <div className="footer centered">
            <div className="field">
              <RegisterButton
                isFetching={this.props.isFetchingRegister}
                onClick={this.tryRegister}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="login signin">
        <div className="overlay" />
        <div className="wrap" >
          <div className="header">
            <img src={logo} alt="Share.Place logo" className="logo" />
            <h3 className="title-l">Welcome to Share.Place</h3>
          </div>
          <div className="contents">
            <div className="item sign-in-field">
              <div className="header signup-area clearfix">
                New user?
                <span
                  onClick={this.toggleRegister}
                  className="link"
                  role="none"
                >
                    Sign up
                </span>
              </div>
              <div className="field">
                Email
                <InputText
                  value={this.state.email}
                  onChange={this.changeEmail}
                  placeholder={'example@mail.com'}
                />
              </div>
              <div className={this.state.errors.email ? 'invalid-field' : null}>
                {this.state.errors.email}
              </div>
              <div className="field clearfix">
                Password
                <button
                  onClick={this.toggleForgotPassword}
                  className="link"
                  tabIndex="-3"
                >
                  Forgot password
                </button>
                <InputPassword value={this.state.password} onChange={this.changePassword} />
              </div>
              <div className="error-message">{this.props.info}</div>
              <div className="field" style={{ margin: 0 }}>
                <LoginButton
                  isFetching={this.props.isFetchingRegister}
                  onClick={() => this.tryLogin()}
                />
              </div>
              <span className="or">Or</span>
            </div>
            <div className="item sign-in-btn">
              <button className="btn btn-facebook">
                <FontAwesome.FaFacebook className="social-btn" /> Sign in with Facebook
              </button>
              <GoogleLogin
                clientId="519286638345-iqupvlcp25fhoi3cluivfm1r5psa1cpq.apps.googleusercontent.com"
                scope="https://www.googleapis.com/auth/analytics"
                onSuccess={this.googleAuth}
                onFailure={this.userConnectFaildAferOnclick}
                offline={false}
                approvalPrompt="force"
                responseType="id_token"
                isSignedIn
                className="btn btn-google"
              >
                <div
                  onClick={this.onClickGoogleAuth}
                  role="none"
                >
                  <FontAwesome.FaGooglePlus
                    className="social-btn"
                  /> Sign in with Google
                </div>
              </GoogleLogin>
            </div>

          </div>
          <div className="footer">
            <span className="copyrights">
              Copyright © 2017 Share.Place. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default reduxConnect(PageLogin);

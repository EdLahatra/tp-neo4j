import React from 'react';
import Modal from 'react-responsive-modal';
import classNames from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';
import CommonPopupInvite, { reduxConnect } from 'common/component/popup/invite';
import InputTextarea from '../input/textarea';
import InputText from '../input/text';
import loaderSpin from '../../images/loader.svg';

class PopupInvite extends CommonPopupInvite {
  handleRoleChange(id) {
    return (e) => {
      const newUsersInvite = this.state.usersInvite.map((role, key) => {
        if (id !== key) return role;
        return { ...role, role: e.target.value };
      });
      this.setState({ usersInvite: newUsersInvite });
    };
  }

  render() {
    if (!this.isVisible()) {
      return null;
    }

    return (
      <Modal
        open={!this.props.connected}
        onClose={() => false}
        little
        showCloseIcon={false}
        classNames={{ modal: 'custom-modal' }}
      >
        <div className="wrap invitation">
          <FontAwesome.FaClose onClick={this.closeInvite} className="close-btn" />
          <div className="header">
            <h3 className="title-l">Send invites</h3>
          </div>
          <div className="contents">
            <div className="invite-content">
              {this.state.usersInvite.map((item, key) => (
                <div className="invite-fieldset" key={`email #${key + 1}`}>
                  <div className="field">
                    Email
                    <InputText
                      type="text"
                      placeholder={`email #${key + 1} invite`}
                      value={item.email}
                      onChange={this.handleEmailChange(key)}
                    />
                    <div className={item.error ? 'invalid-field invite' : null} >
                      {item.error}
                    </div>
                  </div>
                  <span style={{ margin: '12px 10px 0', alignSelf: 'center' }} >Can: </span>
                  <div>
                    Access
                    <select value={item.role} onChange={this.handleRoleChange(key)} >
                      <option value="owner">Modify & export docs + approve + invite people</option>
                      <option value="writer">Modify & export docs</option>
                      <option value="reader">Read only & export docs</option>
                    </select>
                  </div>
                  {this.state.numberFiels > 1
                    ? <FontAwesome.FaMinusCircle
                      onClick={this.handleRemove(key)}
                      className="small"
                    />
                    : null
                  }
                </div>
              ))}
            </div>
            <div className="invite-more">
              <span className="add-more">
                  Invite more
                <FontAwesome.FaPlusCircle className="icon" onClick={this.handleAdd} />
              </span>
            </div>
            <div className="field message">
              Message for external users
              <InputTextarea
                value={this.state.message}
                onChange={this.changeMessage}
                placeholder="Hello ! Join me on Share.Place"
              />
            </div>
            <div className="footer centered">
              <button
                disabled={this.state.buttonInvite || this.props.isInvite}
                onClick={() => {
                  localStorage.removeItem('invite');
                  this.sendInvite();
                }}
                className={classNames(
                  'btn btn-primary centered',
                  {
                    disabled: this.state.buttonInvite && this.props.isInvite,
                  },
                )}
              >
                {this.props.isInvite ? <span className="loading"><img
                  className="loading-spinner"
                  src={loaderSpin}
                  alt="Loader"
                />   Please wait...</span>
                  : <div> Invite & send <FontAwesome.FaPaperPlane /> </div>}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default reduxConnect(PopupInvite);

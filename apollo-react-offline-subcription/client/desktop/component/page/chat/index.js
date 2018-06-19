import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Modal from 'react-responsive-modal';
import * as FontAwesome from 'react-icons/lib/fa';
import Dropzone from 'react-dropzone';
import { lastConnectionTime, timeTz } from 'common/services/function';
import CommonPageChat, {
  reduxConnect,
} from 'common/component/page/chat';
import PageDiscussions from '../discussions';
import AddMessage from './addMessage';
import loaderSpin from '../../../images/loader.svg';
import UserAvatar from './../UserAvatar';

const userID = localStorage.getItem('@userId');

//
// Message line
//

const Message = props => (
  <div
    className={classNames(
      'message',
      {
        user: props.me,
      },
    )}
  >
    <div className="date-of-message">
      <small>
        {lastConnectionTime(Math.floor(new Date().getTime() / 1000), props.data.time)}
      </small>
    </div>
    <div className={classNames(
      'message-content',
      {
        user: props.me,
      },
    )}
    >
      {props.data.text}</div>
    <span
      className="identity in-list-profil"
      role="menuitem"
      tabIndex={props.data.user.id}
      onClick={() => props.openUser(
        props.user && props.user.avatar && props.user.id === props.data.user.id ? props.user
          : props.data.user, 'folderUser')
      }
    >
      <UserAvatar
        user={props.data.user}
        width="32"
        height="32"
        crop="fill"
        radius="max"
        className="user-profil large in-list"
      />
    </span>
  </div>
);

Message.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  me: PropTypes.bool.isRequired,
  openUser: PropTypes.func.isRequired,
  // eslint-disable-next-line
  user: PropTypes.object.isRequired,
};

//
// Audio files line
//

const Audio = props => (
  <div className={classNames(
    'message audio-message',
    {
      user: props.me,
    },
  )}
  >
    <div className="date-of-message">
      <small>
        {lastConnectionTime(Math.floor(new Date().getTime() / 1000), props.data.time)}
      </small>
    </div>
    <div className={classNames(
      'audio-player',
      {
        user: props.me,
      },
    )}
    >
      <audio
        controls
        src={props.data.file.link}
      >
        <track kind="captions" />
      </audio>
    </div>
    <span
      className="identity"
      role="menuitem"
      tabIndex={props.data.user.id}
      onClick={() => props.openUser(
        props.user && props.user.avatar && props.user.id === props.data.user.id ? props.user
          : props.data.user, 'folderUser')
      }
    >
      {props.user && props.user.avatar && props.user.id === props.data.user.id ?
        (<UserAvatar
          user={props.user}
          width="32"
          height="32"
          crop="fill"
          radius="max"
          className="user-profil large in-list"
        />) :
        (<UserAvatar
          user={props.data.user}
          width="32"
          height="32"
          crop="fill"
          radius="max"
          className="user-profil large in-list"
        />)}
    </span>
  </div>
);

Audio.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  file: PropTypes.object.isRequired,
  me: PropTypes.bool.isRequired,
  openUser: PropTypes.func.isRequired,
  // eslint-disable-next-line
  user: PropTypes.object.isRequired,
};

const Comment = props => (
  <div className={classNames(
    'message comment',
    {
      user: props.me,
    },
  )}
  >
    <div className="date-of-message">
      <small>
        {lastConnectionTime(Math.floor(new Date().getTime() / 1000), props.data.time)}
      </small>
    </div>
    <div className={classNames(
      'message-content',
      {
        user: props.me,
      },
    )}
    >
      <span className="comment-detail">
        <FontAwesome.FaComment />
        Comment on version {props.data.version}
      </span>
      <span className="comment-text">
        {props.data.text}
      </span>
    </div>
    <span
      className="identity"
      role="menuitem"
      tabIndex={props.data.user.id}
      onClick={() => props.openUser(
        props.user && props.user.avatar && props.user.id === props.data.user.id ? props.user
          : props.data.user, 'folderUser')
      }
    >
      {props.user && props.user.avatar && props.user.id === props.data.user.id ?
        (<UserAvatar
          user={props.user}
          width="32"
          height="32"
          crop="fill"
          radius="max"
          className="user-profil large in-list"
        />) :
        (<UserAvatar
          user={props.data.user}
          width="32"
          height="32"
          crop="fill"
          radius="max"
          className="user-profil large in-list"
        />)}
    </span>
  </div>
);

Comment.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  me: PropTypes.bool.isRequired,
  openUser: PropTypes.func.isRequired,
  // eslint-disable-next-line
  user: PropTypes.object.isRequired,
};

const UserRemove = props => (
  <div className={classNames(
    'message',
    {
      user: props.me,
    },
  )}
  >

    <div className="date-of-message">
      <small>deleted {lastConnectionTime(Math.floor(new Date().getTime() / 1000), props.data.time)}
      </small>
    </div>

    <div className={classNames(
      'message-content delete-message',
      {
        user: props.me,
      },
    )}
    >
      <FontAwesome.FaCheckCircle className="icon" />
      {props.me ? `I remove the file version ${props.data.version}`
        : `${props.data.user.lastname} remove the file version ${props.data.version}`}
    </div>
    <div className="header">
      <span
        className="identity"
        role="menuitem"
        tabIndex={props.data.user.id}
        onClick={() => props.openUser(
          props.user && props.user.avatar && props.user.id === props.data.user.id ? props.user
            : props.data.user, 'folderUser')
        }
      >
        { props.user && props.user.avatar && props.user.id === props.data.user.id ?
          <UserAvatar
            user={props.user}
            width="32"
            height="32"
            crop="fill"
            radius="max"
            className="user-profil large in-list"
          />
          : <UserAvatar
            user={props.data.user}
            width="32"
            height="32"
            crop="fill"
            radius="max"
            className="user-profil large in-list"
          />

        }

      </span>
    </div>
  </div>
);

UserRemove.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  me: PropTypes.bool.isRequired,
  openUser: PropTypes.func.isRequired,
  // eslint-disable-next-line
  user: PropTypes.object.isRequired,
};

//
// Approved line
//

const Approved = props => (
  <div className={classNames(
    'message',
    {
      user: props.me,
    },
  )}
  >
    <div className="date-of-message">
      <small>
        {lastConnectionTime(Math.floor(new Date().getTime() / 1000), props.data.time)}
      </small>
    </div>
    <div className={classNames(
      'message-content approved-message',
      {
        user: props.me,
      },
    )}
    >
      <FontAwesome.FaCheckCircle className="icon" />
      {props.me ? `I approved the file version ${props.data.version}`
        : `${props.data.user.lastname} approved the file version ${props.data.version}`}
    </div>
    <div className="header">
      <span
        className="identity"
        role="menuitem"
        tabIndex={props.data.user.id}
        onClick={() => props.openUser(
          props.user && props.user.avatar && props.user.id === props.data.user.id ? props.user
            : props.data.user, 'folderUser')
        }
      >
        {props.user && props.user.avatar && props.user.id === props.data.user.id ?

          (<UserAvatar
            user={props.user}
            width="32"
            height="32"
            crop="fill"
            radius="max"
            className="user-profil large in-list"
          />)
          :

          (<UserAvatar
            user={props.data.user}
            width="32"
            height="32"
            crop="fill"
            radius="max"
            className="user-profil large in-list"
          />)}
      </span>
    </div>
  </div>
);

Approved.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  me: PropTypes.bool.isRequired,
  openUser: PropTypes.func.isRequired,
  // eslint-disable-next-line
  user: PropTypes.object.isRequired,
};

//
// Approved line
//

const Unlocked = props => (
  <div className={classNames(
    'message',
    {
      user: props.me,
    },
  )}
  >
    <div className="date-of-message">
      <small>
        {lastConnectionTime(Math.floor(new Date().getTime() / 1000), props.data.time)}
      </small>
    </div>
    <div className={classNames(
      'message-content locked-message',
      {
        user: props.me,
      },
    )}
    >
      <FontAwesome.FaPencil className="icon" />
      {props.me ? `I edited version ${props.data.version}`
        : `${props.data.user.lastname} will edited version ${props.data.version}`}
    </div>
    <div className="header">
      <span
        className="identity"
        role="menuitem"
        tabIndex={props.data.user.id}
        onClick={() => props.openUser(
          props.user && props.user.avatar && props.user.id === props.data.user.id ? props.user
            : props.data.user, 'folderUser')
        }
      >
        {props.user && props.user.avatar && props.user.id === props.data.user.id ?
          (<UserAvatar
            user={props.user}
            width="32"
            height="32"
            crop="fill"
            radius="max"
            className="user-profil large in-list"
          />) :
          (<UserAvatar
            user={props.data.user}
            width="32"
            height="32"
            crop="fill"
            radius="max"
            className="user-profil large in-list"
          />)
        }
      </span>
    </div>
  </div>
);

Unlocked.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  me: PropTypes.bool.isRequired,
  openUser: PropTypes.func.isRequired,
  // eslint-disable-next-line
  user: PropTypes.object.isRequired,
};

const Locked = props => (
  <div className={classNames(
    'message',
    {
      user: props.me,
    },
  )}
  >
    <div className="date-of-message">
      <small>
        {lastConnectionTime(Math.floor(new Date().getTime() / 1000), props.data.time)}
      </small>
    </div>
    <div className={classNames(
      'message-content locked-message',
      {
        user: props.me,
      },
    )}
    >
      <FontAwesome.FaPencil className="icon" />
      {props.me ? `I am editing version ${props.data.version}`
        : `${props.data.user.lastname} is editing version ${props.data.version}`}
    </div>
    <div className="header">
      <span
        className="identity"
        role="menuitem"
        tabIndex={props.data.user.id}
        onClick={() => props.openUser(
          props.user && props.user.avatar && props.user.id === props.data.user.id ? props.user
            : props.data.user, 'folderUser')
        }
      >
        {props.user && props.user.avatar && props.user.id === props.data.user.id ?
          (<UserAvatar
            user={props.user}
            width="32"
            height="32"
            crop="fill"
            radius="max"
            className="user-profil large in-list"
          />) :
          (<UserAvatar
            user={props.data.user}
            width="32"
            height="32"
            crop="fill"
            radius="max"
            className="user-profil large in-list"
          />)
        }
      </span>
    </div>
  </div>
);

Locked.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  me: PropTypes.bool.isRequired,
  openUser: PropTypes.func.isRequired,
  // eslint-disable-next-line
  user: PropTypes.object.isRequired,
};

//
// Unapproved line
//

const Unapproved = props => (
  <div className={classNames(
    'message',
    {
      user: props.me,
    },
  )}
  >
    <div className="date-of-message">
      <small>
        {lastConnectionTime(Math.floor(new Date().getTime() / 1000), props.data.time)}
      </small>
    </div>
    <div className={classNames(
      'message-content unapproved-message',
      {
        user: props.me,
      },
    )}
    >
      <FontAwesome.FaTimesCircle className="icon" />
      {props.me ? `I unapproved the file version ${props.data.version}`
        : `${props.data.user.lastname} unapproved the file version ${props.data.version}`}
    </div>
    <div className="header">
      <span
        className="identity"
        role="menuitem"
        tabIndex={props.data.user.id}
        onClick={() => props.openUser(
          props.user && props.user.avatar && props.user.id === props.data.user.id ? props.user
            : props.data.user, 'folderUser')
        }
      >
        {props.user && props.user.avatar && props.user.id === props.data.user.id ?
          (<UserAvatar
            user={props.user}
            width="32"
            height="32"
            crop="fill"
            radius="max"
            className="user-profil large in-list"
          />) :
          (<UserAvatar
            user={props.data.user}
            width="32"
            height="32"
            crop="fill"
            radius="max"
            className="user-profil large in-list"
          />)
        }
      </span>
    </div>
  </div>
);

Unapproved.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  me: PropTypes.bool.isRequired,
  openUser: PropTypes.func.isRequired,
  // eslint-disable-next-line
  user: PropTypes.object.isRequired,
};

//
// File line
//

const File = props => (
  <div className={classNames(
    'message',
    {
      user: props.me,
    },
  )}
  >

    <div
      className="file-details-version"
      id={`V${props.data.file.version}`}
    >
      <p className="version">Version : {props.data.file.version}</p>
      <span
        className="version-btn-toggle"
        role="none"
        onClick={() => props.toogleChat(props.data.file.version.toString())}
      >
        <FontAwesome.FaMinusCircle className="toggle-version" />
      </span>
    </div>

    <div className={classNames(
      'message-content file',
      {
        user: props.me,
      },
    )}
    >
      <div className="miniature">
        <span className="file-type-icon">
          {PageDiscussions.icons(props.data.file.type.split('/')[0], props.data.file)}
        </span>
        {props.data.file.approved ?
          <FontAwesome.FaCheckCircle className="status-approved" />
          : null}
        {props.data.file.locked ? <FontAwesome.FaPencil className="status-locked" /> : null}
      </div>

      <div
        className="file-details"
        onClick={() => props.startDownload(props.data)}
        role="none"
      >
        <span className="file-name"><strong>{props.data.file.name}</strong></span>
        <span className="file-type">{props.data.file.type}</span>
        <span className="file-size">
          {(props.data.file.size / 1048576).toFixed(2)} MB
        </span>
      </div>

      <span className="version">V.{props.data.file.version}</span>

      <FontAwesome.FaEllipsisV
        className="more"
        onClick={() => props.openModalApprovedAction(props.data)}
      />
      {props.isOpen && props.data.file && props.data.file.id === props.file.file.id ? <div
        className="edit-popup"
      >
        <div
          onClick={() => props.discussionApproved(props.data)}
          role="presentation"
          className="status-action"
        >
          <span className="file-name"><strong>{props.data.file.name}</strong></span>
          <span className="version">V.{props.data.file.version}</span>

          {props.data && props.data.file.approved ? <span
            className="desapprove"
          >
            <FontAwesome.FaTimesCircle className="icon" />
            Desapprove
          </span> : <div
            className="approve"
          >
            <FontAwesome.FaCheckCircle className="icon" />
            Approve
          </div>}
        </div>
        <span
          onClick={() => props.discussionRemoveFile(props.data)}
          role="none"
          className="detete-file"
        >
          <FontAwesome.FaTrash className="icon" /> Delete
        </span>
      </div>
        : null }
    </div>
    <span
      className="identity"
      role="menuitem"
      tabIndex={props.data.user.id}
      onClick={() => props.openUser(
        props.user && props.user.avatar && props.user.id === props.data.user.id ? props.user
          : props.data.user, 'folderUser')
      }
    >
      {props.user && props.user.avatar && props.user.id === props.data.user.id ?
        (<UserAvatar
          user={props.user}
          width="32"
          height="32"
          crop="fill"
          radius="max"
          className="user-profil large in-list"
        />) :
        (<UserAvatar
          user={props.data.user}
          width="32"
          height="32"
          crop="fill"
          radius="max"
          className="user-profil large in-list"
        />)
      }
    </span>
    <div className={classNames(
      'date-of-message date-of-message-file',
      {
        noneVersion: props.me,
      },
    )}
    >
      <small>
        {lastConnectionTime(Math.floor(new Date().getTime() / 1000), props.data.time)}
      </small>
    </div>
  </div>
);

File.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  startDownload: PropTypes.func.isRequired,
  openModalApprovedAction: PropTypes.func.isRequired,
  me: PropTypes.bool.isRequired,
  discussionRemoveFile: PropTypes.func.isRequired,
  discussionApproved: PropTypes.func.isRequired,
  // eslint-disable-next-line
  isOpen: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  file: PropTypes.object.isRequired,
  toogleChat: PropTypes.func.isRequired,
  openUser: PropTypes.func.isRequired,
  // eslint-disable-next-line
  user: PropTypes.object.isRequired,
};

const Release = props => (
  <div className="release-wrapper">
    <div className="clearfix" />
    <div className="release-window">
      <h3 className="title">
        The file has been downloaded to your browser! V{props.data.version}
      </h3>
      <div className="text">
      You can now Open & Modify your file.
      When done, Save it then click on Browse to release to pick your file or drag & drop
      it here to share your new version.
      </div>
      <div className="footer centered">
        <Dropzone onDrop={props.addFileAndUnlockFile} className="add-file">
          <button className="btn btn-primary" onClick={props.unlockFileState}>Browse</button>
        </Dropzone>
        <button onClick={() => props.unlockFile(props.data)} className="btn btn-warning">
        cancel
        </button>
      </div>
    </div>
  </div>
);

Release.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  addFileAndUnlockFile: PropTypes.func.isRequired,
  unlockFile: PropTypes.func.isRequired,
  unlockFileState: PropTypes.func.isRequired,
};

const versionIds = localStorage.getItem('@version');

class PageChat extends CommonPageChat {
  constructor(props) {
    super(props);

    this.discussionApproved = this.discussionApproved.bind(this);
    this.discussionRemoveFile = this.discussionRemoveFile.bind(this);
    this.showMenu = this.showMenu.bind(this);
  }

  componentWillMount() {
    this.oncloseUserInfo();
    if (versionIds) {
      const results = versionIds.split(',');
      this.setState({ ids: results });
    }
  }

  discussionRemoveFile(data) {
    this.props.discussionAction(
      this.props.currentDiscussion,
      'remove',
      data.file.id,
      data.file.version,
    );
    this.closeModale();
  }

  discussionApproved(data) {
    const approved = data.file.approved ? 'unapprove' : 'approve';
    if (data) {
      this.props.discussionAction(
        this.props.currentDiscussion,
        approved,
        data.file.id,
        data.file.version,
      );
    }
    this.closeModale();
  }

  version(version) {
    localStorage.removeItem('@version');
    let ids = this.state.ids;
    const info = `${version.toString()}/${this.props.currentDiscussion.toString()}`;
    if (info && ids.indexOf(info) < 0) {
      ids.push(info);
    } else {
      ids = ids.filter(key => key !== info);
    }
    this.setState({ ids });
    localStorage.setItem('@version', ids);
  }

  showMenu() {
    if (this.state.isOpen) {
      this.closeModale();
    }
  }

  closeMenu() {
    this.setState({ showMenu: false }, () => {
      document.removeEventListener('click', this.closeMenu);
    });
  }

  render() {
    if (!this.currentDiscussion()) {
      return (
        <div className="no-discussion flex-item">
          No discussion selected
        </div>
      );
    }

    let time;
    if (this.state.userCurrent && this.state.userCurrent.timezone) {
      if (timeTz(this.state.userCurrent.timezone)) {
        time = (
          <span>
            {this.state.userCurrent.timezone}
            {` ${timeTz(this.state.userCurrent.timezone).hour} `}
            :{timeTz(this.state.userCurrent.timezone).min}
          </span>
        );
      }
    }
    const messages = [];
    let isClose = false;
    let isCloseFile = false;
    let isShowed = -1;
    isShowed = Boolean(this.locked() && this.locked().length && userID && this.locked()[0].locked_by
      && userID.toString() === this.locked()[0].locked_by.toString());
    if (this.currentDiscussion().messages && this.currentDiscussion().messages.records) {
      this.currentDiscussion().messages.records.sort(
        (a, b) => a.version - b.version || a.time - b.time)
        .forEach((message, key) => {
          const me = localStorage.getItem('@userId')
          && localStorage.getItem('@userId').toString() === message.user.id.toString();
          if (message.version && this.props.currentDiscussion) {
            const vs = `${message.version.toString()}/${this.props.currentDiscussion.toString()}`;
            isClose = this.state.ids && (this.state.ids.indexOf(vs) < 0);
          }
          if (message.file && message.file.version && this.props.currentDiscussion) {
            const vsFile =
            `${message.file.version.toString()}/${this.props.currentDiscussion.toString()}`;
            isCloseFile = this.state.ids && (this.state.ids.indexOf(vsFile) < 0);
          }
          switch (message.type) {
            case 'approved':
              if (isClose) {
                messages.push(
                  <Approved
                    key={`${message.id} ${message.time} ${key + 1}`}
                    data={message}
                    me={me}
                    openUser={this.openUser}
                    user={this.props.user ? this.props.user : {}}
                  />,
                );
              }
              break;
            case 'unapproved':
              if (isClose) {
                messages.push(
                  <Unapproved
                    key={`${message.id} ${message.time} ${key + 1}`}
                    data={message}
                    me={me}
                    openUser={this.openUser}
                    user={this.props.user ? this.props.user : {}}
                  />,
                );
              }
              break;
            case 'message':
              if (isClose) {
                messages.push(
                  <Message
                    key={`${message.id} ${message.time} ${key + 1}`}
                    data={message}
                    me={me}
                    openUser={this.openUser}
                    user={this.props.user ? this.props.user : {}}
                  />,
                );
              }
              break;
            case 'audio':
              if (isClose) {
                messages.push(
                  <Audio
                    key={`${message.id} ${message.time} ${key + 1}`}
                    data={message}
                    startDownload={this.props.startDownload}
                    openModalApprovedAction={this.openModalApprovedAction}
                    me={me}
                    discussionRemoveFile={this.discussionRemoveFile}
                    discussionApproved={this.discussionApproved}
                    file={this.state.data}
                    isOpen={this.state.isOpen}
                    toogleChat={this.version}
                    openUser={this.openUser}
                    user={this.props.user ? this.props.user : {}}
                  />,
                );
              } break;
            case 'comment':
              if (isClose) {
                messages.push(
                  <Comment
                    key={`${message.id} ${message.time} ${key + 1}`}
                    data={message}
                    me={me}
                    openUser={this.openUser}
                    user={this.props.user ? this.props.user : {}}
                  />,
                );
              }
              break;
            case 'lock':
              if (isClose) {
                messages.push(
                  <Locked
                    key={`${message.id} ${message.time} ${key + 1}`}
                    data={message}
                    me={me}
                    openUser={this.openUser}
                    user={this.props.user ? this.props.user : {}}
                  />,
                );
              } break;
            case 'unlock':
              if (isClose) {
                messages.push(
                  <Unlocked
                    key={`${message.id} ${message.time} ${key + 1}`}
                    data={message}
                    me={me}
                    openUser={this.openUser}
                    user={this.props.user ? this.props.user : {}}
                  />,
                );
              } break;
            case 'userRemove':
              messages.push(
                <UserRemove
                  key={`${message.id} ${message.time} ${key + 1}`}
                  data={message}
                  me={me}
                  openUser={this.openUser}
                  user={this.props.user ? this.props.user : {}}
                />,
              );
              break;
            case 'release':
              if (isClose && isShowed) {
                messages.push(
                  <Release
                    key={`${message.id} ${message.time} ${key + 1}`}
                    data={message}
                    me={me}
                    openUser={this.openUser}
                    addFileAndUnlockFile={this.addFileAndUnlockFile}
                    unlockFile={this.unlockFile}
                    unlockFileState={() => this.unlockFileState(message)}
                    user={this.props.user ? this.props.user : {}}
                  />,
                );
              }
              break;
            case 'file':
              if (!message.file.removed) {
                if (isCloseFile) {
                  messages.push(
                    <File
                      key={`${message.id} ${message.time} ${key + 1}`}
                      data={message}
                      startDownload={this.props.startDownload}
                      openModalApprovedAction={this.openModalApprovedAction}
                      me={me}
                      discussionRemoveFile={this.discussionRemoveFile}
                      discussionApproved={this.discussionApproved}
                      file={this.state.data}
                      isOpen={this.props.userInfoIsOpen}
                      closeModale={this.closeModale}
                      toogleChat={this.version}
                      openUser={this.openUser}
                      isShowed={isShowed}
                      addFileAndUnlockFile={this.addFileAndUnlockFile}
                      unlockFile={this.unlockFile}
                      unlockFileState={() => this.unlockFileState(message.file)}
                      user={this.props.user ? this.props.user : {}}
                    />,
                  );
                } else {
                  messages.push(
                    <div
                      key={`${message.id} ${message.time}`}
                      className="file-details-version"
                      role="none"
                    >
                      <p className="version">Version : {message.file.version}</p>
                      <span
                        className="version-btn-toggle"
                        role="none"
                        onClick={() => this.version(message.file.version.toString())}
                      >
                        <FontAwesome.FaPlusCircle className="toggle-version" />
                      </span>
                    </div>,
                  );
                }
              }
              break;
        // no default
          }
        });
    }
    return (
      <div className="flex-item" onClick={this.showMenu} role="presentation" >
        <div className="title-chat">{this.currentDiscussion().title}</div>
        {/* <div className="board-tips">
          <span className="roby-avatar-tips"><img src={robyAvatar} alt="Roby avatar" /></span>
          <ul className="steps">
            <li className="step-active">
              1. Drag and drop a file
              <FontAwesome.FaCheckCircle
                className="check-step"
                style={{ fontSize: '20px', marginLeft: '10px' }}
              />
            </li>
            <li>2. Invite some people</li>
            <li>3. Add a comment</li>
          </ul>
        </div> */}
        <div className="message-container">{messages}</div>
        {this.props.isUpload ? <span className="loading"><img
          className="loading-spinner"
          src={loaderSpin}
          alt="Loader"
        />   Please wait...</span> : null}
        {this.props.isLoaded ? <span className="loading"><img
          className="loading-spinner"
          src={loaderSpin}
          alt="Loader"
        />   Please wait...</span> : null}
        <AddMessage />
        <Modal
          open={this.state.openInfo}
          closeOnEscape={this.oncloseUserInfo}
          onClose={this.oncloseUserInfo}
          little
          showCloseIcon={false}
          classNames={{ modal: 'custom-modal' }}
        >
          <div className="align-right">
            <FontAwesome.FaClose onClick={this.oncloseUserInfo} style={{ textAlign: 'right' }} />
            {this.state.userCurrent && this.state.openInfo ?
              <div className="contact-detail folder-user">
                <div className="header">
                  <span className="identity">
                    {this.props.user && this.props.user.avatar
                    && this.props.user.id === this.state.userCurrent.id
                      ? (<UserAvatar
                        user={this.props.user}
                        width="32"
                        height="32"
                        crop="fill"
                        radius="max"
                        className="user-profil large in-list"
                      />) :
                      (<UserAvatar
                        user={this.state.userCurrent}
                        width="32"
                        height="32"
                        crop="fill"
                        radius="max"
                        className="user-profil large in-list"
                      />)
                    }
                    {this.state.userCurrent.lastname
                      ? this.state.userCurrent.lastname : this.state.userCurrent.email}
                  </span>
                </div>

                <div className="contents">
                  <span className="user-role">
                    <FontAwesome.FaCheckCircle className="status" />
                    <p className="role">{this.props.role}</p>
                  </span>
                  <div className="info-user">
                    <span className="item">
                      <FontAwesome.FaEnvelope className="mail" onClick={this.openEmail} />
                      {this.state.userCurrent.email}
                    </span>

                    {this.state.userCurrent.skype ? <div className="skype-infos">
                      <span className="skype-item">
                        <FontAwesome.FaSkype className="skype-icon" />Text:
                        <a href={`skype:${this.state.userCurrent.skype}?chat`}>
                          {this.state.userCurrent.skype}
                        </a>
                      </span>

                      <span className="skype-item">
                        <FontAwesome.FaSkype className="skype-icon" />Call:
                        <a href={`skype:${this.state.userCurrent.skype}?call`}>
                          {this.state.userCurrent.skype}
                        </a>
                      </span>
                    </div> : null }
                    {this.state.userCurrent.timezone ? <span className="item">
                      <FontAwesome.FaMapMarker className="pin-map-icon" />
                      {time}
                    </span> : null}
                    <span
                      className="item delete-contact"
                      onClick={this.deleteRole}
                      role="presentation"
                    >
                      <FontAwesome.FaTrash className="delete" />
                      Delete
                    </span>
                  </div>
                </div>
                <div className="footer">
                  <p>last connection: {
                    lastConnectionTime(
                      Math.floor(new Date().getTime() / 1000),
                      this.state.userCurrent.last_connection)
                  }
                  </p>
                </div>
              </div>
              : null}
          </div>
        </Modal>
      </div>
    );
  }
}

export default reduxConnect(PageChat);

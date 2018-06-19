import React from 'react';
import classNames from 'classnames';
import Modal from 'react-responsive-modal';
import * as FontAwesome from 'react-icons/lib/fa';
import createHistory from 'history/createBrowserHistory';
import CommonPageDiscussions, {
  reduxConnect,
} from 'common/component/page/discussions';
import { lastConnectionTime, timeTz } from 'common/services/function';
import StartDiscussion from './startDiscussion';
import Invite from './invite';
import InputText from '../../input/text';
import docFile from '../../../images/file_type/doc.png';
import xlsFile from '../../../images/file_type/xls.png';
import pptFile from '../../../images/file_type/ppt.png';
import txtFile from '../../../images/file_type/txt.png';
import archiveFile from '../../../images/file_type/archive.png';
import pdfFile from '../../../images/file_type/pdf.png';
import defaultFile from '../../../images/file_type/file.png';
import audioFile from '../../../images/file_type/audio.png';
import videoFile from '../../../images/file_type/video.png';
import NewFile from './newFile';
import loaderSpin from '../../../images/loader.svg';
import UserAvatar from './../UserAvatar';
import DiscussionOnBoarding from './../../onboarding/discussionOnBoarding';
import CommentOnBoarding from './../../onboarding/commentOnboarding';
import InviteOnBoarding from './../../onboarding/inviteOnboarding';

const history = createHistory();
let discussionList = [];
let time;
const allTopicsID = 0;
class PageDiscussions extends CommonPageDiscussions {
  constructor(props) {
    super(props);

    this.openEmail = this.openEmail.bind(this);
    this.escFunction = this.escFunction.bind(this);
  }

  openDiscussioonAction(id) {
    history.push({
      pathname: `/place/${this.props.currentPlace}/folder/${this.props.currentFolder}/topics/${id}`,
    });
  }

  escFunction(e) {
    const key = e.which || e.keyCode;
    if (key === 27 && this.state.renameIsOpen) {
      this.setState({
        isOpen: false,
        deleteIsOpen: false,
        roleIsOpen: false,
        renameIsOpen: false,
        selectedDiscussionId: 0,
        isOpenUser: false,
        order: true,
        isOpenFilter: false,
        userCurrent: null,
        openInfo: false,
      });
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escFunction, false);
    document.addEventListener('keypress', (e) => {
      const key = e.which || e.keyCode;
      if (key === 13 && this.state.renameIsOpen) {
        this.renameDiscussion();
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  openEmail() {
    const otherWindow = window.open();
    const url = `mailto:${this.state.userCurrent.email}?subject=${'Shareplace'}&body=${'hello'}`;
    otherWindow.opener = null;
    otherWindow.location = url;
  }

  discussionRenameForm() {
    return (
      <div className="rename-topic" id="rename-topic">
        <InputText
          onChange={this.changeMessage}
          value={this.state.title}
          autoFocus
        />
        <button
          className="btn btn-success flat"
          onClick={() => this.renameDiscussion()}
        >
          Ok
        </button>
      </div>
    );
  }

  handleRoleChange(e) {
    this.setState({ role: e.target.value });
  }

  handleFilterChange(e) {
    this.setState({ filter: e.target.value });
  }

  folderUsers() {
    let Users = [];
    if (this.props.folderUsers.length) {
      Users = this.props.folderUsers.map(user => (
        <span className="user active" key={user.id}>
          <div
            className="in-list-profil"
            role="menuitem"
            tabIndex={user.id}
            onClick={() => this.openUser(user, 'folderUser')}
          >
            {this.props.user && this.props.user.avatar && this.props.user.id === user.id
              ? <UserAvatar
                user={this.props.user}
                width="31"
                height="31"
                crop="fill"
                className="user-profil in-list"
              /> : <UserAvatar
                user={user}
                width="31"
                height="31"
                crop="fill"
                className="user-profil in-list"
              />
            }
          </div>
          {this.state.userCurrent
            && this.state.isOpenUser
            && this.state.userCurrent.id === user.id
            && !this.state.openInfo
            ? <div className="contact-detail custom-modal">
              <FontAwesome.FaClose onClick={this.oncloseUserInfo} />
              <div className="header">
                <span className="identity">
                  {this.props.user && this.props.user.avatar && this.props.user.id === user.id
                    ? <UserAvatar
                      user={this.props.user}
                      width="32"
                      height="32"
                      crop="fill"
                      radius="max"
                      className="user-profil large"
                    /> : <UserAvatar
                      user={user}
                      width="32"
                      height="32"
                      radius="max"
                      crop="fill"
                      className="user-profil large"
                    />
                  }


                  {this.state.userCurrent.lastname
                    ? this.state.userCurrent.lastname : this.state.userCurrent.email}
                </span>
              </div>
              <div className="contents">
                <span className="user-role">
                  <FontAwesome.FaCheckCircle className="status" />
                  <p className="role">{this.props.role}</p>
                  <button className="link" onClick={this.toogleOpenRole}>Change</button>
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

                  {user.timezone && timeTz(user.timezone) ?
                    <span className="item">
                      <FontAwesome.FaMapMarker className="pin-map-icon" />
                      <span>
                        {this.state.userCurrent.timezone}
                        {` ${timeTz(this.state.userCurrent.timezone).hour}`}
                        :{timeTz(this.state.userCurrent.timezone).min}
                      </span>
                    </span>
                    : null }
                  <span
                    className="item delete-contact"
                    onClick={this.deleteRole}
                    role="presentation"
                  >
                    <FontAwesome.FaTrash className="delete" />
                      Delete
                  </span>
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
            </div>
            : null }
        </span>
      ));
    }
    return (
      <div className="participants">
        {Users}
      </div>
    );
  }

  static icons(type, file) {
    let extension = null;
    switch (type) {
      case 'application':
        extension = file.extension;
        switch (extension) {
          case 'docx':
          case 'doc':
            return <img className="file-type-icon centered" src={docFile} alt="document file" />;
          case 'ppt':
            return <img className="file-type-icon centered" src={pptFile} alt="document file" />;
          case 'pdf':
            return <img className="file-type-icon centered" src={pdfFile} alt="document file" />;
          case 'xls':
            return <img className="file-type-icon centered" src={xlsFile} alt="document file" />;
          case 'txt':
            return <img className="file-type-icon centered" src={txtFile} alt="document file" />;
          case 'zip':
          case 'rar':
            return (
              <img
                className="file-type-icon centered"
                src={archiveFile}
                alt="document file"
              />
            );

          default:
            return (
              <img
                className="file-type-icon centered"
                src={defaultFile}
                alt="document file"
              />
            );
        }
      case 'audio':
        return <img className="file-type-icon centered" src={audioFile} alt="document file" />;
      case 'video':
        return <img className="file-type-icon centered" src={videoFile} alt="document file" />;
      case 'image':
        return <img className="resized-img" src={file.link} alt={file.title} />;
      default:
        return <img className="file-type-icon centered" src={defaultFile} alt="document file" />;
    }
  }

  discussionItem(discussion) {
    let user = null;
    if (discussion.messages && discussion.messages.records && discussion.messages.records.length) {
      user = discussion.messages.records[0].user;
    }
    let icon = <FontAwesome.FaComment />;

    const folderName = discussion.folder ? discussion.folder.name : null;
    const placeName = discussion.folder && discussion.folder.place ?
      discussion.folder.place.name : null;

    if (
      discussion.messages && discussion.messages.records
      && discussion.messages.records[0].file && discussion.messages.records[0].file.type
    ) {
      const file = discussion.messages.records[0].file;
      icon = <FontAwesome.FaFileO />;
      const type = file.type.split('/');
      if (type.length) {
        icon = PageDiscussions.icons(type[0], file);
      }
    }

    return (
      <div className="file">
        <div
          className={classNames(
            'miniature-icon',
            {
              'message-icon': discussion.messages && discussion.messages.records
                && discussion.messages.records[0].text,
            },
          )}
        >
          <span className="resized-img">{icon}</span>
          {discussion.approved ? <FontAwesome.FaCheckCircle className="status-approved" /> : null}
          {discussion.locked ? <FontAwesome.FaPencil className="status-locked" /> : null}
        </div>

        {discussion.version > 0 ?
          <div className="version">
            V.{discussion.version}
          </div>
          : null
        }

        <div className="topic-title">
          <span className="text-title">
            {discussion.title}
          </span>

          <div className={classNames(
            'path',
            {
              hide: this.currentFolder() && this.currentFolder().id !== allTopicsID,
            },
          )}
          >
            <span className="text-title">
              Path: {placeName ? `${placeName}/${folderName}` : ''}
            </span>
          </div>
        </div>
        <FontAwesome.FaPencil
          onClick={() => this.toggleRenameOpen(discussion)}
          className="action-icon"
        />
        <FontAwesome.FaTrash
          className="action-icon"
          onClick={() => this.openConfirmDelete(discussion)}
        />
        {user ?
          <span
            role="menu"
            tabIndex={user ? user.id : 0}
            onClick={() => this.openUser(user, 'discussion')}
            className="user-list in-list-profil"
          >
            {this.props.user && this.props.user.avatar && this.props.user.id === user.id
              ?
              (<UserAvatar
                user={this.props.user}
                width="32"
                height="32"
                crop="fill"
                radius="max"
                className="user-profil large in-list"
              />) :
              (<UserAvatar
                user={user}
                width="32"
                height="32"
                crop="fill"
                radius="max"
                className="user-profil large in-list"
              />)
            }
          </span>
          : null }
      </div>
    );
  }

  discussionList() {
    let discussionItem = null;
    discussionList = [];
    if (this.currentFolder() && this.currentFolder().discussions) {
      this.currentFolder().discussions.records.forEach((discussion) => {
        if (this.state.renameIsOpen && this.props.currentDiscussion === discussion.id) {
          discussionItem = this.discussionRenameForm(discussion.title);
        } else {
          discussionItem = this.discussionItem(discussion);
        }
        if (
          !(discussion.messages && discussion.messages.records
            && discussion.messages.records[0].file
            && discussion.messages.records[0].file.removed)
        ) {
          discussionList.push((
            <div
              key={discussion.id}
              onClick={() => {
                this.openDiscussion(discussion.id); this.openDiscussioonAction(discussion.id);
              }}
              role="menuitem"
              tabIndex={discussion.id}
              className={classNames(
                'discussion',
                {
                  current: discussion.id === this.props.currentDiscussion,
                },
              )}
            >
              { discussionItem }
            </div>
          ));
        }
      });
    }
    discussionList.push(
      <div key={0}>
        {this.props.isUploadNew ?
          <div className="file">
            <span className="loading">
              <img
                className="loading-spinner"
                src={loaderSpin}
                alt="Loader"
              />
            </span>
            <div className="version">
              V.1
            </div>
            <div className="file-name">
              Your file is being downloaded. Please wait...
            </div>
          </div>
          : ''}
      </div>,
    );
    return discussionList;
  }

  render() {
    const folderUsers = this.folderUsers();
    if (this.props.currentFolder === null) {
      return (
        <div className="flex-item">
          No folder selected
        </div>
      );
    }

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
    const { user } = this.props;
    return (
      <div className="flex-item">
        <div id="discussions-head">
          <span className="folder-name-detail">
            {this.currentFolder() ? this.currentFolder().name : ''}
          </span>
          {folderUsers}
          {this.props.currentFolder !== 0 ? <Invite folder={this.currentFolder()} /> : null}
        </div>
        {this.props.currentFolder !== 0 ? <StartDiscussion /> : null}
        <div id="topics-list">
          <NewFile
            onChange={this.changeFile}
            content={this.discussionList()}
          />
          {/** User Onboarding* */}
          <DiscussionOnBoarding user={user} updateOnboardingState={this.props.userNew} />
          <CommentOnBoarding user={user} updateOnboardingState={this.props.userNew} />
          <InviteOnBoarding user={user} updateOnboardingState={this.props.userNew} />
        </div>
        <Modal
          open={this.state.isOpen}
          closeOnEscape={!this.state.isOpen}
          onClose={this.closeConfirmDelete}
          little
          showCloseIcon={false}
          classNames={{ modal: 'custom-modal' }}
        >
          <div className="wrap">
            <FontAwesome.FaExclamationTriangle className="icon-signal" />
            <div className="header centered">
              <h3 className="title-l">Deleting</h3>
            </div>
            <div className="contents">
              <p className="centered">
                Do you want to delete the file versions in the subject :<br />
                <b>{this.state.title}</b> ?
              </p>
            </div>
            <div className="footer centered">
              <button
                onClick={this.closeConfirmDelete}
                className="btn btn-warning flat"
              >
                Cancel
              </button>
              <button
                onClick={this.discussionDelete}
                className="btn btn-primary flat"
              >
                Ok
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          open={this.state.roleIsOpen}
          closeOnEscape={this.modalIsClose}
          onClose={this.modalIsClose}
          little
          classNames={{ modal: 'custom-modal' }}
        >
          <div className="header">
            <h3 className="title-l">Change authorization</h3>
          </div>
          <p>Change <strong>
            {this.currentFolder() ? this.currentFolder().name : ''}</strong> authorization:</p>
          <div className="role-contents">
            <div className="role-item">
              <p className="description">
               User can <strong>approve</strong>,
               read, export,
               modify document and <strong> invite new people</strong>
              </p>
              <input
                type="radio"
                value="owner"
                onChange={this.handleRoleChange}
                checked={this.state.role === 'owner'}
                id="approve"
                name="User-role"
              />
              <label htmlFor="approve" />
              <span className="role-label">Approval</span>
            </div>

            <div className="role-item">
              <p className="description">
                User can read, export and <strong>modify</strong> document
              </p>
              <input
                type="radio"
                value="writer"
                onChange={this.handleRoleChange}
                checked={this.state.role === 'writer'}
                id="read-write"
                name="User-role"
              />
              <label htmlFor="read-write" />
              <span className="role-label">Read / Write</span>
            </div>

            <div className="role-item">
              <p className="description">User can read and export document</p>
              <input
                type="radio"
                value="reader"
                onChange={this.handleRoleChange}
                checked={this.state.role === 'reader'}
                id="read-only"
                name="User-role"
              />
              <label htmlFor="read-only" />
              <span className="role-label">Read only</span>
            </div>

            <div className="role-item">
              <p className="description">Remove the user from the folder</p>
              <input
                onChange={this.handleRoleChange}
                value="removed"
                checked={this.state.role === 'removed'}
                type="radio"
                id="delete"
                name="User-role"
              />
              <label htmlFor="delete" />
              <span className="role-label">Delete</span>
            </div>
          </div>
          <div className="footer centered">
            <button className="btn btn-primary" onClick={this.applyChangeRole}>Apply</button>
          </div>
        </Modal>
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
                      ?

                      (<UserAvatar
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
                    <button className="link" onClick={this.toogleOpenRole}>Change</button>
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
                    </span> : null }
                    <span className="item delete-contact">
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

export default reduxConnect(PageDiscussions);

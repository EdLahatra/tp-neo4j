import createHistory from 'history/createBrowserHistory';
import React from 'react';
import Modal from 'react-responsive-modal';
import CommonFolder, { reduxConnect } from 'common/component/page/places/folder';
import classNames from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';
import InputText from '../../input/text';

const history = createHistory();

class Folder extends CommonFolder {
  constructor(props) {
    super(props);

    this.openFolderAction = this.openFolderAction.bind(this);
    this.addFolderValidator = this.addFolderValidator.bind(this);
  }

  addFolderValidator() {
    if (this.state.addName.length) {
      this.addFolder();
    }
  }

  componentDidMount() {
    const currentLocation = history.location.pathname;
    const splitedUrl = currentLocation ? currentLocation.split('/') : '';
    if (splitedUrl[3] && splitedUrl[4] && splitedUrl[4] === this.props.folder.id) {
      this.openFolder();
      this.toggleOpen();
    }
    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 27) {
        this.setState({
          isOpen: false,
          renameIsOpen: false,
          addIsOpen: false,
        });
      }
      const key = e.which || e.keyCode;
      if (key === 13 && this.state.renameIsOpen && this.state.folderName.length) {
        this.folderRename();
      }
      if (key === 13 && this.state.addIsOpen && this.state.addName.length) {
        this.addFolder();
      }
    });
  }

  openFolderAction() {
    this.toggleOpen();
    this.openFolder();
    history.push({
      pathname: `/place/${this.props.currentPlace}/folder/${this.props.folder.id}`,
    });
  }

  folder(childFolders) {
    if (this.state.renameIsOpen && this.props.currentFolder === this.props.folder.id) {
      return (
        <div className="rename current folder-name">
          <InputText
            onChange={this.changeFolderName}
            value={this.state.folderName}
          />
          <input
            className="ok-input"
            type="submit"
            onClick={() => this.folderRename()}
            value="Ok"
          />
        </div>
      );
    }
    return (
      <span
        tabIndex={this.props.folder.id}
        className={
          classNames(
            'folder-name',
            { current: this.props.currentFolder === this.props.folder.id },
            { openedParent: this.state.isOpen },
          )
        }
      >
        <div
          className="chevron-folder"
          onClick={this.openFolderAction}
          role="presentation"
        >
          { childFolders ? <FontAwesome.FaAngleDown /> : null}
        </div>
        <p
          onClick={this.openFolderAction}
          role="none"
          className="text"
        >
          { this.props.folder.name }
        </p>
        <div className="action-area">
          <FontAwesome.FaPlus
            onClick={this.toggleAddOpen}
            className="action-icon subAdd"
          />
          <FontAwesome.FaPencil
            onClick={this.toggleRenameOpen}
            className="action-icon folderParam"
          />
          { this.props.folder.parent ? <FontAwesome.FaTrash
            onClick={() => this.openConfirmDelete(this.props.folder.name)}
            className="action-icon delete-folder"
          />
            : null }
        </div>
      </span>
    );
  }

  render() {
    let add = null;
    const childFolders = this.getChildFolders();
    const folder = this.folder(childFolders.length);
    let subFolders = [];
    for (let i = 0; i < childFolders.length; i += 1) {
      subFolders.push((
        <ConnectedFolder
          key={childFolders[i].id}
          folder={childFolders[i]}
          folders={this.props.folders}
          openFolder={this.props.openFolder}
          currentFolder={this.props.currentFolder}
        />
      ));
    }

    if (this.state.isOpen) {
      subFolders = <div className="subfolders">{subFolders}</div>;
    } else {
      subFolders = null;
    }

    if (this.state.addIsOpen) {
      add = (
        <div className="add-folder-field">
          <InputText
            onChange={this.changeAddName}
            value={this.state.addName}
            placeholder={'Folder\'s name'}
          />
          <button
            onClick={this.addFolderValidator}
            className="btn btn-success flat"
          >
            Ok
          </button>
        </div>
      );
    }
    return (
      <div className="folder-content">
        {folder}
        {add}
        {subFolders}
        <Modal
          open={this.state.deleteIsOpen}
          closeOnEscape={!this.state.deleteIsOpen}
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
                Are you sure you want to delete <b>{this.state.folderName}</b> ? <br />
                This is irreversible!
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
                onClick={this.folderRemove}
                className="btn btn-primary flat"
              >
                Ok
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const ConnectedFolder = reduxConnect(Folder);

export default ConnectedFolder;

import React from 'react';
import Modal from 'react-responsive-modal';
import * as FontAwesome from 'react-icons/lib/fa';
import CommonPopupDownload, { reduxConnect } from 'common/component/popup/download';
import loaderSpin from '../../images/loader.svg';
import InputTextarea from '../input/textarea';

class PopupInvite extends CommonPopupDownload {
  constructor(props) {
    super(props);

    this.escFunction = this.escFunction.bind(this);
  }

  escFunction(e) {
    const key = e.which || e.keyCode;
    if (key === 27) {
      this.closeDownload();
    }
    if (key === 13 && this.state.isCommentOpen && this.state.message) {
      this.addMessage();
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  render() {
    if (!this.isVisible()) {
      return null;
    }
    if (this.props.isloaded) {
      return (
        <Modal
          open={this.props.isloaded}
          onClose={() => false}
          little
          showCloseIcon={false}
          classNames={{ modal: 'custom-modal' }}
        >
          <span className="loading"><img
            className="loading-spinner"
            src={loaderSpin}
            alt="Loader"
          />   Please wait...</span>
        </Modal>
      );
    }
    const locked = this.locked() && this.locked().length && this.locked()[0].locked_by;

    return (
      <Modal
        open={this.isVisible()}
        onClose={() => false}
        little
        showCloseIcon={false}
        classNames={{ modal: 'custom-modal' }}
      >
        {this.state.isCommentOpen
          ? <div id="comment" className="wrap-file-edit">
            <h3>Add your comment</h3>
            <div className="input-area" id="add-comment">
              <InputTextarea
                value={this.state.message}
                onChange={this.changeMessage}
                placeholder={'Type your comment here'}
              />
              <button
                className="btn btn-default flat"
                onClick={this.closeDownload}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary flat"
                onClick={this.addMessage}
              >
                Comment
              </button>

            </div>
          </div>
          : <div id="download" className="wrap-file-edit">
            <FontAwesome.FaClose onClick={this.closeDownload} className="close-btn" />
            <div className="content">
              { this.props.download.file
              && this.props.download.file
                ? <div className="file-name"> {this.props.download.file.name}
                </div>
                : null }
              { this.props.download.file
              && this.props.download.file
                ? <div className="file-size">
                  {(this.props.download.file.size / 1048576).toFixed(2)} MB
                </div>
                : null }
              <p className="text">
              Do you want to lock and modify or just take a look at the document ?
              </p>
              <div className="file-edit-contents">
                { !locked
                  ? <div
                    className="action-icon"
                    role="none"
                    onClick={() => this.props.downloadFile(this.props.download, true)}
                  >
                    <FontAwesome.FaPencil className="icon" />
                    Lock & modify
                  </div>
                  : '' }
                <div
                  className="action-icon"
                  role="none"
                  onClick={() => this.props.downloadFile(this.props.download, false)}
                >
                  <FontAwesome.FaEye className="icon" />
                  Read only
                </div>
                <div
                  className="action-icon"
                  role="none"
                  onClick={this.openComment}
                >
                  <FontAwesome.FaComment className="icon" />
                  Comment
                </div>
              </div>
            </div>
          </div>
        }
      </Modal>
    );
  }
}

export default reduxConnect(PopupInvite);

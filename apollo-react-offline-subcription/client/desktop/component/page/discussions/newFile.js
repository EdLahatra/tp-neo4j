import React from 'react';
import * as FontAwesome from 'react-icons/lib/fa';
import CommonNewFile, { reduxConnect } from 'common/component/page/discussions/newFile';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

class NewFile extends CommonNewFile {
  constructor(props) {
    super(props);

    this.newFile = this.newFile.bind(this);
  }

  newFile(acceptedFiles) {
    if (acceptedFiles) {
      acceptedFiles.forEach(file => this.changeFile(file));
    }
  }

  render() {
    let dropzoneRef;
    return (
      <div id="mask-topic">
        <Dropzone
          onDrop={this.newFile}
          className={classNames(
            'file-dropzone with-topic',
            {
              hide: this.props.content && this.props.content.length === 0,
              fullHeight: this.props.content && this.props.content.length >= 5,
            },
          )}
          activeClassName="active"
          disableClick
        >
          <FontAwesome.FaFile className="file-icon" />
          {this.props.content}
        </Dropzone>

        <Dropzone
          onDrop={this.newFile}
          className={classNames(
            'file-dropzone empty',
            {
              hide: this.props.content && this.props.content.length >= 7,
            },
          )}
          activeClassName="active"
          disableClick
          ref={(node) => { dropzoneRef = node; }}
        >
          <FontAwesome.FaFile className="file-icon" />

          {!this.props.searchIsOpen ? <div className="upload-area">
            <FontAwesome.FaFile
              className="file-icon upload-btn"
              onClick={() => { dropzoneRef.open(); }}
              style={{ display: 'block', margin: '0 auto' }}
            />
            <p>Drag‘n drop or browse files</p>
          </div> : null}
        </Dropzone>
      </div>
    );
  }
}

NewFile.propTypes = {
  // eslint-disable-next-line
  content: PropTypes.any,
};

export default reduxConnect(NewFile);

import React from 'react';
import * as FontAwesome from 'react-icons/lib/fa';
import CommonAddFile, { reduxConnect } from 'common/component/page/chat/addFile';
import Dropzone from 'react-dropzone';

class AddMessage extends CommonAddFile {
  constructor(props) {
    super(props);

    this.addFile = this.addFile.bind(this);
  }

  addFile(acceptedFiles) {
    this.changeFile(acceptedFiles[0]);
    this.setState({ release: true });
  }

  render() {
    return (
      <div>
        {!this.props.locked ?
          <Dropzone onDrop={this.addFile} className="add-file">
            <FontAwesome.FaFile className="file-icon" />
          </Dropzone> :
          null
        }
      </div>
    );
  }
}

export default reduxConnect(AddMessage);

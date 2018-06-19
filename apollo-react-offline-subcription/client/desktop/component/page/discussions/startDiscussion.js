import React from 'react';
import * as FontAwesome from 'react-icons/lib/fa';
import CommonStartDiscussion, {
  reduxConnect,
} from 'common/component/page/discussions/startDiscussion';
import InputText from '../../input/text';
import NewFile from './newFile';

class StartDiscussion extends CommonStartDiscussion {
  componentDidMount() {
    document.addEventListener('keyup', (e) => {
      if (e.keyCode === 27 && this.props.currentFolder) {
        this.setState({
          isOpen: false,
          renameIsOpen: false,
          addIsOpen: false,
        });
      }
    });
    document.addEventListener('keypress', (e) => {
      const key = e.which || e.keyCode;
      if (key === 13 && this.props.currentFolder && this.state.message) {
        this.startDiscussion();
      }
    });
  }

  render() {
    if (!this.props.currentFolder) {
      return <div />;
    }

    return (
      <div className="add-discussion">
        <div className="topic">
          <div className="input-area" id="start-discussion">
            <InputText
              value={this.state.message}
              onChange={this.changeMessage}
              placeholder={'Start a topic'}
            />
            <span
              className="send-icon"
              onClick={this.startDiscussion}
              role="presentation"
            >
              <FontAwesome.FaPaperPlane />
            </span>
          </div>
          <span className="add-file">
            <NewFile onChange={this.changeFile} />
          </span>
        </div>
      </div>
    );
  }
}

export default reduxConnect(StartDiscussion);

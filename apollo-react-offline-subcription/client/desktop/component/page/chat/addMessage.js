import React from 'react';
import * as FontAwesome from 'react-icons/lib/fa';
import CommonAddMessage, { reduxConnect } from 'common/component/page/chat/addMessage';
import classNames from 'classnames';
import InputText from '../../input/text';
import AddFile from './addFile';

const userID = localStorage.getItem('@userId');

class AddMessage extends CommonAddMessage {
  constructor(props) {
    super(props);

    this.escFunction = this.escFunction.bind(this);
  }

  escFunction(e) {
    const key = e.which || e.keyCode;
    if (key === 13 && this.state.message) {
      this.addMessage();
      localStorage.removeItem('comment');
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  render() {
    const isShowed = this.locked() && this.locked().length && userID && this.locked()[0].locked_by
      && userID.toString() === this.locked()[0].locked_by.toString();
    const locked = this.locked() && this.locked().length && userID && this.locked()[0].locked_by;
    return (
      <div className={classNames(
        'topic releaseClosed',
        {
          releaseOpen: isShowed,
        },
      )
      }
      >
        <AddFile onChange={this.changeFile} locked={locked} />
        <div className="input-area" id="start-discussion">
          <InputText
            value={this.state.message}
            onChange={this.changeMessage}
            placeholder={'Add a comment'}
          />
          <span
            className="send-icon"
            onClick={() => {
              this.addMessage();
              localStorage.removeItem('comment');
            }}
            role="presentation"
          >
            <FontAwesome.FaPaperPlane />
          </span>
        </div>
      </div>
    );
  }
}

export default reduxConnect(AddMessage);

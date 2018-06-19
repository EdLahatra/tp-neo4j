import React, { Component } from 'react';
import PropTypes from 'prop-types';

const sendButton = send => (
  <button
    backgroundColor={'blue'}
    borderRadius={16}
    color={'white'}
    name="send"
    onPress={send}
    size={16}
  />
);

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.send = this.send.bind(this);
  }

  send() {
    this.props.send(this.state.text);
    this.textInput.clear();
    this.textInput.blur();
  }

  render() {
    return (
      <div>
        <div>
          <input
            ref={(ref) => { this.textInput = ref; }}
            onChange={e => this.setState({ text: e.target.value })}
            placeholder="Type your message here!"
          />
        </div>
        <div>
          {sendButton(this.send)}
        </div>
      </div>
    );
  }
}

MessageInput.propTypes = {
  send: PropTypes.func.isRequired,
};

export default MessageInput;

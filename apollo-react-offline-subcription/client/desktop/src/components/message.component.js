import moment from 'moment';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Message extends PureComponent {
  render() {
    const { color, message, isCurrentUser } = this.props;
    console.log(color);
    return (
      <div key={message.id}>
        {isCurrentUser ? <div /> : undefined }
        <div>
          <p>{message.from.username}</p>
          <p>{message.text}</p>
          <p>{moment(message.createdAt).format('h:mm A')}</p>
        </div>
        {!isCurrentUser ? <div /> : undefined }
      </div>
    );
  }
}

Message.propTypes = {
  color: PropTypes.string.isRequired,
  message: PropTypes.shape({
    createdAt: PropTypes.string.isRequired,
    from: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }),
    text: PropTypes.string.isRequired,
  }).isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
};

export default Message;

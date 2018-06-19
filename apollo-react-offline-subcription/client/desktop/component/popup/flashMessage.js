import React from 'react';
import AlertContainer from 'react-alert';
import CommonflashMessage, { reduxConnect } from 'common/component/popup/flashMessage';

const alertOptions = {
  offset: 80,
  position: 'top right',
  theme: 'light',
  time: 5000,
  transition: 'scale',
};

class FlashMessage extends CommonflashMessage {
  componentDidUpdate() {
    if (this.props.isSuccess && this.props.message) {
      this.showSuccessMessage(this.props.message);
      this.props.hideFlashMessage();
    }
    if (this.props.isError && this.props.message) {
      this.showErrorMessage(this.props.message);
      this.props.hideFlashMessage();
    }
    return true;
  }

  showSuccessMessage(message) {
    this.msg.show(message, {
      type: 'success',
    });
  }

  showErrorMessage(message) {
    this.msg.show(message, {
      type: 'error',
    });
  }

  render() {
    return (
      <div>
        <AlertContainer ref={(a) => { this.msg = a; }} {...alertOptions} />
      </div>
    );
  }
}

export default reduxConnect(FlashMessage);

import React from 'react';
import CommonInvite, {
  reduxConnect,
} from 'common/component/page/discussions/invite';

class Invite extends CommonInvite {
  render() {
    return (
      <span
        className="start-invite"
        onClick={this.startInvite}
        role="presentation"
      >
      +
      </span>
    );
  }
}

export default reduxConnect(Invite);

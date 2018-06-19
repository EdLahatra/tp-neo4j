import React from 'react';
import PropTypes from 'prop-types';

const InviteOnBoarding = ({ user, updateOnboardingState }) => {
  if (user.onBordingInvite === 0 && user.onBordingDiscussion === 1 && user.onBordingComment === 0) {
    return (<div className="board-tips floating invite-some-people">
      <h4 className="tip-title">
        <span className="tips-number">2</span> Invite some people
      </h4>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
    do eiusmod tempor.</p>
      <div className="tip-footer">
        <button
          className="btn btn-primary flat"
          onClick={() => {
            updateOnboardingState({ onBordingInvite: 1 });
          }}
        >
          <strong>Skip</strong>
        </button>
      </div>
    </div>);
  }
  return null;
};

InviteOnBoarding.propTypes = {
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updateOnboardingState: PropTypes.func.isRequired,
};


export default InviteOnBoarding;

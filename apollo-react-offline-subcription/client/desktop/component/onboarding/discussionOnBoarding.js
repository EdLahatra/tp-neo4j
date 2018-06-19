import React from 'react';
import PropTypes from 'prop-types';

const DiscussionOnBoarding = ({ user, updateOnboardingState }) => {
  if (user.onBordingDiscussion === 0) {
    return (<div className="board-tips floating add-files-tips">
      <h4 className="tip-title">
        <span className="tips-number">1</span> Drag and drop or browse files
      </h4>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
        do eiusmod tempor.</p>
      <div className="tip-footer">
        <button
          className="btn btn-primary flat"
          onClick={() => {
            updateOnboardingState({ onBordingDiscussion: 1 });
          }}
        >
          <strong>Skip</strong>
        </button>
      </div>
    </div>);
  }
  return null;
};

DiscussionOnBoarding.propTypes = {
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updateOnboardingState: PropTypes.func.isRequired,
};
export default DiscussionOnBoarding;

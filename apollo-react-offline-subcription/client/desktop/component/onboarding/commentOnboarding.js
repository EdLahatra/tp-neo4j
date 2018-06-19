import React from 'react';
import PropTypes from 'prop-types';

const CommentOnBoarding = ({ user, updateOnboardingState }) => {
  if (user.onBordingComment === 0 && user.onBordingDiscussion === 1 && user.onBordingInvite === 1) {
    return (<div className="board-tips floating add-comment-tip">
      <h4 className="tip-title">
        <span className="tips-number">3</span> Add comments to a file / topic
      </h4>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
    do eiusmod tempor.</p>
      <div className="tip-footer">
        <button
          className="btn btn-primary flat"
          onClick={() => {
            updateOnboardingState({ onBordingComment: 1 });
          }}
        >
          <strong>Skip</strong>
        </button>
      </div>
    </div>);
  }
  return null;
};

CommentOnBoarding.propTypes = {
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updateOnboardingState: PropTypes.func.isRequired,
};
export default CommentOnBoarding;

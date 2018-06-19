

import React from 'react';
import { Image, CloudinaryContext, Transformation } from 'cloudinary-react';
import PropTypes from 'prop-types';
import config from 'common/config';
import profilImg from '../../images/img_profile.png';


const UserAvatar = (props) => {
  if (!props.user.avatar) {
    return (
      <img
        src={profilImg}
        className={props.className}
        alt="Profil"
      />);
  }
  return (<CloudinaryContext cloudName={config.cloudinaryName}>
    <Image publicId={props.user.avatar.public_id}>
      <Transformation {...props} />
    </Image>
  </CloudinaryContext>);
};

UserAvatar.propTypes = {
  className: PropTypes.string.isRequired,
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};
UserAvatar.defaultProps = {
  user: {},
};

export default UserAvatar;

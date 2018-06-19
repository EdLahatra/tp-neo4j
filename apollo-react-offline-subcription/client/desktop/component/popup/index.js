import React from 'react';
import Invite from './invite';
import Download from './download';
import FlashMessage from './flashMessage';

const Popup = () => (
  <div>
    <FlashMessage />
    <Invite />
    <Download />
  </div>
);

export default Popup;

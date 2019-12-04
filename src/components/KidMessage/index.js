
import React from 'react';
import ZmModal from 'components/zmModal/index';

import './index.scss';

export default function KidMessage(props) {
  const { messagetype, messagecontent, maskClick } = props;
  return (
    <ZmModal visible={!!messagetype} maskClick={() => maskClick()}>
      <div className={`kid-message`}>
        <p>{ messagecontent }</p>
      </div>
    </ZmModal>
  );
}

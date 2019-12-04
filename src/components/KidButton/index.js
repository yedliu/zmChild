import React, { memo } from 'react';
import { clickVoice } from 'utils/helpfunc';

import './index.scss';

function KidButton(props) {
  const { type = '', value = '', style = {}, disabled = '', size = '', handleClick } = props;
  return (
    <button
      className={`button ${type} ${value} ${disabled ? 'disabled' : ''} ${size}`}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        if (disabled === '') {
          clickVoice();
        }
        handleClick && handleClick();
      }}
    >
      {props.children}
    </button>
  );
}

export default memo(KidButton);

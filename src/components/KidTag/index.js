import React from 'react';
import './index.scss';

export const KidTag = (props) => {
  const style = Object.assign({}, props.style);
  return <span style={style} className={`course-state state-${props.type}`}>{props.text}</span>;
};

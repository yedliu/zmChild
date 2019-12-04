import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import './style.scss';

let onClose = null;

// *******示例******
// import zmTip from 'components/zmTip'
//
// const tip = {
//   title: '课程已结束啦！',
//   time: 3000,
//   className: 'warning' 类名根据需要自己传入，具体参考KidPpt组件中的使用
// }
// zmTip(tip)

function Tip(props) {
  const { title, className, close, onClose } = props;
  return (
    <div id="zm-tip" onClick={e => e.stopPropagation()}>
      <div className={`content ${className}`}>
        {title}
        {close === 'close' ? <div onClick={() => onClose()}>关闭</div> : null}
      </div>
    </div>
  );
}
function ZmTip(tipInfo) {
  const { title, time = 2000, className = '', close } = tipInfo;
  const tip = document.createElement('div');
  const body = document.querySelector('body');
  body.appendChild(tip);
  onClose = () => {
    if (!tip) return;
    tip.remove();
  };

  ReactDOM.render(<Tip title={title} className={className} close={close} onClose={onClose} />, tip);
  if (close !== 'close') {
    return new Promise(((resolve) => {
      const timer = setTimeout(() => {
        tip.remove();
        window.clearTimeout(timer);
        resolve();
      }, time);
    }));
  }
}

ZmTip.propTypes = {
  tipInfo: PropTypes.object,
};

export default ZmTip;

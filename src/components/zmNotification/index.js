import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import './index.scss';

let okHandler = null;
let cancelHandler = null;

// *******示例******
// import zmNotification from 'components/zmNotification'
//
// const conf = {
//   title: '这是标题',
//   message: '你要退出吗你要退出吗你要退出吗你要退出吗？',
//   className: 'default',
//   onCancel: () => {console.log('no')}
// }
// zmNotification(conf)

function Notification(props) {
  const { title, message, className, okText, onOk, cancelText, onCancel } = props;
  return (
    <div onClick={e => e.stopPropagation()}>
      <span className="close" onClick={() => onCancel()} />
      <div className={`content ${className}`}>
        {
          title
            ? <div className="title">{title}</div> : ''
        }
        {
          message
            ? <div className="message">{message}</div> : ''
        }
      </div>
    </div>
  );
}
export function clearNotification() {
  const prevNoti = document.querySelector('#zmNotification');
  prevNoti && prevNoti.remove();
}
// isSingle控制显示弹框时如果已有相同的弹框就先关闭已有的弹框
function ZmNotification(notiInfo, isSingle = false) {
  const { title = '', message = '', className = '', okText = '', onOk, cancelText = '', onCancel } = notiInfo;
  if (isSingle) {
    clearNotification();
  }
  const noti = document.createElement('div');
  noti.id = 'zmNotification';
  const body = document.querySelector('body');
  body.appendChild(noti);
  setTimeout(() => {
    noti.classList.add('default-position');
  }, 500);
  const onClose = () => {
    if (!noti) return;
    noti.remove();
  };
  okHandler = () => {
    onOk();
    onClose();
  };
  cancelHandler = () => {
    onCancel();
    onClose();
  };

  ReactDOM.render(<Notification title={title} message={message} className={className} okText={okText} cancelText={cancelText} onOk={okHandler} onCancel={cancelHandler} />, noti);
}

Notification.propTypes = {
  notiInfo: PropTypes.object,
};

export default ZmNotification;

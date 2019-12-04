import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import './style.scss';

let okHandler = null;
let cancelHandler = null;

// *******示例******
// import zmAlert from 'components/zmAlert'
//
// const alert = {
//   title: '这是标题',
//   message: '你要退出吗你要退出吗你要退出吗你要退出吗？',
//   className: 'default', // 类名自己传入，现在有默认，掌小萌（partner1），美美兔（partner2），呆呆熊（partner3） 4种。
//   用partner拼上localStorage.getItem('partner')传入，后续如有其他的再添加
//   okText: 'ok',
//   cancelText: 'no',
//   onOk: () => {console.log('ok')},
//   onCancel: () => {console.log('no')}
// }
// zmAlert(alert)

function Alert(props) {
  const { title, message, className, okText, onOk, cancelText, onCancel } = props;
  return (
    <div id="zm-alert" onClick={e => e.stopPropagation()}>
      <div className={`content default ${className}`}>
        {
          title
            ? <div className="title">{title}</div> : ''
        }
        {
          message
            ? <div className="message">{message}</div> : ''
        }
        <div className={cancelText ? 'btn-box-1' : 'btn-box-2'}>
          {
            cancelText
              ? <div onClick={() => onCancel()} className="btn cancel">{cancelText}</div> : null
          }
          {
            okText
              ? <div onClick={() => onOk()} className="btn ok">{okText}</div> : null
          }
        </div>
      </div>
    </div>
  );
}
function ZmAlert(alertInfo) {
  const { title = '', message = '', className = '', okText = '', onOk, cancelText = '', onCancel } = alertInfo;
  const alert = document.createElement('div');
  const body = document.querySelector('body');
  body.appendChild(alert);
  const onClose = () => {
    if (!alert) return;
    alert.remove();
  };
  okHandler = () => {
    onOk();
    onClose();
  };
  cancelHandler = () => {
    onCancel();
    onClose();
  };

  ReactDOM.render(<Alert title={title} message={message} className={className} okText={okText} cancelText={cancelText} onOk={okHandler} onCancel={cancelHandler} />, alert);
}

ZmAlert.propTypes = {
  alertInfo: PropTypes.object,
};

export default ZmAlert;

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import './style.scss';

let okHandler = null;
let cancelHandler = null;

// ******示例******
// import updateAlert from 'components/updateAlert'
//
// const alert2 = {
//   isForce: false, // 是否强制更新
//   contentList: [
//     '界面改版，整体风格优化；要专业陪练，也要颜值担当',
//     '设备检测流程优化，设备问题一目了然',
//     '细节优化，体验更流畅'
//   ],
//   onOk: () => {console.log('ok')},
//   onCancel: () => {console.log('no')}
// }
// updateAlert(alert2)

function Alert(props) {
  const { isForce, onOk, contentList, onCancel } = props;
  return (
    <div id="update-alert" onClick={e => e.stopPropagation()}>
      <div className="content ">
        <div className="header-bg" />
        <div className="main">
          {
            contentList.map((item, index) => {
              return (
                <div key={index} className="list-item">{item}</div>
              );
            })
          }
          <div className={isForce ? 'btn-box-2' : 'btn-box-1'}>
            {
              !isForce
                ? <div onClick={() => onCancel()} className="btn cancel">稍后再说</div> : ''
            }
            <div onClick={() => onOk()} className="btn ok">立即升级</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpdateAlert(alertInfo) {
  const { isForce, onOk, onCancel, contentList } = alertInfo;
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

  ReactDOM.render(<Alert isForce={isForce} contentList={contentList} onOk={okHandler} onCancel={cancelHandler} />, alert);
}

UpdateAlert.propTypes = {
  alertInfo: PropTypes.object,
};

export default UpdateAlert;

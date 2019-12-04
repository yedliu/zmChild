import React from 'react';
import KidHeader from 'components/kidHeader';
import { clickVoice } from 'utils/helpfunc';
import './network-error.scss';

import networkImg from './image/fg_network_err@2x.png';

function NetworkError({ history }) {
  const handleClick = () => {
    clickVoice(() => {
      history && history.goBack();
    });
  };
  return (
    <div id="network-error">
      <KidHeader history={history} center="首页" />
      <div className="tip">
        <img src={networkImg} alt="" />
        <p>网络错误，请检查网络连接后重试</p>
        <button onClick={handleClick}>刷新重试</button>
      </div>
    </div>
  );
}
export default NetworkError;

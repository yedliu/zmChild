import React, { useState, useEffect, useRef, useMemo } from 'react';
import DownLoadHOC from 'components/KidDownLoad';
import ZmModal from 'components/zmModal';
import Config from 'utils/config';
import { isWeb } from 'zmNativeBridge';
import { setShareDataByName } from 'utils/nativebridge';
// import SVGA from 'svgaplayerweb';
import loadingsvga from '../../statics/common/mp3/loading.svga';

import './down.scss';

const errorTip = {
  '-1': '下载失败, 稍后重试',
  '-2': '下载失败, 稍后重试',
  '-3': '网络异常，下载失败',
  '-5': '网络异常，下载失败',
  '-6': '磁盘已满，下载失败',
}

const errorCode = [-1, -2, -3, -5];


function DownLoading(props) {
  let svgaLoading = useRef(null);
  const [svga, setSvga] = useState(loadingsvga);
  const [downError, setDownError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(null);
  const [message, setMessage] = useState(null);
  let player = null;
  let parser = null;

  useEffect(() => {
    import('svgaplayerweb').then((SVGA) => {
      player = new SVGA.Player(svgaLoading.current);
      parser = new SVGA.Parser(svgaLoading.current);
      parser.load(svga, (videoItem) => {
        player.setVideoItem(videoItem);
        player.startAnimation();
      });
    });

    if (isWeb()) {
      localStorage.setItem('CURRENT_LESSON_DATA', JSON.stringify(Object.assign({}, props.shareData, { kidVersion: 2 })));
      window.location.href = `${Config.apiurl}/kids/stuclass/makeup/${props.shareData.lessonUid}`;
    }
    // 下载成功或已经下载过
    if (props.loadInfo.code === 0) {
      window.onbeforeunload = null;
      localStorage.setItem('CURRENT_LESSON_DATA', JSON.stringify(Object.assign({}, props.shareData, { kidVersion: 2 })));
      setShareDataByName('CURRENT_LESSON_DATA', Object.assign({}, props.shareData, { kidVersion: 2 }));
      setShareDataByName('zm-chat-redux-userInfo', JSON.parse(localStorage.getItem('zm-chat-redux-userInfo')));
      setShareDataByName('zm-chat-redux-tocken', JSON.parse(localStorage.getItem('zm-chat-redux-tocken')));
      window.location.href = `${Config.apiurl}/kids/stuclass/makeup/${props.shareData.lessonUid}`;
    }
    // 磁盘已满，下载失败
    if (props.loadInfo.code === '-6') {
      setShowModal(true);
      setTitle('存储空间不足');
      setMessage('抱歉，你的储存空间还是不足 请检查课件储');
    }

    // 其他情况
    if(errorCode.includes(props.loadInfo.code)) {
      setSvga(null);
      setDownError(true);
    }
  }, [props.loadInfo.code, downError, svga]);

  const handleStopScroll = (e) => {
    e.stopPropagation();
  }

  const renderErrorTip = (message, title) => {
    return (
      <ZmModal visible={showModal}>
        <div id="errorTip" onWheel={e => handleStopScroll(e)}>
          <div className="ellipse" />
          <div className="close" onClick={() => setShowModal(false)} />
          <div className="title">{title}</div>
          <div className="content">
            {message}
          </div>
        </div>
      </ZmModal>
    );
  }

  // console.log('props12', props);

  const renderLoading = useMemo(() => {
    return (
      <div id="down-progress">
        <div ref={svgaLoading} className="svgaloading" />
        <div className="progress-info">
          <span className="now-text">正在进入教室</span>
          <span className="point">......</span>
        </div>
        <div className="range-box">
          <div className="range">
            <div className="progress" style={{ width: `${props.rate}%` }} />
          </div>
          <span className="rate">{`${props.rate || 0}%`}</span>
        </div>
    </div>
    )
  }, [props.rate, props.loadInfo.code, downError]);

  const handleRetry = () => {
    setDownError(false);
    props.begigDownLoad();
  }

  const renderDownErr = useMemo(() => {
    return (
      <div id="down-error">
        <div className="err-pic">s</div>
        <div className="err-text">抱歉，课件下载失败</div>
        <div className="again" onClick={handleRetry}>重试</div>
      </div>
    );
  }, [props.loadInfo.code, downError]);

  return useMemo(() => (
    <div id="down-page">
     {downError ? renderDownErr : renderLoading}
     {renderErrorTip(message, title)}
    </div>
  ), [props.loadInfo.code, downError,  props.rate])
}

export default DownLoadHOC(DownLoading);

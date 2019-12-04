import React, { useState, useEffect, useRef, useMemo } from 'react';
import { routerRedux } from 'dva/router';
import DownLoadHOC from 'components/KidDownLoad';
import ZmModal from 'components/zmModal';
import { isWeb } from 'zmNativeBridge';
import loadingsvga from '../../statics/common/mp3/loading-park.svga';

import '../KidMindLesson/down.scss';

const errorTip = {
  '-1': '下载失败, 稍后重试',
  '-2': '下载失败, 稍后重试',
  '-3': '网络异常，下载失败',
  '-5': '网络异常，下载失败',
  '-6': '磁盘已满，下载失败',
}

const errorCode = [-1, -2, -3, -5];


function DownLoadPartner(props) {
  let svgaLoading = useRef(null);
  const [svga, setSvga] = useState(loadingsvga);
  const [downError, setDownError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(null);
  const [message, setMessage] = useState(null);
  let player = null;
  let parser = null;
  const {asComponent,onFinish, onRetry} = props;

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
      if(asComponent){
        //隐藏下载页面
        onFinish&&onFinish(4);
        return;
      }
      props.dispatch(routerRedux.push(
        {
          pathname: '/kid/kidFriends',
          state: {
            from: '/kid/kiddownpartner',
            data: {
              dataSource: props.dataSource,
              loadInfo: {},
              moduleType:props.folderName
            },
          },
        },
      ));
    }
    // 下载成功或已经下载过
    if (props.loadInfo.code === 0) {
      if(asComponent){
        onFinish&&onFinish(0);
        return;
      }
      props.dispatch(routerRedux.push(
        {
          pathname: '/kid/kidFriends',
          state: {
            from: '/kid/kiddownpartner',
            data: {
              dataSource: props.dataSource,
              loadInfo: props.loadInfo,
              moduleType:props.folderName
            },
          },
        },
      ));
    }
    // 磁盘已满，下载失败
    if (props.loadInfo.code === '-6') {
      onFinish&&onFinish(1);
      setShowModal(true);
      setTitle('存储空间不足');
      setMessage('抱歉，你的储存空间还是不足 请检查');
    }

    // 其他情况
    if(errorCode.includes(props.loadInfo.code)) {
      onFinish&&onFinish(3);
      setSvga(null);
      setDownError(true);
    }
  }, [props.loadInfo.code, downError]);

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

  console.log('props12', props);

  const renderLoading = useMemo(() => {
    return (
      <div id="down-progress">
        <div ref={svgaLoading} className="svgaloading" />
        <div className="progress-info">
          <span className="now-text">正在进入</span>
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
    // if(!navigator.onLine){
    //   setTimeout(()=>{
    //     this.setDownError(true);
    //   },200);
    //   return;
    // }
    if(onRetry){
      onRetry();
      return;
    }
    // props.begigDownLoad();
    props.dispatch(routerRedux.push(
      {
        pathname: '/kid/kidFriends',
        state: {
          from: '/kid/kiddownpartner',
          data: {
            dataSource: props.dataSource,
            loadInfo: {},
            moduleType:props.folderName
          },
        },
      },
    ));
  }

  const renderDownErr = useMemo(() => {
    return (
      <div id="down-error">
        <div className="err-pic">s</div>
        <div className="err-text">进入失败</div>
        <div className="again" onClick={handleRetry}>重新进入</div>
      </div>
    );
  }, [props.loadInfo.code, downError]);

  return useMemo(() => (
    <div id="down-page">
     {downError ? renderDownErr : renderLoading}
     {renderErrorTip(message, title)}
    </div>
  ), [props.loadInfo.code, downError, props.rate])
}

export default DownLoadHOC(DownLoadPartner);
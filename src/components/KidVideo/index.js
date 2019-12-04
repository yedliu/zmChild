/**
*
* KidVideo
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Config } from 'utils/config';
import { AppLocalStorage } from 'utils/localStorage';
import request, { options } from 'utils/request';

import loadingimg from './images/loading_html.gif';
import videocover from './images/his_icon.png';
import nothingimg from './images/nothing.png';
import './style.scss';


class KidVideo extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = { h5Video: false };
    // this.checkH5Video = this.checkH5Video.bind(this);
  }

  componentWillMount() {
    console.log('video did mounted');
    // this.checkH5Video(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // this.checkH5Video(nextProps);
  }

  checkH5Video = (props) => {
    const { curVideo } = props;
    const item = curVideo;
    const uid = curVideo.uid;
    // const me = this;
    // setTimeout(() => {
    const h5DataUrl = `${Config.resourceurl}/${item.lessonUid}/events5.json?t=${+new Date()}`;
    request(h5DataUrl, options('GET', 'form', false, false)).then((res) => {
      this.setState({
        h5Video: true,
      });
      setTimeout(() => {
        this.h5replyrecordref.setUid(item.lessonUid);
        this.h5replyrecordref.setState({ isopen: true });
      }, 50);
    }).catch((e) => {
      this.setState({
        h5Video: false,
      });
      // console.log('checkh5video err :', e);
    });

  // this.resize();
    // }, 50);
  }

  render() {
    const { curVideo } = this.props;
    const makeVideoContent = (item) => {
      if (item.clientState && item.clientState !== 3) {
        return (
          <div className="flexcolum NoRecordSelect">
            <img className="PptImgSmall" alt="" src={nothingimg} />
            你好，你的录像还未生成哦~
          </div>
        );
      } if (item.state && item.state !== 4) {
        return (
          <div className="flexcolum NoRecordSelect">
            <img className="PptImgSmall" alt="" src={nothingimg} />
            你好，你的录像还未生成哦~
          </div>
        );
      } if (item.videotype === 0) {
        return (<div className="RecordsNoDiv" style={{ alignItems: 'center', justifyContent: 'center' }}><img width="166" alt="正在搜索。。。" src={loadingimg} /></div>);
      } if (item.videotype === 1) {
        if (!this.state.h5Video) {
          return (
            <div className="warpContent">
              <iframe
                key={item.uid || item.lessonUid}
                // style={{ height: '100%' }}
                onLoad={() => {
                  const func = (e) => {
                    if (e.data === 'sendbegin') {
                      window.frames[0].postMessage({ type: 'record', data: item }, Config.frameurl);
                      window.removeEventListener('message', func);
                    }
                  };
                  window.addEventListener('message', func);
                }}
                src={`${Config.recordPlayerUrl}/?mobile=${AppLocalStorage.getMobile()}&lessonUid=${curVideo.uid}&role=${AppLocalStorage.getRole()}&oauthToken=${AppLocalStorage.getOauthToken()}&courseType=${curVideo.courseMode === 1 ? 3 : 1}`} // courseType 3: 小班课  1：一对一
                width="100%"
                height="100%"
                frameBorder="no"
                marginWidth="0"
                marginHeight="0"
                scrolling="no"
                allowtransparency="yes"
                allowFullScreen={true}
              />
            </div>
          );
        }
      } else if (item.videotype === 2) {
        return (
          <div style={{ flex: 1, height: '100%', background: 'rgba(255,255,255,.6)' }} className="FlexColumnDiv">
            <div className="FlexColumnDiv" ref={x => this.videoTecent = x} style={{ flex: 'auto' }}>
              <video
                className="VideoContent"
                onEnded={() => {
                  if (this.props.selectedvideoindex < (item.tencentfiles.length - 1)) {
                    this.props.setVideoIndex(this.props.selectedvideoindex + 1);
                    { /* this.props.dispatch(setVideoIndex(this.props.selectedvideoindex + 1)); */ }
                  }
                }}
                controls
                pheight={this.props.videoheight ? this.props.videoheight : (this.videoTecent ? this.videoTecent.offsetHeight : 0)}
                src={item.tencentfiles[this.props.selectedvideoindex]}
                autoPlay
              />
            </div>
            <div className="VideoToolBar">
              {item.tencentfiles.map((it, ix) => (
                <div className="VideoToolBarItem" key={ix}>
                  <video
                    className="VideoToolBarSmallVideo"
                    style={{ backgroundColor: this.props.selectedvideoindex === ix ? 'lightslategray' : '', border: this.props.selectedvideoindex === ix ? 'lightslategray' : '2px solid lightslategray' }}
                    selected={this.props.selectedvideoindex === ix}
                    src={it}
                    onClick={() => {
                      if (window.stop !== undefined) {
                        window.stop();
                      } else if (document.execCommand !== undefined) {
                        document.execCommand('Stop', false);
                      }
                      this.props.setVideoIndex(ix);
                      { /* this.props.dispatch(setVideoIndex(ix)); */ }
                    }}
                  />
                  <img
                    className="CoverImg"
                    src={videocover}
                    onClick={() => {
                      if (window.stop !== undefined) {
                        window.stop();
                      } else if (document.execCommand !== undefined) {
                        document.execCommand('Stop', false);
                      }
                      this.props.setVideoIndex(ix);
                      { /* this.props.dispatch(setVideoIndex(ix)); */ }
                    }}
                  />
                  <div
                    className="VideoCover"
                    onClick={() => {
                      if (window.stop !== undefined) {
                        window.stop();
                      } else if (document.execCommand !== undefined) {
                        document.execCommand('Stop', false);
                      }
                      this.props.setVideoIndex(ix);
                      { /* this.props.dispatch(setVideoIndex(ix)); */ }
                    }}
                  />
                  <div
                    className="VideoToolBarText"
                    style={{ textDecoration: this.props.selectedvideoindex === ix ? 'underline' : 'none' }}
                    onClick={() => {
                      if (window.stop !== undefined) {
                        window.stop();
                      } else if (document.execCommand !== undefined) {
                        document.execCommand('Stop', false);
                      }
                      this.props.setVideoIndex(ix);

                      { /* this.props.dispatch(setVideoIndex(ix)); */ }
                    }}
                  >
第
                    {ix + 1}
段
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
    };

    if (!this.state.h5Video) {
      return (
        <div className="Wrapper">
          {makeVideoContent(curVideo)}
        </div>
      );
    }
    return (
      <div className="H5Wrapper">
        {/* <H5replyrecord className="H5replyrecord" ref={(el) => this.h5replyrecordref = el} uid={curVideo.get('uid')} isnomodal></H5replyrecord> */}
      </div>
    );
  }
}

KidVideo.propTypes = {
  setVideoIndex: PropTypes.func,
  selectedvideoindex: PropTypes.number,
};
export default KidVideo;

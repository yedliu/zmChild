/**
*
* KidPPT
*
*/

import React from 'react';
import { Config } from 'utils/config';
import zmTip from 'components/zmTip';
import ZmlDocIframe from '../zmDocIframe';
import './style.scss';


// 课件类型 1000501: ppt课件， 1000502：zml课件，1000503：zmg课件, 1000504: zmg2.0课件
const courseTypeArr = [1000502, 1000503, 1000504];
const iszmg = [1000503, 1000504];
class KidPPT extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      zmldocHeight: 0,
      toastShow: false,
      currentText: '',
    };
    this.nextOne = this.nextOne.bind(this);
    this.preOne = this.preOne.bind(this);
  }

  timer = null;

  componentDidMount() {
    // 预习课件上课提示
    if (this.props.courseType === 'preview') {
      this.timer = setInterval(() => {
        const now = Math.round(new Date() / 1000);
        if (this.props.startTime - now <= 5 * 60) { // 开课前5分钟提醒
          this.setState({
            toastShow: true,
          });
          clearInterval(this.timer);
        }
      }, 1000);
    }
    this.zmldocIframe = null;
    this.zmldocIframeListener = this.zmldocIframeListener.bind(this); // iframe postMessage 事件监听
    this.zmldocIframeChange = this.zmldocIframeChange.bind(this); // iframe 改变了
    // this.zmldockeymap = {};
    this.zmlDocIframeCb = this.zmlDocIframeCb.bind(this);
    this.zmlDocIframeInit = this.zmlDocIframeInit.bind(this);
    // this.isZmlDoc = this.isZmlDoc.bind(this); // 是否是zml课件
    this.zmlDocIframeChangePage = this.zmlDocIframeChangePage.bind(this); // zml课件换页
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.id !== this.props.data.id) {
      if (nextProps.data.id && courseTypeArr.includes(nextProps.data.coursewareType)) {
        // this.zmldocIframeChange(nextProps.data);
      }
      this.setState({
        index: 0,
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.zmldocIframe = null;
  }

  nextOne() {
    const { data, page } = this.props;
    const list = data.coursewareType === 1000501 ? data.docContent.split(',') : [];
    // this.zmldocIframe.contentWindow.postMessage({ action: 'showPage', data: 1 }, '*');
    if (courseTypeArr.includes(data.coursewareType) || courseTypeArr.includes(data.type)) {
      if (page.currentPage + 1 === page.totalPage) {
        const tip = {
          title: '已是最后一页',
          time: 2000,
          // className: `partner${localStorage.getItem('partner')}`,
        };
        zmTip(tip);
        return;
      }

      this.zmldocIframe.contentWindow.postMessage({
        action: 'showPage',
        data: page.currentPage + 1,
      }, '*');
      this.props.changePage(page.currentPage + 1);
      return;
    }
    if (this.state.index + 1 == list.length) {
      const tip = {
        title: '已是最后一页',
        time: 2000,
        // className: `partner${localStorage.getItem('partner')}`,
      };
      zmTip(tip);
      return false;
    }
    this.setState({
      index: this.state.index + 1,
    });
  }

  preOne() {
    const { data, page } = this.props;
    if (courseTypeArr.includes(data.coursewareType) || courseTypeArr.includes(data.type)) {
      if (page.currentPage === 0) {
        const tip = {
          title: '无上一页',
          time: 2000,
          // className: `partner${localStorage.getItem('partner')}`,
        };
        zmTip(tip);
        return;
      }

      this.zmldocIframe.contentWindow.postMessage({
        action: 'showPage',
        data: page.currentPage - 1,
      }, '*');
      this.props.changePage(page.currentPage - 1);
      return;
    }
    if (this.state.index == 0) {
      const tip = {
        title: '无上一页',
        time: 2000,
        // className: `partner${localStorage.getItem('partner')}`,
      };
      zmTip(tip);
      return false;
    }
    this.setState({
      index: this.state.index - 1,
    });
  }

  // zml课件iframe事件接受函数
  zmldocIframeListener(e) {
    const { data } = e;
    const { action } = data;
    if (action === 'ready') {
      console.log('ready ready ready');
    } else {

    }
  }

  // zml iframe change
  zmldocIframeChange(data) {
    this.zmldocIframe.contentWindow.postMessage({ action: 'setPages', data: JSON.stringify({ url: data.content }) }, '*');
    this.props.changePage(0);
    this.zmldocIframe.contentWindow.postMessage({ action: 'showPage', data: 0 }, '*');
  }

  zmlDocIframeInit(dom) {
    if (dom) {
      this.zmldocIframe = dom;
    }
    const showPptItem = this.props.data;

    const { courseType, data } = this.props;
    if (courseType === 'preview') {
      this.props.changePage(this.props.data.currentPage);
    } else {
      this.props.changePage(0);
    }

    if (courseType == 'class') {
      if (data.coursewareType === 1000503) {
        dom.contentWindow.postMessage({ action: 'setPagesUrl', data: JSON.stringify({ url: showPptItem.docContent || showPptItem.ossUrl, type: 'zmg' }) }, '*');
      } else if (data.coursewareType === 1000504) {
        const ossurl = `${Config.zmg}?coursewareId=${showPptItem.editorGameUid}&versionCode=${showPptItem.versionCode}`;
        dom.contentWindow.postMessage({ action: 'setPagesUrl', data: JSON.stringify({ url: ossurl, type: 'zmg' }) }, '*');
      } else {
        dom.contentWindow.postMessage({ action: 'setPagesUrl', data: JSON.stringify({ url: showPptItem.docContent || showPptItem.ossUrl, type: 'zml' }) }, '*');
      }
    } else {
      if (data.type === 1000503 || data.type === 1000504) {
        const ossurl = data.content;
        dom.contentWindow.postMessage({ action: 'setPagesUrl', data: JSON.stringify({ url: ossurl, type: 'zmg' }) }, '*');
      } else {
        dom.contentWindow.postMessage({ action: 'setPagesUrl', data: JSON.stringify({ url: data.content, type: 'zml' }) }, '*');
      }
    }
  }

  zmlDocIframeChangePage(page) {
    this.zmldocIframe.contentWindow.postMessage({ action: 'showPage', data: page }, '*');
  }

  zmlDocIframeCb(data) {
    // 传送zmg2.0 预习课件的pageNum,totalPages
    if(data.action === 'gamepages') {
      this.props.initZmgPage(data.data);
    }

    if (data.action === 'dataReady') {
      this.zmldocIframe.contentWindow.postMessage({ action: 'showPage', data: this.props.page.maxPage || 0 }, '*');
    } else if (data.action === 'returnPageNumber') {
      this.props.initPage(data.data);
    }
  }

  render() {
    const { data, page, text, courseType } = this.props;
    const { index, currentText } = this.state;
    const list = data.coursewareType === 1000501 && data.docContent ? data.docContent.split(',') : [];
    const url = list && `${Config.ppturl}/${data.lesHash}/slide-${list[this.state.index]}.png`;
    const isZmg = iszmg.includes(data.coursewareType) || iszmg.includes(data.type) ? true : false;
    return (
      <div className="BodyWrapper">
        <div className="BoardWrapper">
          <div className="BoardRight">
            <div className="BoardContent">
              <div className="img" style={{ overflow: 'auto' }}>
                {courseTypeArr.includes(data.coursewareType || data.type)
                  ? (
                    <div className="PreViewZmlDocWrap" id={data.id} ref={(x) => { if (x) this.setState({ zmldocHeight: x.offsetWidth * 9 / 16 }); }}>
                      <div className="PreViewZmlDoc" h={this.state.zmldocHeight}>
                        <ZmlDocIframe key={data.id} data={data} isZmg={isZmg} zmlDocIframeCb={this.zmlDocIframeCb} zmlDocIframeInit={this.zmlDocIframeInit} preview={courseType} hidePreviewNav />
                      </div>
                    </div>
                  )
                  : <img className="kimg" src={url} alt="" />
              }

              </div>
              <div className="ControlButton">
                {
                  !isZmg ? (data.coursewareType === 1000501 || data.type === 1000501)
                    ? <a onClick={this.preOne} className={`ctr-btn ${index >= 1 ? 'red' : 'pre'}`} />
                    : <a onClick={this.preOne} className={`ctr-btn ${page.currentPage >= 1 ? 'red' : 'pre'}`} />
                    : <a className={`ctr-btn pre`} />
                }
                {
                  (data.coursewareType === 1000501 || data.type === 1000501)
                    ? (
                      <div
                        className="count"
                        ref={(x) => {
                          if (x && (index + 1) >= list.length) {
                            this.setState({ index: list.length - 1 });
                          }
                        }}
                      >
                        {index + 1}
                        /
                        {list.length}
                      </div>
                    ) : (
                      <div className="count">
                        {isZmg ? 1 : page.currentPage + 1}
                        /
                        {isZmg ? 1 : page.totalPage}
                      </div>
                    )
                }
                {
                  !isZmg ? (data.coursewareType === 1000501 || data.type === 1000501)
                    ? <a onClick={this.nextOne} className={`ctr-btn ${index == list.length - 1 ? 'gray' : 'next'}`} />
                    : <a onClick={this.nextOne} className={`ctr-btn ${page.currentPage + 1 == page.totalPage ? 'gray' : 'next'}`} />
                    : <a className={`ctr-btn gray`} />
                }
              </div>
            </div>
          </div>
        </div>
        {(this.props.courseState === 0 && this.props.courseType === 'preview' && text) && <div className="Toast">{text}</div>}
        {(this.props.courseState === 0 && this.state.toastShow) && <div className="Toast">马上快要上课了，快去课堂吧</div>}
        {currentText && <div className="Toast">{currentText}</div>}
      </div>
    );
  }
}

KidPPT.propTypes = {
  // data: PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default KidPPT;

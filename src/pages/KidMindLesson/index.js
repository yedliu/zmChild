import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import dayjs from 'dayjs';
import KidHeader from 'components/kidHeader';
import { KidNavTab } from 'components/KidNavTab';
import { clickVoice, throttle } from 'utils/helpfunc';
import ZmModal from 'components/zmModal';
import ZmAlert from 'components/zmAlert';
import zmTip from 'components/zmTip';
import { connect } from 'dva';
import Config from 'utils/config';
import btninfo from './images/btninfo.png';
import { WEEKARRAY } from '../kidCourseCalendar';

import './style.scss';

const listItem = [
  '待学习',
  '已学习',
];

class KidMindLesson extends Component {
  constructor(props) {
    super(props);
    this.flag = 0;
    this.tip = null;
    this.state = {
      navIndex: 0,
      subjectIndex: 0,
      showNotes: false,
      scrollDistance: 0, //滚动距离
      showRightBtn: true,
      showLeftBtn: false,
      pageNo: 1,
      pageSize: 8,
      subjectCode: '',
      type: true, // 学习类型 true: 待学习。 false: 已学习
    }
  }

  async componentDidMount() {
    const sign = window.location.search.includes('tab');
    const { dispatch } = this.props;
    // 从学习端退回后定位在已学习
    if (sign) {
      this.setState({navIndex: 1}, () => {
        this.setState({ type: false });
        this.requsetAlreadyData();
      });
    }
    // 获取待学习列表
    await dispatch({
      type: 'kidmindlessonModel/checkUnfinishedLessonList',
    });
    this.calculateSize();
    this.scroll = throttle(this.scroll, 500);
    window.addEventListener('mousewheel', this.scroll);
    window.addEventListener('resize', throttle(this.calculateSize, 10));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.calculateSize);
    window.removeEventListener('mousewheel', this.scroll);
    this.tip = null;
  }
  
  // 待学习，已学习选择
  handleSelect = async (item, navIndex) => {
    const { dispatch } = this.props;
    if (item === '已学习') {
      this.setState({ type: false, scrollDistance: 0, showLeftBtn: false });
      this.requsetAlreadyData();
    } else if(item === '待学习') {
      this.setState({ type: true, scrollDistance: 0, showLeftBtn: false });
      await dispatch({
        type: 'kidmindlessonModel/checkUnfinishedLessonList',
      });
      this.calculateSize();
    }
    this.setState({
      navIndex,
    });
  }

  // 请求已学习数据
  requsetAlreadyData = async (isScroll) => {
    const { dispatch, kidmindlessonModel } = this.props;
    const { alreadyLessonList } = kidmindlessonModel
    const { pageNo, pageSize, subjectCode } = this.state;
    await dispatch({
      type: 'kidmindlessonModel/checkFinishedLessonList',
      payload: {
        params: {
          pageNo,
          pageSize,
          subjectCode,
        },
        prevList: alreadyLessonList,
        isScroll,
      }
    });
    this.calculateSize();
  }

  // 返回按钮
  handleGoBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(
      {
        pathname: '/kid/kidhistory',
        state: {
          from: '/kid/kidmindlesson',
        },
      },
    ));
  }

  handleInfo = () => {
    this.setState({ showNotes: true });
  }

  renderRight = () => {
    return (
      <img src={btninfo} alt="" onClick={this.handleInfo} />
    );
  }

  // 科目列表选择请求数据
  handleSubject = (item, index) => {
    this.setState({ 
      subjectIndex: index,
      subjectCode: item.subjectCode,
      pageNo: 1,
      pageSize: 8,
      scrollDistance: 0,
      showLeftBtn: false,
    }, () => {
      this.requsetAlreadyData();
      this.calculateSize();
    });
  }

  // 科目列表
  renderSubjectList = () => {
    const { subjectIndex } = this.state;
    const { subjectInfo } = this.props.kidmindlessonModel;
    return (
      <div className="subject-box">
        <div className="subject-list">
          {
            subjectInfo.length > 1 && subjectInfo.map((item, index) => (
              <div className={`item-box ${subjectIndex === index ? 'active' : ''}`} key={index} onClick={() => this.handleSubject(item, index)}>{item.subjectName}</div>
            ))
          }
        </div>
      </div>
    );
  }

  // 扣除学习次数接口
  handleEnterNum = async (item, enterType) => {
    const { dispatch } = this.props;
    const { lessonId, lessonUid, lmId, recordId } = item;
    await dispatch({
      type: 'kidmindlessonModel/getEnterNum',
      payload: { 
        lessonId,
        lessonUid,
        lmId,
        enterType,
        recordId, // 获取课件入参
       },
    });

    const { isEnter } = this.props.kidmindlessonModel;
    if (isEnter) {
      // 拿到下载课件的数据
      await dispatch({
        type: 'kidmindlessonModel/getCourseWare',
        payload : {
            recordId,
        }
      });
      const { courseWare } = this.props.kidmindlessonModel;
      if (Object.keys(courseWare).length > 0) {
        // 获取具体的下载地址
        await dispatch({
          type: 'kidmindlessonModel/parseCourse',
          payload: {
              requestUrl: courseWare.manifest,
          }
        });
      } else {
        this.tip = {
          title: '服务异常，请稍后再试',
          time: 2000,
          };
        zmTip(this.tip);
        return;
      }

      const { parseCourseList, recordLessonUid } = this.props.kidmindlessonModel;
      const { type } = this.state;
      // 扣学习次数成功
       dispatch(routerRedux.push({
        pathname: '/kid/kiddownpage',
        state: {
          from: '/kid/kidmindlesson',
          data: {
            parseCourseList,
            shareData: Object.assign(
              {},
              item,
              {
                // recordLessonUid,
                eventType: type ? 1 : 0,
                teacher: { id: item.teacherId, name: item.teacherName},
                zmg: Object.assign({}, courseWare , {
                  ossUrl: courseWare.coursewareType === 1000504 ? `${Config.zmg}?coursewareId=${courseWare.editorGameUid}&versionCode=${courseWare.versionCode}` : courseWare.ossUrl,
                  id: parseCourseList.id, 
                  version: parseCourseList.version
                })
              }
            ),
          }
        }
      }));
    } else {
      // 扣学习次数失败
      this.tip = {
        message: '系统异常，请稍后再',
        className: 'zhangxiaomen-cry',
        okText: '我知道了',
        onOk: () => console.log('ok'),
        onCancel: () => { console.log('no'); },
      };
      ZmAlert(this.tip);
    }
  }

  handleBeginBuKe = async (item) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'kidmindlessonModel/beginMakeUpLesson',
      payload: { lessonId: item.lessonId },
    });
    const { enterTypeData } = this.props.kidmindlessonModel;
    switch (enterTypeData.enterType) {
      case 0: // 有AI互动课的课时
        this.tip = {
          message: `你当前有${enterTypeData.freeTimes}节AI互动课课时，继续学习将消耗1节AI互动课课时`,
          className: 'hashours',
          okText: '继续学习',
          cancelText: '取消',
          onOk: () => this.handleEnterNum(item, enterTypeData.enterType),
          onCancel: () => console.log('no'),
        };
        ZmAlert(this.tip);
        break;
      case 1: // 没有AI互动课课时，有上课课时
        this.tip = {
          message: `你的AI互动课课时已用完，继续学习将消耗${enterTypeData.costHours}节上课课时`,
          className: 'nofree',
          okText: '继续学习',
          cancelText: '取消',
          onOk: () => this.handleEnterNum(item, enterTypeData.enterType),
          onCancel: () => { console.log('no'); },
        };
        ZmAlert(this.tip);
        break;
      case 2: // 直接进入
        this.handleEnterNum(item, enterTypeData.enterType);
        break;
      case 3: // 无免费课时无上课课时
        this.tip = {
          // title: '这是标题',
          message: '抱歉，你当前剩余的课时不足，无法学习AI互动课请联系班主任',
          className: 'zhangxiaomen-cry',
          okText: '我知道了',
          // cancelText: '我知道了',
          onOk: () => { console.log('ok'); },
          // onCancel: () => {console.log('no')}
        };
        ZmAlert(this.tip);
      default:
        break;
    }
  }

   // 鼠标滚动翻页
  scroll = (event) => {
    const mask = document.querySelector('.mask');
    if (event.target == mask) return;
    if (event.wheelDelta < 0) {
      // 向下
      this.flag++;
      if (this.flag > 1) {
        this.handleScrollRight();
        this.flag = 0;
      }
    } else {
      this.flag++;
      if (this.flag > 1) {
        this.flag = 0;
        this.handleScrollLeft();
      }
    }
  }

  calculateSize = () => {
    const { scrollDistance } = this.state;
    const cardItems = this.inWrapper && this.inWrapper.querySelectorAll('.card-item-wraper');
    const scrollLeft = Math.abs(parseInt(scrollDistance));
    if (!cardItems || !cardItems.length) {
      return false;
    }
    const outWrapperWidth = this.outWrapper.offsetWidth;
    const inWrapperWidth = this.inWrapper.offsetWidth;
    if (outWrapperWidth + scrollLeft > inWrapperWidth) {
      this.setState({ showRightBtn: false });
    } else {
      this.setState({ showRightBtn: true });
    }
  }

  handleScrollLeft = () => {
    const { scrollDistance, showLeftBtn } = this.state;
    const cardsItems = this.inWrapper.querySelectorAll('.card-item-wraper');
    const scrllLeft = Math.abs(parseInt(scrollDistance));
    const cardsWidth = cardsItems[0].offsetWidth;
    showLeftBtn && clickVoice();
    if (!cardsItems || !cardsItems.length || scrllLeft === 0) {
      return false;
    }

    if (scrllLeft > 0) {
      const rightWidth = parseInt(scrllLeft - cardsWidth * 2);
      this.setState({ scrollDistance: -rightWidth });
      if (rightWidth > 0) {
        this.setState({ showRightBtn: true });
      } else {
        this.setState({ showLeftBtn: false });
      }
    }
  }

  handleScrollRight = () => {
    const { scrollDistance, showRightBtn, type } = this.state;
    const cardsItems = this.inWrapper.querySelectorAll('.card-item-wraper');
    const scrllRight = Math.abs(parseInt(scrollDistance));
    const cardsWidth = cardsItems[0].offsetWidth;
    showRightBtn && clickVoice();
    if (!cardsItems || !cardsItems.length) {
      return false;
    }
    const outWrapperWidth = this.outWrapper.offsetWidth;
    const inWrapperWidth = this.inWrapper.offsetWidth;
    if (outWrapperWidth + scrllRight < inWrapperWidth) {
      const scrllLeftWidth = parseInt(scrllRight + cardsWidth * 2);
      this.setState({ 
        scrollDistance: 0 - scrllLeftWidth,
        pageNo: this.state.pageNo + 1
      }, () => {
        // 已学习中点击右箭头才请求数据
        if(!type) {
          this.requsetAlreadyData('right');
        }
        this.setState({ showLeftBtn: true });
      });

      if (outWrapperWidth + scrllLeftWidth >= inWrapperWidth) {
        this.setState({ showRightBtn: false });
      }
    }
  }

  renderWaitBuke = () => {
    const { scrollDistance, showLeftBtn, showRightBtn } = this.state;
    const { makeupLessonList } = this.props.kidmindlessonModel;
    return (
      <div>
        {
          makeupLessonList.length > 0 ? <div className="out-scroll-wrapper" ref={ele => this.outWrapper = ele}>
            <div className="in-scroll-wrapper" ref={ele => this.inWrapper = ele} style={{ transform: `translateX(${scrollDistance}px)` }}>
              {
                makeupLessonList.map((item, index) => (
                  <div className="card-item-wraper" key={index}>
                    <div className={`card-item lesson-${item.subjectCode.toLowerCase()}`}>
                      <div className="card-wraper">
                        <div className={`card-title card-title-${item.subjectCode.toLowerCase()}`}>{item.subjectName}</div>
                        <div className="lesson-info">
                          <p className="time">{`周${WEEKARRAY[dayjs(item.startTime - 0).day()]} ${dayjs(item.startTime - 0).format('HH:mm')}-${dayjs(item.endTime - 0).format('HH:mm')} (${dayjs(item.endTime - 0).month() + 1}月${dayjs(item.endTime - 0).date()}日)`}</p>
                          <p className="reason">{item.lmStateText}</p>
                          <p className="knowledge" style={{ whiteSpace: 'normal', display: ' -webkit-box', textOverflow: 'ellipsis', lineHeight: '22px', overflow: 'hidden', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical' }}>
                            知识点：{item.lessonContentName}
                          </p>
                        </div>
                      </div>
                      <div className="buke-button" onClick={() => this.handleBeginBuKe(item)}>开始学习</div>
                    </div>
                  </div>
                ))
              }
            </div>
            {showLeftBtn && <span className="scroll-btn left-button" onClick={this.handleScrollLeft} />}
            {showRightBtn && <span className="scroll-btn right-button" onClick={this.handleScrollRight} />}
          </div> :
          this.renderNoWaitLesson()
        }
      </div>
    );
  }

  renderAlreadyBuKe = () => {
    const { scrollDistance, showLeftBtn, showRightBtn } = this.state;
    const { alreadyLessonList } = this.props.kidmindlessonModel;
    return (
      <div>
        {
          alreadyLessonList.length > 0 ? <div className="out-scroll-wrapper" ref={ele => this.outWrapper = ele}>
            <div className="in-scroll-wrapper" ref={ele => this.inWrapper = ele} style={{ transform: `translateX(${scrollDistance}px)` }}>
              {
                alreadyLessonList.map((item, index) => (
                  <div className="card-item-wraper" key={index}>
                    <div className={`card-item lesson-${item.subjectCode.toLowerCase()}`}>
                      <div className="card-wraper">
                        <div className={`card-title card-title-${item.subjectCode.toLowerCase()}`}>{item.subjectName}</div>
                        <div className="lesson-info">
                          <p className="time">{`周${WEEKARRAY[dayjs(item.startTime - 0).day()]} ${dayjs(item.startTime - 0).format('HH:mm')}-${dayjs(item.endTime - 0).format('HH:mm')} (${dayjs(item.endTime - 0).month() + 1}月${dayjs(item.endTime - 0).date()}日)`}</p>
                          <p className="reason">{item.lmStateText}</p>
                          <p className="knowledge" style={{ whiteSpace: 'normal', display: ' -webkit-box', textOverflow: 'ellipsis', lineHeight: '22px', overflow: 'hidden', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical' }}>
                            知识点：{item.lessonContentName}
                          </p>
                        </div>
                      </div>
                      <div className="buke-button" onClick={() => this.handleBeginBuKe(item)}>重新复习</div>
                    </div>
                  </div>
                ))
              }
            </div>
            {showLeftBtn && <span className="scroll-btn left-button" onClick={this.handleScrollLeft} />}
            {showRightBtn && <span className="scroll-btn right-button" onClick={this.handleScrollRight} />}
          </div> : 
          this.renderNoWaitLesson()
        }
      </div>
    );
  }

  renderNoWaitLesson = () => {
    const { type } = this.state;
    return (
      <div className="no-wait-lesson">
        <div className="no-img" />
        <div className="no-text">{type ? `暂无待学习，如需要复习请到 “已学习” 中查看` : '暂无已学习课程'}</div>
      </div>
    );
  }

  handleStopScroll = (e) => {
    e.stopPropagation();
  }

  renderNotes = () => {
    return (
      <div id="bukenote" onWheel={e => this.handleStopScroll(e)}>
        <div className="ellipse" />
        <div className="close" onClick={() => this.setState({ showNotes: false })} />
        <div className="content">
          <iframe 
            src={`${Config.notice}`}
            width="100%"
            height="100%"
            frameBorder="no"
            marginWidth="0"
            marginHeight="0"
            scrolling="yes"
            allowtransparency="yes"
            allowFullScreen={true}
          />
        </div>
      </div>
    );
  }

  render() {
    const { navIndex, showNotes, type } = this.state;
    return (
      <div id="kidmindlesson">
        <KidHeader goBack={this.handleGoBack} center="AI互动课" right={this.renderRight()} />
        <KidNavTab items={listItem || []} selectedIndex={navIndex} handleSelect={(item, navIndex) => this.handleSelect(item, navIndex)} />
        {this.renderSubjectList()}
        {type ? this.renderWaitBuke() : this.renderAlreadyBuKe()}
        <ZmModal visible={showNotes}>{this.renderNotes()}</ZmModal>
      </div>
    );
  }
}

function mapStateToProps({ kidmindlessonModel }) {
  return { kidmindlessonModel };
}

export default connect(mapStateToProps)(KidMindLesson);

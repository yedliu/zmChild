import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import dayjs from 'dayjs';
import { AppLocalStorage } from 'utils/localStorage';
import KidHeader from 'components/kidHeader';
import ZmTab from 'components/zmModal/index';
import { clickVoice, H5SendEvent } from 'utils/helpfunc';
import { isKidsClient } from 'utils/nativebridge';
import TeacherDetails from '../KidCardDetails/TeacherDetails';
import { isWeb } from 'zmNativeBridge';
import { dateItems, stateList, typeState, homeworkState, homeState, yuqiState, yuqiList, throttle, starArr, centerStyle, triangleStyle } from './constants';
import './style.scss';
import filtrate from './images/history_btn_filtrate@2x.png';
import teacherdefault from 'statics/common/image/avatarteacher_default.png';

class KidHistory extends Component {
  constructor(props) {
    super(props);
    // const targe_list = this.props.kidHistory.courseList;
    this.state = {
      // checked: 0,
      visible: false,
      checkDate: '',
      checkAllDate: false,
      distance: 0,
      current: 1,
      // showRightBtn: targe_list.length > 4 ? true : false,
      showRightBtn: true,
      endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      // endTime: '2019-03-06',
      // startTime: '2019-03-05',
      startTime: dayjs().subtract(3, 'year').startOf('year').format('YYYY-MM-DD HH:mm:ss'),
      pageNo: 1,
      pageSize: 8,
      // subjectCode: '',
      kecItem: [],
      showTeacDetails: false,
      techerInfoUrl: '',
    };
  }


  componentDidMount() {
    this.requestData();
    this.scroll = throttle(this.scroll, 500);
    window.addEventListener('mousewheel', this.scroll);
  }

  componentWillReceiveProps() {
    const { courseList } = this.props.kidHistory;
    this.setState({
      showRightBtn: courseList.length > 1,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('mousewheel', this.scroll);
  }

  requestData = (isScroll) => {
    const { endTime, startTime, pageNo, pageSize } = this.state;
    const { dispatch, kidHistory } = this.props;
    const { courseList, subjectCode } = kidHistory;
    dispatch({
      type: 'kidHistory/getCourse',
      payload: {
        params: {
          endTime,
          startTime,
          pageNo,
          pageSize,
          subjectCode,
        },
        isScroll,
        kecItem: courseList,
      },
    });

    dispatch({
      type: 'kidHistory/showKidMindButton',
    })
  }

  handleTabClick = (item, index) => {
    const { dispatch } = this.props;
    clickVoice();
    dispatch({
      type: 'kidHistory/setChecked',
      checked: index,
    });
    dispatch({
      type: 'kidHistory/setSubjectCode',
      subjectCode: item.subjectCode,
    });
    this.setState({ pageNo: 1, distance: 0, current: 1 }, () => {
      this.requestData();
    });
  }

  renderKidTab = () => {
    const { kidHistory } = this.props;
    const { subjects, checked, subjectCode, courseList } = kidHistory;
    return (
      (!subjectCode && courseList.length === 0) ? null : (
        <div className="kid-tab">
          {
          subjects.map((item, index) => (
            <div className={`tab-item ${checked === index ? 'active' : ''}`} key={index} onClick={() => this.handleTabClick(item, index)}>
              {item.subjectLabel}
            </div>
          ))
        }
        </div>
      )
    );
  }

  // type:课程类型（2:一对一，1:小班课）state:作业状态  id:作业id
  handleHomeWork = (e, type, homeworkstate, id, lessonId, homeworkLink) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    homeworkLink = `${homeworkLink}&token=${AppLocalStorage.getOauthToken()}`;
    clickVoice();
    const targetPath = `/kid/${type === 1 ? 'kidhomework2' : 'kidhomework'}`;
    const state = {
      type,
      editable: !![32, 33, 34].includes(homeworkstate),
      leftSide: ![32, 33, 34].includes(homeworkstate),
      homeworkstate,
      id,
      lessonId,
      homeworkLink,
      from: '/kid/kidhistory',
    };
    dispatch(routerRedux.push({
      pathname: targetPath,
      state,
    }));
  }

  // 课程报告
  handleCourseReport = (e,item) => {
    // courseType: 1测评课,2正式课, 3调试课,调试课无报告
    // courseMode 1小班课 2一对一
    e.stopPropagation();
    clickVoice();
    const { dispatch } = this.props;
    dispatch(routerRedux.push(
      {
        pathname: '/kid/kidcoursereport',
        state: {
          linkUrl: item.courseType === 1 ? item.testLessonReportLink : item.regularReportLink,
          from: '/kid/kidhistory',
        },
      },
    ));
  }

  // 课程回放
  handleCoursePlayback = (e, item) => {
    const { dispatch } = this.props;
    e.stopPropagation();
    clickVoice();
    dispatch(routerRedux.push(
      {
        pathname: '/kid/kidhistoryvideo',
        state: {
          data: item,
          from: '/kid/kidhistory',
        },
      },
    ));
  }

  // 课件(上课课件，预习课件)
  handleCourseware = (e, courseType, item) => {
    console.log('er',e)
    e.stopPropagation();
    const { dispatch } = this.props;
    clickVoice();
    dispatch(routerRedux.push(
      {
        pathname: '/kid/kidcourseware',
        state: {
          data: item,
          courseType,
          courseState: 1,
          from: '/kid/kidhistory',
        },
      },
    ));
  }

  // 课程卡片详情
  handleDetails = (item) => {
    const { dispatch } = this.props;
    localStorage.removeItem('cardData');
    if (!item.lessonDetailUrl) return;
    localStorage.setItem('cardSource', 'pcHistory');
    localStorage.setItem('teacherUrl', item.lessonDetailUrl);
    localStorage.setItem('cardData', JSON.stringify(item));
    H5SendEvent({eventId: 'study_card', eventParam: {lessonUid: item.lessonUid}})
    dispatch(routerRedux.push({
      pathname: '/kid/kidcarddetails',
      state: {
        from: '/kid/kidhistory',
      }
    }))
  }
  
  lookTeacherDetails = (e, item) => {
    e.stopPropagation();
    if (!item.teacherIntroductionUrl) return;
    this.setState({ showTeacDetails: true, techerInfoUrl: item.teacherIntroductionUrl });
  }

  visibleTeacDetails = () => {
    this.setState({ showTeacDetails: false })
  }

  renderClassItem = (itemList) => {
    const { kidHistory } = this.props;
    const { courseList } = kidHistory;
    return (
      <div className="class-wraper">
        {
          itemList.map((item, index) => (
            <div className={`class-item class-item-${index} class-item-${item.courseCode}`} key={index} onClick={() => this.handleDetails(item)}>
              <div className="status-box">
                {item.courseType == 1 && <div className="class-type">{typeState[item.courseType]}</div>}
              </div>
              <div className="class-title"><p>{item.courseName}</p></div>
              {/* {
                item.behaviourLevel && item.courseMode == 1
                && (
                <div className="class-star">
                  <div className="star-box">
                    {
                      starArr.map((it, index) => (
                        <div className={`star ${index < item.behaviourLevel ? 'yellow-start' : ''}`} key={index} />
                      ))
                    }
                  </div>
                </div>
                )
              } */}
              <div className={`teacher-info ${item.teacherIntroductionUrl ? 'hover-hand' : ''}`} onClick={(e) => this.lookTeacherDetails(e, item)}>
                <img className="teacher-pic" src={item.teacherAvatar || teacherdefault} alt=""/>
                <div className="teacher-name">{item.teacherName}</div>
              </div>
              <div className="time-info">
                <div className="time">{dayjs(item.lessonStartTime).year()}.{dayjs(item.lessonStartTime).month() + 1}.{dayjs(item.lessonStartTime).date()}{' '}{dateItems[dayjs(item.lessonStartTime).day()]}</div>
                <div className="details-time">
                  {dayjs(item.lessonStartTime).format('YYYY-MM-DD HH:mm:ss').split(' ')[1].slice(0, 5)}
                      -
                  {dayjs(item.lessonEndTime).format('YYYY-MM-DD HH:mm:ss').split(' ')[1].slice(0, 5)}
                </div>
              </div>

              <div className="class-time">
                <div className="courseware">
                  {item.preparatoryCourseware && <div className="coure-btn btn-preview" onClick={(e) => this.handleCourseware(e, 'preview', item)}><div className="preview"/><div>预习课件</div></div>}
                  {item.courseware && <div className="coure-btn bnt-class" onClick={(e) => this.handleCourseware(e, 'class', item)}><div className="class"/><div>上课课件</div></div>}
                </div>
              </div>
              { item.courseState === 3
                && (
                <div className="bottom-btn">
                  {item.courseType != 3 && (item.testLessonReportLink || item.regularReportLink) && <div className="common-btn" onClick={(e) => this.handleCourseReport(e, item)}>课程报告</div>}
                  {
                    item.hasPlayBack && [
                      item.courseType != 3 && <span className="line" key={1} />,
                      <div className="common-btn" key={2} onClick={(e) => this.handleCoursePlayback(e, item)}>课程回放</div>,
                    ]
                  }
                  {
                    homeState.includes(item.homeworkState) && [
                      <span className="line" key={3} />,
                      <div
                        key={4}
                        className="common-btn"
                        onClick={(e) => this.handleHomeWork(
                          e,
                          item.courseMode,
                          item.homeworkState,
                          item.homeworkId,
                          item.lessonId,
                          item.homeworkLink || item.homeworkReportLink,
                        )}
                      >
                        {homeworkState[item.homeworkState]}
                        {yuqiState.includes(item.homeworkState) && <div className="yuqi">{yuqiList[item.homeworkState]}</div>}
                      </div>,
                    ]
                  }
                  <div className="dian" />
                </div>
                )
              }

              { (item.courseState && item.courseState != 3) &&
                <div className="bottom-btn disable-btn">
                  {stateList[item.courseState]}
                  <div className="dian" />
                </div>
              }

              {/* { item.courseType == 1 &&
                <div className="bottom-btn disable-btn">
                  {typeState[item.courseType]}
                  <div className="dian" />
                </div>
              } */}

            </div>
          ))
        }
      </div>
    );
  }

  // 鼠标滚动翻页
  scroll = (event) => {
    // console.log(event,'event');
    const mask = document.querySelector('.mask');
    if (event.target == mask) return;
    const { current } = this.state;
    const { kidHistory } = this.props;
    const { total } = kidHistory;
    if (event.wheelDelta < 0) {
      // 向下
      if (current < 2) return;
      this.handleScrollLeft();
    } else {
      if ((Math.abs(parseInt(this.state.distance)) + this.scrollBox.offsetWidth) > this.scrllLand.offsetWidth) {
        this.setState({ showRightBtn: false });
      } else {
        this.setState({ showRightBtn: true });
        this.handleScrollRight();
      }
    }
  }

  handleScrollLeft = () => {
    clickVoice();
    const { distance, current } = this.state;
    const itemList = this.scrllLand.querySelectorAll('.item-land');
    const boxWidth = itemList[0].offsetWidth;
    const landWidth = this.scrllLand.offsetWidth;
    const scrollBoxWidth = this.scrollBox.offsetWidth;
    const moveLeft = Math.abs(parseInt(distance));
    const newDistance = parseInt(moveLeft - scrollBoxWidth / 2);
    if (!itemList || !itemList.length) return;
    if (newDistance > 0) {
      this.setState({
        distance: 0 - newDistance,
        showRightBtn: true,
        current: current - 1,
      });
    } else {
      this.setState({
        distance: 0,
        showRightBtn: true,
        current: current - 1,
      });
    }
  }

  handleScrollRight = () => {
    clickVoice();
    const { kidHistory } = this.props;
    const { total } = kidHistory;
    const { distance, current } = this.state;
    const itemList = this.scrllLand.querySelectorAll('.item-land');
    const boxWidth = itemList[0].offsetWidth;
    const landWidth = this.scrllLand.offsetWidth;
    const scrollBoxWidth = this.scrollBox.offsetWidth;
    const moveLeft = Math.abs(parseInt(distance));
    if (!itemList || !itemList.length) return;
    if (moveLeft + scrollBoxWidth < landWidth) {
      const newDistance = parseInt(moveLeft + scrollBoxWidth / 2);
      let bool = true;
      if (newDistance + scrollBoxWidth >= landWidth) {
        bool = false;
      }
      this.setState({
        distance: 0 - newDistance,
        showRightBtn: bool,
        pageNo: this.state.pageNo + 1,
        current: current + 1,
      }, () => {
        if (this.state.pageNo > Math.ceil(total / 8)) return;
        this.requestData('right');
      });
    }
  }

  renderIdLand = () => {
    const { kidHistory } = this.props;
    const { distance, current, showRightBtn } = this.state;
    const { courseList, total } = kidHistory;
    return (
      <div className="is-land" ref={ele => this.scrollBox = ele}>
        <div
          className="land-scroll"
          ref={ele => this.scrllLand = ele}
          style={{ marginLeft: `${distance}px`, position: 'absolute', top: '25%', left: `${courseList.length > 1 ? '0' : ''}` }}
        >
          {
            courseList.length > 0 ? courseList.map((item, index) => (
              <div className={`item-land ${courseList.length >= 1 ? 'land-left' : ''}`} key={index}>
                {this.renderClassItem(item)}
                {courseList.length > 1 && <div className="qiao" />}
              </div>
            ))
              : (
                <div className="item-land" style={{ marginLeft: 0 }}>
                  <div className="class-wraper">
                    <div className="class-item class-item-none">
                      <div className="nothing" />
                      <div className="nothing-text">你目前还没有历史课程哦~</div>
                    </div>
                  </div>
                </div>
              )
          }
        </div>
        {current >= 2 && <div className="scroll-btn scroll-left" onClick={this.handleScrollLeft} />}
        {showRightBtn && <div className="scroll-btn scroll-right" onClick={this.handleScrollRight} />}
      </div>
    );
  }

  handleCheckDate = (year, month) => {
    console.log(year, month);
    clickVoice();
    switch (month) {
      case '本年':
        this.setState({
          pageNo: 1,
          current: 1,
          distance: 0,
          checkDate: year + month,
          startTime: dayjs(year).format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs(year).endOf('year').format('YYYY-MM-DD HH:mm:ss'),
        }, () => {
          this.requestData();
        });
        break;
      case '全年':
        this.setState({
          pageNo: 1,
          current: 1,
          distance: 0,
          checkDate: year + month,
          startTime: dayjs(`${year}`).format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs(`${year}`).endOf('year').format('YYYY-MM-DD HH:mm:ss'),
        }, () => {
          this.requestData();
        });
        break;
      case '本月':
        const currentMonth = dayjs().month() + 1;
        this.setState({
          pageNo: 1,
          current: 1,
          distance: 0,
          checkDate: year + month,
          startTime: dayjs(`${year}-${currentMonth}`).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs(`${year}-${currentMonth}`).endOf('month').format('YYYY-MM-DD HH:mm:ss'),
        }, () => {
          this.requestData();
        });
        break;
      default:
        this.setState({
          pageNo: 1,
          current: 1,
          distance: 0,
          checkDate: year + month,
          startTime: dayjs(`${year}-${month}`).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs(`${year}-${month}`).endOf('month').format('YYYY-MM-DD HH:mm:ss'),
        }, () => {
          this.requestData();
        });
        break;
    }
  }

  handleCheckAllDate = (year) => {
    clickVoice();
    if (year !== '历史全部') return;
    this.setState({
      pageNo: 1,
      current: 1,
      distance: 0,
      checkDate: year,
      startTime: dayjs().subtract(1, 'year').startOf('year').format('YYYY-MM-DD HH:mm:ss'),
      endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }, () => {
      this.requestData();
    });
  }

  handleScroll = (e) => {
    e.stopPropagation();
  }

  renderDate = () => {
    const { checkDate, checkAllDate } = this.state;
    const { kidHistory } = this.props;
    const { date } = kidHistory;
    return (
      <div className="history-class" onWheel={e => this.handleScroll(e)}>
        <div className="history-content">
          <div className="title">历史课程上课月份</div>
          <div className="date-content">
            {
              date.map((item, index) => (
                <div className="year-content" key={index}>
                  <div
                    className={`year ${item.year === '历史全部' ? 'all-btn' : ''} ${checkDate === item.year ? 'active' : ''}`}
                    onClick={() => this.handleCheckAllDate(item.year)}
                  >
                    {item.year}
                  </div>
                  <div className="month-content">
                    {
                      item.months.map((itemMonth, monthIndex) => (
                        <div
                          className={`month ${(checkDate === item.year + itemMonth) ? 'active' : ''}`}
                          key={monthIndex}
                          onClick={() => this.handleCheckDate(item.year, itemMonth)}
                        >
                          {(parseInt(itemMonth) == itemMonth) ? (itemMonth.length >= 2 ? `${itemMonth}月` : `0${itemMonth}月`) : itemMonth}
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }

  handleDateClick = () => {
    clickVoice();
    this.setState({ visible: true });
  }

  handleCloseMask = () => {
    this.setState({ visible: false });
  }

  handleGoToMindLesson = () => {
    const { dispatch } = this.props;
    clickVoice();
    dispatch(routerRedux.push(
      {
        pathname: '/kid/kidmindlesson',
        state: {
          from: '/kid/kidhistory',
        },
      },
    ));
  }

  renderRight = () => {
    const { kidHistory } = this.props;
    const kidsClient = isKidsClient();
    const { showKidMindButton } = kidHistory;
    if ((kidsClient) && showKidMindButton) {
      return (
        <div className="buke" onClick={this.handleGoToMindLesson}></div>
      );
    } else {
      return (
        <img src={filtrate} alt="" onClick={this.handleDateClick} />
      )
    }
    // return (
    //   <img src={filtrate} alt="" onClick={this.handleDateClick} />
    // );
  }

  handleGoBack = () => {
    const { dispatch } = this.props;
    clickVoice();
    dispatch(routerRedux.push(
      {
        pathname: '/kid',
        state: {
          from: '/kid/kidhistory',
        },
      },
    ));
    dispatch({
      type: 'kidHistory/setSubjectCode',
      subjectCode: '',
    });
    dispatch({
      type: 'kidHistory/setChecked',
      checked: 0,
    });
  }

  renderCenter = () => {
    const { kidHistory } = this.props;
    const { showKidMindButton } = kidHistory;
    const kidsClient = isKidsClient();
    return (
      <div style={centerStyle} onClick={((kidsClient) && showKidMindButton) ? this.handleDateClick:undefined}>
        <div>历史课程</div>
        {((kidsClient) && showKidMindButton) && <span style={triangleStyle}></span>}
      </div>

      // <div style={centerStyle}>
      //   <div>历史课程</div>
      // </div>
    )
  }

  render() {
    const { visible, showTeacDetails, techerInfoUrl } = this.state;
    // console.log('start', dayjs(`2019`).month().format('YYYY-MM-DD'))
    // console.log('start', dayjs(`2018`).endOf('year').format('YYYY-MM-DD'))
    return (
      <div id="kid-history">
        <KidHeader goBack={this.handleGoBack} center={this.renderCenter()} right={this.renderRight()} />
        {this.renderKidTab()}
        {this.renderIdLand()}
        {visible && <ZmTab visible={visible} maskClick={this.handleCloseMask}>{this.renderDate()}</ZmTab>}
        {<TeacherDetails visible={showTeacDetails} url={techerInfoUrl} setVisible={this.visibleTeacDetails} />}
      </div>
    );
  }
}

function mapStateToProps({ kidHistory }) {
  return { kidHistory };
}

export default connect(mapStateToProps)(KidHistory);

import React from 'react';
import dayjs from 'dayjs';
import KidButton from 'components/KidButton';
import PropTypes from 'prop-types';

const COUNTDOWNDURATION = 20 * 60 * 1000; // 倒计时20分钟
const COUNTDOWNHOUR = 180 * 60 * 1000; // 3小时
export class KidCountDown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.MakeTimeInfo = this.MakeTimeInfo.bind(this);
    this.formatSeconds = this.formatSeconds.bind(this);
    this.padZero = this.padZero.bind(this);
    this.updateCountDown = this.updateCountDown.bind(this);
    this.state = { time: 0, hideTimeLeft: false, finish: false };
    this.interval = null;
    // this.timer = null;
    this.serverTime = props.nowTimestamp
    //记录创建组件时的时间戳
    this.compTimestamp = new Date().getTime();
  }

  componentDidMount() {
    // clearInterval(this.timer);
    // const { lessonStartTime } = this.props;
    // const { serverTime } = this.state;
    // const space = (lessonStartTime) - serverTime;
    // if (space <= 24 * 60 * 60 * 1000 && space > 0) {
    //   this.timer = setInterval(() => {
    //     this.setState({ serverTime: this.state.serverTime + 1000 });
    //   }, 1000);
    // }
    const locbelateId = localStorage.getItem('belateId');
    this.setState({locbelateId})
    this.updateCountDown(this.props);
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (this.props.lessonStartTime !== prevProps.lessonStartTime) {
      this.updateCountDown(this.props);
    }
    return null;
  }

  componentDidUpdate() {
    
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    // clearInterval(this.timer);
  }
  getLatestServerTime = ()=>{
    return new Date().getTime() - this.compTimestamp + this.serverTime;
  }
  updateCountDown(nextProps) {
    const { lessonStartTime, nowTimestamp, isFromPage } = nextProps;
    const baseTime = this.getLatestServerTime();
    const space = (lessonStartTime) - baseTime;
    // 首页距开课倒计时 以及 课表 时间大于20分钟，计算倒计时
    if (space > 20 * 60 * 1000 || (isFromPage === 'kidHomePage' && space >= 0 && space <= 20 * 60 * 1000)) {
      const time = this.formatSeconds(space);
      const isSameYear = dayjs(nowTimestamp).isSame(dayjs(lessonStartTime), 'year');
      const isSameMonth = dayjs(nowTimestamp).isSame(dayjs(lessonStartTime), 'month');
      const isSameDate = dayjs(nowTimestamp).isSame(dayjs(lessonStartTime), 'date');
      // 当天时间 显示倒计时
      if (isSameYear && isSameMonth && isSameDate) {
        this.setState({
          time,
          hideTimeLeft: false,
        }, () => {
          this.MakeTimeInfo(lessonStartTime, isFromPage);
        });
      } else if (!isSameDate && isSameYear && isSameMonth && (space <= COUNTDOWNHOUR)) {
        // 非当天时间，距离开课时间小于3小时
        this.setState({
          time,
          hideTimeLeft: false,
        }, () => {
          this.MakeTimeInfo(lessonStartTime, isFromPage);
        });
      } else if (isFromPage === 'kidHomePage') {
        const date1 = dayjs(lessonStartTime);
        const date2 = dayjs(nowTimestamp);
        const leftDay = date1.diff(date2, 'day') || 1;
        this.setState({ hideTimeLeft: true, leftDay }, () => clearInterval(this.interval));
      } else if (isFromPage === 'kidCourseCalendar') {
        this.setState({ hideAll: true }, () => clearInterval(this.interval));
      }
    } else {
      // 首页刷新时距开课时间小于20分钟，显示进入教室按钮
      if (isFromPage === 'kidHomePage') {
        this.setState({ enterClassRoom: true, finish: true });
      }
      // 距开课时间小于20分钟，清除计时器
      if (isFromPage === 'kidCourseCalendar') {
        this.setState({ hideTimeLeft: true }, () => { clearInterval(this.interval); });
      }
    }
  }

  formatSeconds(space) {
    const hours = Math.floor(space / 1000 / 60 / 60 % 24);
    const minutes = Math.floor(space / 1000 / 60 % 60);
    const seconds = Math.floor(space / 1000 % 60);

    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(val) {
    return (`0${val}`).slice(-2);
  }

  MakeTimeInfo(lessonStartTime, isFromPage) {
    clearInterval(this.interval);
    let initialBase = this.getLatestServerTime();
    this.interval = setInterval(() => {
      initialBase += 1000;
      const baseTime = initialBase;
      const space = (lessonStartTime) - baseTime;
      // 首页倒计时跳到下一个状态 => 等待老师上课
      if (isFromPage === 'kidHomePage' && space <= 0) {
        clearInterval(this.interval);
        this.setState({ finish: true });
        return;
      }
      if (isFromPage === 'kidHomePage' && space <= COUNTDOWNDURATION + 1000) {
        this.setState({ enterClassRoom: true });
      }
      const time = this.formatSeconds(space);
      this.setState({ time }, () => {
        // 课表小于等于20分钟，显示进入教室按钮
        if (isFromPage === 'kidCourseCalendar' && space <= COUNTDOWNDURATION + 1000) {
          // clearInterval(this.timer);
          clearInterval(this.interval);
          this.setState({ hideTimeLeft: true });
        }
      });
    }, 1000);
  }

  render() {
    const { hideTimeLeft, finish, enterClassRoom, leftDay, hideAll, time } = this.state;
    const { isFromPage, lesson, enterClass, previewCourseWare, showDialog } = this.props;
    const locbelateId = localStorage.getItem('belateId');
    let isbelate = false; // 是否迟到
    if (locbelateId == lesson.courseId) {
      isbelate = true;
    }
    return (
      <div className="timeLeft">
        {
                (isFromPage === 'kidCourseCalendar') && (hideAll ? '' : hideTimeLeft ? <KidButton disabled={isbelate} size="large" handleClick={() => enterClass(lesson)}>进入教室</KidButton> : (
                  <KidButton disabled size="large">
                    倒计时：
                    {time}
                    {' '}
                  </KidButton>
                ))
            }
        {
                (isFromPage === 'kidHomePage') && (lesson.lessonState === 2 ? (isbelate ? '已迟到，错过上课时间' : '老师正在上课') : finish ? '等待老师上课' : (hideTimeLeft ? (
                  <span>
                    剩余
                    {leftDay}
                    天
                  </span>
                ) : (
                  <span>
                    距上课：
                    {time}
                  </span>
                )))
            }
        {
                isFromPage === 'kidHomePage' && (enterClassRoom ? ((lesson.previewed === 1 || lesson.previewed === 0) ? (
                  <div className="buttonGroup">
                    <KidButton type="normal-y" handleClick={() => previewCourseWare(lesson)}>{lesson.previewed === 1 ? '已预习' : '课前预习'}</KidButton>
                    <KidButton size="small" disabled={isbelate} handleClick={() => enterClass(lesson)}>进入教室</KidButton>
                  </div>
                ) : <KidButton disabled={isbelate} handleClick={() => enterClass(lesson)}>进入教室</KidButton>) : ((lesson.previewed === 1 || lesson.previewed === 0) ? (
                  <div className="buttonGroup">
                    <KidButton type="normal-y" handleClick={() => previewCourseWare(lesson)}>{lesson.previewed === 1 ? '已预习' : '课前预习'}</KidButton>
                    <KidButton
                      disabled
                      size="small"
                      handleClick={() => {
                        showDialog && showDialog();
                      }}
                    >
                      进入教室
                    </KidButton>
                  </div>
                ) : (
                  <KidButton
                    disabled
                    handleClick={() => {
                      showDialog && showDialog();
                    }}
                  >
                    进入教室
                  </KidButton>
                )))
            }
      </div>
    );
  }
}
KidCountDown.propTypes = {
  lessonStartTime: PropTypes.number.isRequired,
  nowTimestamp: PropTypes.number.isRequired,
  isFromPage: PropTypes.string.isRequired,
};

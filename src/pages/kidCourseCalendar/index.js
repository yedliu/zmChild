import React from 'react';
import { connect } from 'dva';
import dayjs from 'dayjs';
import { routerRedux } from 'dva/router';
import { AppLocalStorage } from 'utils/localStorage';
import KidHeader from 'components/kidHeader';
import CheckWebgl from 'components/zmCheckWebgl';

import { isWinSupportOneToMore, isSupportNewLoginWin, setShareDataByName, isSupportOneToOne, isMacSupportOneToMore, isMacPlatform, isNwxp, getClientVersion, blockWin, oneToOneLesson, isKidsClient } from 'utils/nativebridge';
import { Config } from 'utils/config';
import request, { options } from 'utils/request';
import { getDateCount, getTargetMonth, getArr } from 'utils/date';
import { KidTag } from 'components/KidTag';
import { KidCountDown } from 'components/KidCountDown';
import zmAlert from 'components/zmAlert';
import zmTip from 'components/zmTip';
import { clickVoice } from 'utils/helpfunc';
import { windowNativeMethod } from 'zmNativeBridge';
import './index.scss';


const log = (...rest) => {
  console.log(...rest);
};
export const WEEKARRAY = ['日', '一', '二', '三', '四', '五', '六'];
export const isMyLesson = (lessonUid) => {
  // const requestURL = `${Config.apiurl}/gateway/zhangmen-client-inClass/api/eduClass/checkUserLessonPermissions`;
  const requestURL = `${Config.apiurl}/gateway/zhangmen-client-inClass/eduLesson/studentEnterClassroomCheck`;
  const mobile = AppLocalStorage.getMobile();
  const password = AppLocalStorage.getPassWord();
  return request(
    requestURL,
    // Object.assign({}, posthomeworkwithtoken(), {
    //   body: JsonToUrlParams({ lessonUid, mobile, password }),
    // })
    Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify({ lessonUid, mobile, password }) }),
  );
};
export const isMyLessonOneToOne = (lessonUID) => {
  const requestURL = `${Config.apiurl}/gateway/zhangmen-client-inClass/api/lesson/before-start-process`;
  const mobile = AppLocalStorage.getMobile();
  const password = AppLocalStorage.getPassWord();
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify({ lessonUID, mobile, password }) }));
  // return request(
  //   requestURL,
  //   Object.assign({}, posthwjsonwithtoken(), {
  //     body: JSON.stringify({ lessonUID, mobile, password }),
  //   })
  // );
};
export const isNewMyLessonOneToOne = (lessonUid) => {
  const requestURL = `${Config.apiurl}/gateway/zhangmen-client-inClass/singleLesson/studentEnterClassroomCheck`;
  const mobile = AppLocalStorage.getMobile();
  const password = AppLocalStorage.getPassWord();
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify({ lessonUid, mobile, password }) }));
  // return request(
  //   requestURL,
  //   Object.assign({}, posthwjsonwithtoken(), {
  //     body: JSON.stringify({ lessonUID, mobile, password }),
  //   })
  // );
};
class kidCourseCalendar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.closetip = this.closetip.bind(this);
    this.changeMonth = this.changeMonth.bind(this);
    this.chooseDate = this.chooseDate.bind(this);
    this.backToday = this.backToday.bind(this);
    this.makeCourseCard = this.makeCourseCard.bind(this);
    this.enterClass = this.enterClass.bind(this);
    this.back = this.back.bind(this);
    this.getLessonForClass = this.getLessonForClass.bind(this);
    this.state = {
      showScheduleTip: AppLocalStorage.getItem('userAction') ? AppLocalStorage.getItem('userAction').showScheduleTip : true,
      currentDate: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, date: new Date().getDate() },
      time: 0,
      checkwebgl: false,
    },
    this.interval = null;
  }

  componentDidMount() {
    this.changeMonth('current');
  }

  showDialog(info, courseId) {
    const alert = {
      title: info.title || '',
      message: info.msg,
      className: info.className || 'default',
      okText: info.okText || '确定',
      cancelText: info.url ? '取消' : '',
      onOk: !info.url ? () => { localStorage.setItem('belateId', courseId); } : () => {
        blockWin(false);
        location.href = 'https://www.zhangmenkid.com/download';
      },
      onCancel: () => { console.log('no'); },
    };

    zmAlert(alert);
  }

  setBeLate = (itemList) => {
    localStorage.removeItem('belateId');
    localStorage.setItem('belateId', itemList.courseId);
    this.setState({ belateId: localStorage.getItem('belateId', itemList.courseId) })
  }

  enterClass(me, servertimespace, item, type, itemList) {
    const isgotonewroom = isKidsClient();
    const startTime = new Date(item.startTime);
    // 进入教室把设备信息发送给c++
    // windowNativeMethod('DeviceInfo', [localStorage.getItem('giveDeviceInfoToNative')]);
    // 客户端版本，小组课不允许进入课堂
    if (isWinSupportOneToMore() || isMacSupportOneToMore()) {
      if ((getClientVersion() < '2.0.82') && item.classMode && item.classMode === 1) {
        const info = {
          msg: '请联系班主任或去官网下载最新版本的客户端',
          okText: ' 确定',
        };
        this.showDialog(info);
        return;
      }
    }
    // 调试课,测评课,2.0.71及以下小学生用户（3年级及以下 不允许进入课堂 isWinSupportOneToMore() || isMacSupportOneToMore()
    if (isWinSupportOneToMore() || isMacSupportOneToMore()) {
      const isDebugLesson = ((item.courseType === 1 && item.type === 'debug-lesson') || (item.courseType === 3 && item.type === 2));
      const isTestLesson = ((item.courseType === 1 && item.type === 'test-lesson') || (item.courseType === 3 && item.type === 0));
      if (localStorage.getItem('isKidVersion') && (getClientVersion() <= '2.0.71') && (isDebugLesson || isTestLesson)) {
        const info = {
          msg: '当前版本暂不支持少儿课程，请前往 掌门少儿官网 下载最新电脑客户端。下载完成后，请关闭此客户端再安装',
          url: 'https://www.zhangmenkid.com/download',
          okText: '立即前往',
        };
        this.showDialog(info);
        // this.setState({ modallinkShow: true });
        return;
      }
    }
    // xp系统拦截
    if (isNwxp() && item.type === 2 && (item.courseType === 3 || item.courseType === 1)) {
      // this.setState({ modalXpShow: true });
      const info = {
        msg: '我们检测出你的电脑为XP系统，此系统暂不支持上课，请升级电脑系统至win7以上，或更换到Pad端上课',
      };
      this.showDialog(info);
      return;
    }
    if (startTime - servertimespace <= 20 * 60 * 1000) {
      if (isWinSupportOneToMore()) {
        if (item.courseType === 3) {
          isMyLesson(item.lessonUid).then((rep) => {
            if (rep.code === '0') {
              localStorage.removeItem('belateId');
              if (rep.message) {
                const info = {
                  title: rep.message,
                  time: 2000,
                };
                zmTip(info);
                setTimeout(() => {
                  if (isSupportNewLoginWin()) {
                    window.onbeforeunload = null;
                    setShareDataByName('CURRENT_LESSON_DATA', Object.assign({}, item, { kidVersion: 2 }));
                    setShareDataByName('zm-chat-redux-userInfo', JSON.parse(localStorage.getItem('zm-chat-redux-userInfo')));
                    setShareDataByName('zm-chat-redux-tocken', JSON.parse(localStorage.getItem('zm-chat-redux-tocken')));
                    location.href = isgotonewroom ? `${Config.apiurl}/kids/stuclass/small/${item.lessonUid}` : `${Config.classroomurl}`;
                  }
                }, 2000)
              } else {
                if (isSupportNewLoginWin()) {
                  window.onbeforeunload = null;
                  setShareDataByName('CURRENT_LESSON_DATA', Object.assign({}, item, { kidVersion: 2 }));
                  setShareDataByName('zm-chat-redux-userInfo', JSON.parse(localStorage.getItem('zm-chat-redux-userInfo')));
                  setShareDataByName('zm-chat-redux-tocken', JSON.parse(localStorage.getItem('zm-chat-redux-tocken')));
                  location.href = isgotonewroom ? `${Config.apiurl}/kids/stuclass/small/${item.lessonUid}` : `${Config.classroomurl}`;
                }
              }
            } else {
              const info = {
                title: rep.message || '抱歉，由于迟到你已错过进入教室时间 请联老师重新预约',
                okText: '我知道了',
                className: 'meike',
              }
              this.showDialog(info, itemList.courseId);
              this.setBeLate(itemList);
              return;
            }
          });
        } else if (isSupportOneToOne()) {
          isNewMyLessonOneToOne(item.uid).then((rep) => {
            if (rep.code === '0') {
              if (isSupportNewLoginWin()) {
                window.onbeforeunload = null;
                setShareDataByName('CURRENT_LESSON_DATA', Object.assign({}, item, { kidVersion: 2 }));
                setShareDataByName('zm-chat-redux-userInfo', JSON.parse(localStorage.getItem('zm-chat-redux-userInfo')));
                setShareDataByName('zm-chat-redux-tocken', JSON.parse(localStorage.getItem('zm-chat-redux-tocken')));
                location.href = isKidsClient()  ? `${Config.apiurl}/kids/stuclass/one2one/${item.uid}` : `${Config.classroomurl}`;
              }
            } else {
              const info = {
                msg: rep.message,
              };
              this.showDialog(info);
            }
          });
        } else {
          const data = {
            MsgType: 'Enterlesson',
            HostUrl: Config.apiurl,
            lessonInfo: item,
            userInfo: { _userData: AppLocalStorage.getUserInfo() },
            mSlideAddr: Config.uploaddoc,
            mFsAddr: Config.fsurl,
            isLockScreen: true,
          };
          oneToOneLesson.bind(me)(JSON.stringify(data));
        }
        return;
      } if (isMacSupportOneToMore()) {
        if (item.courseType === 3) {
          isMyLesson(item.lessonUid).then((rep) => {
            if (rep.code === '0') {
              localStorage.removeItem('belateId');
              if (rep.message) {
                const info = {
                  title: rep.message,
                  time: 2000,
                };
                zmTip(info);
                setTimeout(() => {
                  if (isSupportNewLoginWin()) {
                    window.onbeforeunload = null;
                    setShareDataByName('CURRENT_LESSON_DATA', Object.assign({}, item, { kidVersion: 2 }));
                    setShareDataByName('zm-chat-redux-userInfo', JSON.parse(localStorage.getItem('zm-chat-redux-userInfo')));
                    setShareDataByName('zm-chat-redux-tocken', JSON.parse(localStorage.getItem('zm-chat-redux-tocken')));
                    location.href = isgotonewroom ? `${Config.apiurl}/kids/stuclass/small/${item.lessonUid}` : `${Config.classroomurl}`;
                  }
                }, 2000)
              } else {
                if (isSupportNewLoginWin()) {
                  window.onbeforeunload = null;
                  setShareDataByName('CURRENT_LESSON_DATA', Object.assign({}, item, { kidVersion: 2 }));
                  setShareDataByName('zm-chat-redux-userInfo', JSON.parse(localStorage.getItem('zm-chat-redux-userInfo')));
                  setShareDataByName('zm-chat-redux-tocken', JSON.parse(localStorage.getItem('zm-chat-redux-tocken')));
                  location.href = isgotonewroom ? `${Config.apiurl}/kids/stuclass/small/${item.lessonUid}` : `${Config.classroomurl}`;
                }
              }
            } else {
              const info = {
                title: rep.message || '抱歉，由于迟到你已错过进入教室时间 请联老师重新预约',
                okText: '我知道了',
                className: 'meike',
              }
              this.showDialog(info, itemList.courseId);
              this.setBeLate(itemList);
              return;
            }
          });
          return;
        } if (isSupportOneToOne()) {
          isNewMyLessonOneToOne(item.uid).then((rep) => {
            if (rep.code === '0') {
              if (isSupportNewLoginWin()) {
                window.onbeforeunload = null;
                setShareDataByName('CURRENT_LESSON_DATA', Object.assign({}, item, { kidVersion: 2 }));
                setShareDataByName('zm-chat-redux-userInfo', JSON.parse(localStorage.getItem('zm-chat-redux-userInfo')));
                setShareDataByName('zm-chat-redux-tocken', JSON.parse(localStorage.getItem('zm-chat-redux-tocken')));
                location.href = isKidsClient() ? `${Config.apiurl}/kids/stuclass/one2one/${item.uid}` : `${Config.classroomurl}`;
              }
            } else {
              const info = {
                msg: rep.message,
              };
              this.showDialog(info);
            }
          });
          return;
        }
      } else if (!window.NativeLogin && !isMacPlatform()) {
        if (item.courseType === 3) {
          isMyLesson(item.lessonUid).then((rep) => {
            if (rep.code === '0') {
              localStorage.removeItem('belateId');
              if (rep.message) {
                const info = {
                  title: rep.message,
                  time: 2000,
                };
                zmTip(info);
                setTimeout(() => {
                  localStorage.setItem('CURRENT_LESSON_DATA', JSON.stringify(Object.assign({}, item, { kidVersion: 2 })));
                  location.href = isgotonewroom ? `${Config.apiurl}/kids/stuclass/small/${item.lessonUid}` : `${Config.classroomurl}?l=${JSON.stringify(item)}&u=${localStorage.getItem('zm-chat-redux-userInfo')}&t=${localStorage.getItem('zm-chat-redux-tocken')}`;
                }, 2000)
              } else {
                localStorage.setItem('CURRENT_LESSON_DATA', JSON.stringify(Object.assign({}, item, { kidVersion: 2 })));
                location.href = isgotonewroom ? `${Config.apiurl}/kids/stuclass/small/${item.lessonUid}` : `${Config.classroomurl}?l=${JSON.stringify(item)}&u=${localStorage.getItem('zm-chat-redux-userInfo')}&t=${localStorage.getItem('zm-chat-redux-tocken')}`;
              }
            } else {
              const info = {
                title: rep.message || '抱歉，由于迟到你已错过进入教室时间 请联老师重新预约',
                okText: '我知道了',
                className: 'meike',
              }
              this.showDialog(info, itemList.courseId);
              this.setBeLate(itemList);
              return;
            }
          });
        } else {
          isNewMyLessonOneToOne(item.uid).then((rep) => {
            if (rep.code == '0') {
              localStorage.setItem('CURRENT_LESSON_DATA', JSON.stringify(Object.assign({}, item, { kidVersion: 2 })));
              location.href = isKidsClient() ? `${Config.apiurl}/kids/stuclass/one2one/${item.uid}` : `${Config.classroomurl}?l=${JSON.stringify(item)}&u=${localStorage.getItem('zm-chat-redux-userInfo')}&t=${localStorage.getItem('zm-chat-redux-tocken')}`;
            } else {
              const info = {
                msg: rep.message,
              };
              this.showDialog(info);
            }
          });
        }
       return;
     }
     /** 1对多新版end* */
     if (Config.frameurl === window.location.origin) {
       localStorage.setItem('autolesson', item.lessonUid);
     }
   }
 }

 changeMonth(type, ...rest) {
   clickVoice();
   const { currentDate } = this.state;
   const { dispatch, noteDate = {} } = this.props;
   const { year, month, date } = noteDate;
   let currentYear = year;
   let currentMonth = month;
   let currentDay = date;
   if (rest.length > 0) {
     const item = rest[0];
     currentYear = dayjs(item.time).year();
     currentMonth = dayjs(item.time).month() + 1;
     currentDay = dayjs(item.time).date();
   } else if (type === 'prev') {
     currentYear = month - 1 <= 0 ? year - 1 : year;
     currentMonth = month - 1 <= 0 ? 12 : month - 1;
     currentDay = date;
   } else if (type === 'current') {
     currentYear = currentDate.year;
     currentMonth = currentDate.month;
     currentDay = currentDate.date;
   } else if (type === 'next') {
     currentYear = month + 1 > 12 ? currentYear + 1 : currentYear;
     currentMonth = month + 1 > 12 ? 1 : month + 1;
     currentDay = date;
   }
   log('currentYear', currentYear, 'currentMonth', currentMonth, 'currentDay', currentDay);

   // 计算月历卡信息
   const monthDateCount = getDateCount(currentYear, currentMonth);
   // log('monthDateCount', monthDateCount)
   const firstDateIsWhichDay = new Date(`${currentYear}-${currentMonth}`).getDay();
   // log('firstDateIsWhichDay', firstDateIsWhichDay)
   // const lastDateIsWhichDay = getDateIsWhichDay(currentYear, currentMonth, 0);
   // log('lastDateIsWhichDay', lastDateIsWhichDay)
   const prevMonth = getTargetMonth(currentYear, currentMonth, 'prev');
   // log('prevMonth', prevMonth)
   const nextMonth = getTargetMonth(currentYear, currentMonth, 'next');
   // log('nextMonth', nextMonth)
   const prevMonthDateCount = getDateCount(prevMonth.year, prevMonth.month, 0);
   // log('prevMonthDateCount', prevMonthDateCount)
   const beforeDateCount = Number(firstDateIsWhichDay) > 0 ? Number(firstDateIsWhichDay) : 0;
   // log('beforeDateCount', beforeDateCount)
   const startDate = new Date(`${prevMonth.year}-${prevMonth.month}-${(prevMonthDateCount - beforeDateCount) + 1}`);
   // log('startDate', startDate.getDate())
   const prevMonthDateArr = getArr(beforeDateCount).map((val, i) => `${prevMonth.year}-${prevMonth.month}-${startDate.getDate() + i}`);
   // console.log('prevMonthDateArr=====>', prevMonthDateArr)
   const nowMonthDateArr = getArr(monthDateCount).map((val, i) => `${currentYear}-${currentMonth}-${i + 1}`);
   // console.log('nowMonthDateArr=====>', nowMonthDateArr)
   const nextMonthLength = (monthDateCount + beforeDateCount) >= 42 ? 0 : 42 - (monthDateCount + beforeDateCount);
   const nextMonthDateArr = getArr(nextMonthLength).map((val, i) => `${nextMonth.year}-${nextMonth.month}-${i + 1}`);
   // log('nextMonthDateArr=====>', nextMonthDateArr);
   const dateArr = [].concat(prevMonthDateArr, nowMonthDateArr, nextMonthDateArr);

   const newNoteDate = { ...noteDate, year: currentYear, month: currentMonth, date: currentDay };
   const statesParams = { startTime: dayjs(dateArr[0]).valueOf(), endTime: dayjs(dateArr[dateArr.length - 1]).valueOf() };
   const courseParams = { startTime: dayjs(`${newNoteDate.year}-${newNoteDate.month}-${newNoteDate.date}`).valueOf() };
   dispatch({ type: 'kidcoursecalendar/setNotesDate', payload: { newNoteDate } });
   dispatch({ type: 'kidcoursecalendar/queryCourseStates', payload: { statesParams } });
   dispatch({ type: 'kidcoursecalendar/queryCourseSchedule', payload: { courseParams } });
 }

 chooseDate(item) {
   clickVoice();
   const { dispatch, noteDate = {} } = this.props;
   const newNoteDate = { ...noteDate, year: dayjs(item.time).year(), month: dayjs(item.time).month() + 1, date: dayjs(item.time).date() };
   if (dayjs(item.time).year() > noteDate.year || dayjs(item.time).month() + 1 > +noteDate.month) {
     this.changeMonth('next', item);
   } else if ((dayjs(item.time).year() < noteDate.year) || (dayjs(item.time).month() + 1 < noteDate.month)) {
     this.changeMonth('prev', item);
   } else if (dayjs(item.time).month() + 1 === +noteDate.month) {
     const courseParams = { startTime: dayjs(`${newNoteDate.year}-${newNoteDate.month}-${newNoteDate.date}`).valueOf() };
     dispatch({ type: 'kidcoursecalendar/setNotesDate', payload: { newNoteDate } });
     dispatch({ type: 'kidcoursecalendar/queryCourseSchedule', payload: { courseParams } });
   }
 }

 backToday() {
   const { currentDate } = this.state;
   const { dispatch, noteDate = {} } = this.props;
   // console.log('currentDate====>', currentDate);
   const newNoteDate = { ...noteDate, year: currentDate.year, month: currentDate.month, date: currentDate.date };
   dispatch({ type: 'kidcoursecalendar/setNotesDate', payload: { newNoteDate } });
 }

 closetip() {
   // console.log(AppLocalStorage.setUserAction);
   this.setState({ showScheduleTip: false }, () => {
     AppLocalStorage.setItem('userAction', { showScheduleTip: false });
   });
 }

 async getLessonForClass(item, index) {
   // console.log('getLessonForClass============',item);
   const lessonInfo = await this.props.dispatch({ type: 'kidcoursecalendar/getLessonForClass', payload: { type: item.type, lessonId: item.courseId } });
   if (JSON.stringify(lessonInfo) != '{}' && JSON.stringify(lessonInfo.lesson) != '{}') {
     this.enterClass(this, lessonInfo.date, Object.assign(item, lessonInfo.lesson), item.type, item);
   }
 }

 makeCourseCard(data, nowTimestamp) {
   const element = data.length > 0 && data.map((item, index) => {
     return (
       <section className="calendar-card" key={index}>
         <header>
           <time>
             {
              (item.courseState === '0501' || item.courseState === '0502') ? `${dayjs(item.oldStartTime).format('HH:mm')}-${dayjs(item.oldEndTime).format('HH:mm')}` : `${dayjs(item.startTime).format('HH:mm')}-${dayjs(item.endTime).format('HH:mm')}`
            }
             {/* {`${dayjs(item.startTime).format('HH:mm')}-${dayjs(item.endTime).format('HH:mm')}`} */}
           </time>
           {(item.courseType === 1 || item.courseType === 3) && <KidTag type={item.courseType} text={item.courseType === 1 ? '测评课' : item.courseType === 3 ? '调试课' : ''} />}
           {<KidTag type={item.courseState} text={item.courseStateText} />}
         </header>
         <h3>{item.courseName}</h3>
         {
              !!item.knowledgePoint && (
              <p>
                课程内容：
                {item.knowledgePoint}
              </p>
              )
            }
          <p>
            上课老师：
            {(item.courseState === '0501' || item.courseState === '0502') ? item.oldTeacherName : item.teacherName}
          </p>
          {
              (item.type === 1 && item.membersList && item.membersList.length > 0) && (
              <p>
                班级同学：
                {
                item.membersList.map((it, idx) => { return it.avatar.includes('http') > 0 ? <span style={{ backgroundColor: 'rgba(96,134,255,1)', border: '1px solid rgba(221,221,221,1)' }} key={idx}><img src={it.avatar} /></span> : <span key={idx}>{it.studentName.slice(0, 1)}</span>; })
              }
              </p>
              )
            }
            {item.courseId == localStorage.getItem('belateId') && <p style={{color: '#FF6969'}}>已迟到，已错过进入教室时间</p>}
         {
              // 待上课
              (item.courseState === '0104' || item.courseState === '02') && (
              <KidCountDown
                lesson={item}
                lessonStartTime={item.startTime}
                nowTimestamp={nowTimestamp}
                isFromPage="kidCourseCalendar"
                enterClass={() => {
                  this.getLessonForClass(item, index);
                // this.enterClass(this, item, index)
                }}
              />
              )

            }
         {
              // 已换课 和 已学习
              item.courseStateChangeTitle && item.courseStateChangeTitle.length > 0 && (
              <div className="repmis-lesson-info">
                <p className="title">{item.courseStateChangeTitle}</p>
                <p>
                  上课老师：
                  {(item.courseState === '0501' || item.courseState === '0502') ? item.teacherName : item.oldTeacherName}
                </p>
                <p>
                  上课时间：
                  {(item.courseState === '0501' || item.courseState === '0502') ? `${dayjs(item.startTime).format('YYYY.MM.DD HH:mm')}-${dayjs(item.endTime).format('HH:mm')}` : `${dayjs(item.oldStartTime).format('YYYY.MM.DD HH:mm')}-${dayjs(item.oldEndTime).format('HH:mm')}` }
                </p>
              </div>
              )
            }
       </section>
     );
   });
   return element;
 }

 back() {
   const { dispatch } = this.props;
   dispatch(routerRedux.push('/kid'));
 }

    handleGoBack = () => {
      const { dispatch } = this.props;
      dispatch(routerRedux.push(
        {
          pathname: '/kid',
          state: {
            from: '/kidcoursecalendar',
          },
        },
      ));
    }

    render() {
      const { showScheduleTip, currentDate, checkwebgl } = this.state;
      const { curCourseDate, noteDate, courseSchedule } = this.props;
      const daiShangke = courseSchedule.courseScheduleCards && courseSchedule.courseScheduleCards.filter(item => item.courseState == '0104') || [];
      const weekIndex = +dayjs(`${noteDate.year}-${noteDate.month}-${noteDate.date}`).day();

      return (
        <div className="kidCourseCalendar">
          <KidHeader goBack={this.handleGoBack}>我的课表</KidHeader>
          <div className="containerWrap">
            <div className="container">
              <div className="left-content">
                <div className="calendar-title">
                  <span className="prev-button" onClick={() => this.changeMonth('prev')} />
                  <span className="month">
                    {noteDate.year}
                      年
                    {noteDate.month}
                      月
                  </span>
                  <span className="next-button" onClick={() => this.changeMonth('next')} />
                  {
                      ((noteDate.year != currentDate.year) || (noteDate.month != currentDate.month)) && <span className="today" onClick={() => this.changeMonth('current')}>今</span>
                    }
                </div>
                <div className="calendar-content">
                  <span className="left-dot" />
                  <span className="right-dot" />
                  <div className="scheduleInfo">
                    <div className="tableWrap">
                      <div className="tableHeader">
                        {
                            WEEKARRAY.map((val, index) => {
                              return (
                                <div className="week" key={index}>
                                  {val}
                                </div>
                              );
                            })
                          }
                      </div>
                      <div className="tableContent">
                        {
                              curCourseDate.map((item, index) => (
                                <div className="tabletr" key={index}>
                                  {
                                  item.map((it, idx) => {
                                    return (
                                      <div className={`tabletd ${((noteDate.month !== dayjs(it.time).month() + 1)) ? 'otherMonth' : ''}`} key={idx} onClick={() => this.chooseDate(it)}>
                                        <span className={`${((noteDate.month === dayjs(it.time).month() + 1) && (noteDate.date === dayjs(it.time).date())) && 'selectedDay'} ${it.courseScheduleState === 1 ? 'gray-dot' : it.courseScheduleState === 2 ? 'green-dot' : it.courseScheduleState === 3 ? 'red-dot' : ''}`}>
                                          {((dayjs(it.time).year() === currentDate.year) && (dayjs(it.time).month() + 1 === currentDate.month) && (currentDate.date === dayjs(it.time).date())) ? <em className="currentDay">今</em> : dayjs(it.time).date()}
                                        </span>
                                      </div>
                                    );
                                  })
                                }
                                </div>
                              ))
                            }
                      </div>
                    </div>
                  </div>

                </div>
                {
                    showScheduleTip && (
                    <div className="calendar-tip">
                      <span>如需请假/换课/补课/取消课程 请移步至【掌门少儿】APP</span>
                      <span className="close" onClick={this.closetip} />
                    </div>
                    )
                  }
              </div>
              <div className="right-content">
                <div className="calendar-title">
                  {`${noteDate.month}月${noteDate.date}日`}
                    &nbsp;&nbsp;
                  {`周${WEEKARRAY[weekIndex]}`}
                    &nbsp;&nbsp;
                  {daiShangke.length > 0 && `${daiShangke.length}节待上`}
                </div>
                <div className="calendar-content">
                  {
                      courseSchedule.courseScheduleState ? this.makeCourseCard(courseSchedule.courseScheduleCards, courseSchedule.nowTimestamp) : (
                        <section className="no-course">
                          {/* <img src={img_default_no}/> */}
                          <span className="img_default_no" />
                          <span>今日暂无更多课程</span>
                        </section>
                      )
                    }
                </div>
              </div>
            </div>
          </div>
          {checkwebgl && <CheckWebgl visible={checkwebgl} onClose={() => { this.setState({ checkwebgl: false }); }} /> }
        </div>
      );
    }
}
const mapStateToProps = ({ kidcoursecalendar: { curCourseDate, noteDate, courseStates, courseSchedule }, loading }) => { // 见名知意，把state转换为props
  // 可以打印state看看数据结构，然后放到data里
  // return { curCourseDate, loading };
  return { curCourseDate, noteDate, courseStates, courseSchedule, loading };
};

export default connect(mapStateToProps)(kidCourseCalendar);

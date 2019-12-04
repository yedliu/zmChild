import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import request, { options } from 'utils/request';
import { AppLocalStorage } from 'utils/localStorage'
import zmAlert from 'components/zmAlert';
import zmTip from 'components/zmTip';
import {
  isWinSupportOneToMore,
  isSupportNewLoginWin,
  setShareDataByName,
  isSupportOneToOne,
  isMacSupportOneToMore,
  isMacPlatform,
  isNwxp,
  blockWin,
  getClientVersion,
  isKidsClient,
} from 'utils/nativebridge';

import { Config } from 'utils/config';

import './index.scss';

export const isMyLesson = (lessonUid) => {
  const requestURL = `${Config.apiurl}/gateway/zhangmen-client-inClass/eduLesson/studentEnterClassroomCheck`;
  const mobile = AppLocalStorage.getMobile();
  const password = AppLocalStorage.getPassWord();
  return request(
    requestURL,
    Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify({ lessonUid, mobile, password }) }),
  );
};


function CardDetails(props) {
  const [fromPage, setFromPage] = useState(null);

  useEffect(() => {
    const cardSource = localStorage.getItem('cardSource');
    setFromPage(cardSource);
    window.addEventListener('message', IframeListener);
    return () => {
      console.log('组件卸载')
      window.removeEventListener('message', IframeListener);
    }
  }, [fromPage])

  const IframeListener = (e) => {
    const { dispatch } = props;
    let item = JSON.parse(localStorage.getItem('cardData'));
    switch(e.data.action) {
      case 'LOAD_READY':
        window.frames[0].postMessage({
          action: 'oauthToken',
          data: AppLocalStorage.getOauthToken(),
        }, '*');
        window.frames[0].postMessage({
          action: 'appName',
          data: 'KidsPC',
        }, '*');
        window.frames[0].postMessage({
          action: 'userId',
          data: AppLocalStorage.getUserInfo().userId,
        }, '*');
        break;
      case 'kidback': //返回按钮
        dispatch(routerRedux.push(
          {
            pathname: fromPage == 'pcIndex' ? '/kid' : '/kid/kidhistory',
            state: {
              from: '/kid/kidcarddetails',
            },
          },
        ));
        break;
      case 'handlePreview': //预习课件
        if (fromPage == 'pcIndex') {
          item = Object.assign({}, item, { courseMode: item.type, lessonId: item.courseId, preparatoryCourseware: true });
        }
        dispatch(routerRedux.push(
          {
            pathname: '/kid/kidcourseware',
            state: {
              data: item,
              courseType: 'preview',
              courseState: fromPage == 'pcIndex' ? item.lessonState : 1,
              from: '/kid/kidcarddetails',
            },
          },
        ));
        break;
      case 'handleClassPreview': //上课课件
        dispatch(routerRedux.push(
          {
            pathname: '/kid/kidcourseware',
            state: {
              data: item,
              courseType: 'class',
              courseState: 1,
              from: '/kid/kidcarddetails',
            },
          },
        ));
        break;
      case 'dohomework': //做练习
        if (fromPage == 'pcIndex') {
          let targetPath = `/kid/${item.type === 1 ? 'kidhomework2' : 'kidhomework'}`;
          let homeworkLink = `${item.homeworkLink}&token=${AppLocalStorage.getOauthToken()}`;
          let state = {
            type: item.type === 1 ? 1 : 2, // 1小班课 ，2一对一
            editable: true,
            leftSide: false,
            homeworkstate: 33,
            id: item.id,
            homeworkLink,
            from: '/kid/kidcarddetails',
          };
          dispatch(routerRedux.push({
            pathname: targetPath,
            state,
          }));
        } else {
          let homeworkLink = item.homeworkLink || item.homeworkReportLink
          homeworkLink = `${homeworkLink}&token=${AppLocalStorage.getOauthToken()}`;
          const targetPath = `/kid/${item.courseMode === 1 ? 'kidhomework2' : 'kidhomework'}`;
          const state = {
            type: item.courseMode,
            editable: !![32, 33, 34].includes(item.homeworkstate),
            leftSide: ![32, 33, 34].includes(item.homeworkstate),
            homeworkstate: item.homeworkState,
            id: item.homeworkId,
            lessonId: item.lessonId,
            homeworkLink,
            from: '/kid/kidcarddetails',
          };
          dispatch(routerRedux.push({
            pathname: targetPath,
            state,
          }));
        }
       
        break;
      case 'report': // 查看课程报告
        dispatch(routerRedux.push(
          {
            pathname: '/kid/kidcoursereport',
            state: {
              linkUrl: item.courseType === 1 ? item.testLessonReportLink : item.regularReportLink,
              from: '/kid/kidcarddetails',
            },
          },
        ));
        break;
      case 'enterClass': // 进入教室
        getLessonForClass(item);
        break;
      case 'playback': //课程回放
        dispatch(routerRedux.push(
          {
            pathname: '/kid/kidhistoryvideo',
            state: {
              data: item,
              from: '/kid/kidcarddetails',
            },
          },
        ));
        break;
    }
  };

  const getLessonForClass = async (item) => {
    const lessonInfo = await props.dispatch({ type: 'CardDetailsModel/getLessonForClass', payload: { type: item.type, lessonId: item.courseId } });
    if (lessonInfo && Object.keys(lessonInfo).length > 0 && Object.keys(lessonInfo.lesson).length > 0) {
      enterClass(lessonInfo.date, Object.assign(item, lessonInfo.lesson), item.type, item);
    }
  }

  const enterClass = (servertimespace, item, type, itemList) => {
    console.log('item', item);
    const isgotonewroom = isKidsClient();
    const startTime = new Date(item.startTime);
    // 客户端版本，小组课不允许进入课堂
    if (isWinSupportOneToMore() || isMacSupportOneToMore()) {
      if ((getClientVersion() < '2.0.82') && item.classMode && item.classMode === 1) {
        const info = {
          msg: '请联系班主任或去官网下载最新版本的客户端',
          okText: ' 确定',
        };
        showDialog(info);
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
        showDialog(info);
        return;
      }
    }
    // xp系统拦截
    if (isNwxp() && item.type === 2 && (item.courseType === 3 || item.courseType === 1)) {
      const info = {
        msg: '我们检测出你的电脑为XP系统，此系统暂不支持上课，请升级电脑系统至win7以上，或更换到Pad端上课',
      };
      showDialog(info);
      return;
    }
    if (startTime - servertimespace <= 20 * 60 * 1000) {
      if (isWinSupportOneToMore()) {
        if (item.courseType === 3) { //小班课
          isMyLesson(item.lessonUid).then((rep) => {
            if (rep.code === '0') {
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
              showDialog(info, itemList.courseId);
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
                location.href = isKidsClient() ? `${Config.apiurl}/kids/stuclass/one2one/${item.uid}` : `${Config.classroomurl}`;
              }
            } else {
              const info = {
                msg: rep.message,
              };
              showDialog(info);
            }
          });
        } 
        return;
      } if (isMacSupportOneToMore()) {
        if (item.courseType === 3) { //小班课
          isMyLesson(item.lessonUid).then((rep) => {
            if (rep.code === '0') {
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
              showDialog(info, itemList.courseId);
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
              showDialog(info);
            }
          });
          return;
        }
      } else if (!window.NativeLogin && !isMacPlatform()) {
        if (item.courseType === 3) { //小班课(测评课，正式课)
          isMyLesson(item.lessonUid).then((rep) => {
            if (rep.code === '0') {
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
              showDialog(info, itemList.courseId);
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
              showDialog(info);
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

  const showDialog = (info, courseId) => {
    const alert = {
      title: info.title || '',
      message: info.msg,
      className: info.className || 'default',
      okText: info.okText || '确定',
      cancelText: info.url ? '取消' : '',
      onOk: !info.url ? () => {} : () => {
        blockWin(false);
        location.href = 'https://www.zhangmenkid.com/download';
      },
      onCancel: () => { console.log('no'); },
    };

    zmAlert(alert);
  }

  return (
    <div id="kidcarddetails">
      <iframe
        onLoad={() => {
          window.addEventListener('message', IframeListener, false);
        }}
        // src={`//192.168.61.4:9000/carddetails?lessonUid=51decc92585e41668bab9d6ae63229fd&from=index_card`}
        src={`${localStorage.getItem('teacherUrl')}&oauthToken=${AppLocalStorage.getOauthToken()}`}
        width="100%"
        height="100%"
        frameBorder="no"
        marginWidth="0"
        marginHeight="0"
        scrolling="yes"
        allowtransparency="yes"
        allowFullScreen={true}
        allow="camera;microphone"
      />
    </div>
  )
}

const mapStateToProps = ({CardDetailsModel}) => {
  return { CardDetailsModel }
}

export default connect(mapStateToProps)(CardDetails);
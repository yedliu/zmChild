import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { AppLocalStorage } from 'utils/localStorage';
import dayjs from 'dayjs';
import { KidNavTab } from 'components/KidNavTab';
import KidButton from 'components/KidButton';
import { KidCountDown } from 'components/KidCountDown';
import KidMessage from 'components/KidMessage';
import zmNotification, { clearNotification } from 'components/zmNotification';
import KidAppointment from 'components/KidAppointment';
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
  getClientVersion,
  blockWin,
  oneToOneLesson,
  getMacAddress,
  closeApp,
  initPlugin,
  isKidsClient,
} from 'utils/nativebridge';
import { Config } from 'utils/config';
import { throttle, clickVoice, createDataBuryFunction, initZMJSSDK, H5SendEvent } from 'utils/helpfunc';
import request, { options } from 'utils/request';
import { windowNativeMethod, nativeEmit, isWin, isWeb } from 'zmNativeBridge';
import updateAlert from 'components/updateAlert';
import CheckWebgl from 'components/zmCheckWebgl';
import DownloadZmgFileTip from '../../components/CourseWareDownload/index';
import { WEEKARRAY } from '../kidCourseCalendar';
import FriendsAnimate from '../../components/KidFriendsAnmiate';
import DownLoadPartner from '../KidFriends/downLoad';
import Studyland from '../../components/KidStudyland';
import StudyParkEntryAnimate from './entryAnimate';

import TchFestival from './tchFestival';

import { getDeviceInfo } from 'utils/agora-getDeviceInfo';
import TeacherDetails from '../KidCardDetails/TeacherDetails';

import './kidhome.scss';


import Ai from './image/ai.svga';
import home_img_time from './image/home_img_time@2x.png';
import home_img_wait from '../../statics/common/image/home_img_wait@2x.png';
import home_img_ceping from './image/home_img_ceping@2x.png';
import home_svga_fireworm from './image/home_svga_fireworm@2x.png';
import home_img_welcome from './image/home_img_welcome@2x.png';
import home_img_receive from './image/home_img_receive@2x.png';
import home_img_tixi from './image/home_img_tixi@2x.png';

import rabbitSound from '../../statics/common/mp3/rabbit.mp3';
import foxSound from '../../statics/common/mp3/fox.mp3';
import bearSound from '../../statics/common/mp3/bear.mp3';

import avatar_boy from './image/photo_boy_110@2x.png';
import avatar_girl from './image/photo_girl_110@2x.png';
import teacherdefault from 'statics/common/image/avatarteacher_default.png';

// 学伴播放音频
const soundList = {
  1: foxSound,
  2: rabbitSound,
  3: bearSound,
};

// 自助调试课埋点
const sendBuryEvent = createDataBuryFunction();
export const isMyLesson = (lessonUid) => {
  // const requestURL = `${Config.apiurl}/gateway/zhangmen-client-inClass/api/eduClass/checkUserLessonPermissions`;
  const requestURL = `${Config.apiurl}/gateway/zhangmen-client-inClass/eduLesson/studentEnterClassroomCheck`;
  const mobile = AppLocalStorage.getMobile();
  const password = AppLocalStorage.getPassWord();
  return request(
    requestURL,
    Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify({ lessonUid, mobile, password }) }),
  );
};
export const isMyLessonOneToOne = (lessonUID) => {
  const requestURL = `${Config.apiurl}/gateway/zhangmen-client-inClass/api/lesson/before-start-process`;
  const mobile = AppLocalStorage.getMobile();
  const password = AppLocalStorage.getPassWord();
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify({ lessonUID, mobile, password }) }));
};
export const isNewMyLessonOneToOne = (lessonUid) => {
  const requestURL = `${Config.apiurl}/gateway/zhangmen-client-inClass/singleLesson/studentEnterClassroomCheck`;
  const mobile = AppLocalStorage.getMobile();
  const password = AppLocalStorage.getPassWord();
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify({ lessonUid, mobile, password }) }));
};
const userInfo = AppLocalStorage.getUserInfo();
const macAddress = getMacAddress();
const appVersion = getClientVersion();

function getRemote() {
  var _window$require = window.require('electron'),
    remote = _window$require.remote;
  return remote;
}
export function checkEnvironment() {
  const notXpClient = getClientVersion().indexOf('xp') !== 0;
  return window.process
    && (window.process.platform === 'win32' || window.process.platform === 'darwin')
    && notXpClient
    && window.ZmResourcesLocalization
}

class KidHomePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.scrollLeft = this.scrollLeft.bind(this);
    this.scrollRight = this.scrollRight.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.enterClass = this.enterClass.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.scroll = this.scroll.bind(this);
    this.toStudyTest = this.toStudyTest.bind(this);
    this.calculateSize = this.calculateSize.bind(this);
    this.previewCourseWare = this.previewCourseWare.bind(this);
    this.getLessonForClass = this.getLessonForClass.bind(this);
    this.getSimulateLessonState = this.getSimulateLessonState.bind(this);
    this.showToast = this.showToast.bind(this);
    this.testClientUpgrade = this.testClientUpgrade.bind(this);
    localStorage.setItem('isKidVersion', true);
    this.flag = 0;
    this.state = {
      // navIndex:0,
      scrolledLeft: 0,
      showScrollRightBtn: true,
      showScrollLeftBtn: false,
      unlesson: true,
      buyedLesson: true,
      showModal: false,
      showDropDown: false,
      firstSimulateLesson: false,
      isForceSimulateLesson: false,
      needSimulate: false,
      showTestOrFailResult: true,
      isSupportAICourse: false,
      unPassObj: {},
      platformInfo: '',
      // subjectCode:'',
      deviceInfo: {
        speakerId: '',
        videoId: '',
        voiceId: '',
        macAddress,
      },
      // 升级相关标志
      showUpgrade: sessionStorage.getItem('showUpgrade'),
      packageName: '',
      downloadDir: '',
      checkwebgl: false,
      belateId: null,
      updateInfo: {},
      closeEntry:false,
      currentDate: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, date: new Date().getDate() },
      showTeacDetails: false,
      techerInfoUrl: '',
    };
  }

  async componentDidMount() {
    const { dispatch,entryConfig } = this.props;
    initZMJSSDK();
    //先补充用户数据
    await this.toCompleteProfile();

    // setResizeWH();
    initPlugin();
    this.calculateSize();
    // 设置自助调试课堂状态
    const isMac = window.NativeLogin ? false : isMacPlatform();
    const isSupportAICourse = (isMac && appVersion >= '2.1.1') || (!isMac && appVersion >= '2.2.1');
    // 客户端版本低于2.2.31强制升级
    const needUpgrade = await this.coerceEquipmentTesting()
    if (!isWeb() && !localStorage.getItem('noUpgrade') && needUpgrade) {
      return;
    }
    // 主页背景更换
    dispatch({ type: 'kidHomePage/changeFestivalBg' });
    this.setState({ isSupportAICourse });
    this.getCurrentDevice();
    this.getplatformInfo();
    
    this.getSimulateLessonState();
    this.checkSimulate()
    const subjectCode = localStorage.getItem('subjectCode');
    dispatch({ type: 'kidHomePage/getLessonList' });
    this.requestTab();
    dispatch({ type: 'kidHomePage/getMessageCount' });
    dispatch({ type: 'kidHomePage/getLearningAbilityResult' });
    // 获取用户是否领取学伴
    dispatch({ type: 'kidHomePage/getPartnerInfo' });
    // 是否签到
    // dispatch({ type: 'kidHomePage/getSign' });
    // 学伴本地化
    dispatch({ type: 'kidHomePage/getManifest' });
    // 教师节活动弹窗
    dispatch({ type: 'kidHomePage/getFestival' });

    //获取学习乐园配置
    dispatch({type:'kidHomePage/getStudylandEntryConfig'});
    this.scroll = throttle(this.scroll, 500);
    window.addEventListener('mousewheel', this.scroll);
    window.addEventListener('resize', throttle(this.calculateSize, 10));

    clearInterval(this.interval);
    clearInterval(this.timer);
    this.interval = setInterval(() => {
      dispatch({ type: 'kidHomePage/getNetworkSpeed' });
    }, 5 * 60 * 1000);

    this.timer = setInterval(() => {
      // 获取用户是否领取学伴
      dispatch({ type: 'kidHomePage/getPartnerInfo' });
      this.requestTab();
      this.getSimulateLessonState();
      this.getAiLastTestResult(this.state.deviceInfo);
    }, 180 * 1000);
    setTimeout(() => {
      this.getAiLastTestResult(this.state.deviceInfo);
    }, 100);
    // 检测更新
    this.testClientUpgrade();
    // 能够支持用户屏幕分辨率的数据统计
    if (!localStorage.getItem('screenAcc')) {
      const accData = {
        message: '用户屏幕分辨率的数据统计',
        result: {
          availHeight: window.screen.availHeight,
          availLeft: window.screen.availLeft,
          availTop: window.screen.availTop,
          availWidth: window.screen.availWidth,
          colorDepth: window.screen.colorDepth,
          height: window.screen.height,
          pixelDepth: window.screen.pixelDepth,
          width: window.screen.width
        },
        action: 'getUserScreen'
      }
      window.__acc2__(accData);
      localStorage.setItem('screenAcc', true);

      // this.startHttpServer

    }
  }

  startHttpServer() {
    if(checkEnvironment()){
      this.path = getRemote().require('path');
      this.fs = getRemote().require('fs');
      this.https = getRemote().require('https');
      const { path, fs } = this;
      fs.exists(path.join(window.process.resourcesPath, 'app', 'node_modules', 'http-server'), (exists) => {
        if (exists) {


          const zmZmgLocalLoad = this.zmZmgLocalLoad = new window.ZmResourcesLocalization();

          if(!fs.existsSync(path.join(window.process.resourcesPath,"app","process.json"))){
            const path = this.getRemote().require('path')
            const writeObject = {}
            Object.keys(window.process).filter(x => typeof window.process[x] === 'string').forEach(x => writeObject[x] = window.process[x])
            this.zmZmgLocalLoad.writeToFileSync(path.join(window.process.resourcesPath,"app","process.json"), JSON.stringify(writeObject))
          }

          this.zmZmgLocalLoad.createPort(path.join(window.process.resourcesPath, 'app'));
          const existZmgPath = fs.existsSync(path.join(window.process.resourcesPath, 'app', 'zmg'));
          if (!existZmgPath) {
            this.createLocalFolder(path.join(window.process.resourcesPath, 'app', 'zmg'));
          }
        }


      });
    }
  }

  checkSimulate = () => {
    if (window.ZmResourcesLocalization && window.require) {
      try {
        const zmr = new window.ZmResourcesLocalization()
        const { remote } = window.require('electron')
        const path = remote.require('path')
        const homedir = remote.require('os').homedir()

        const targetPath = path.join(homedir, 'zmlearn')
        const data = (zmr.getFileContentSync(path.join(targetPath, 'ai.config')) || {}).data || ''
        if (data && appVersion != data) {
          this.setState({
            needSimulate: true
          })
          this.loadSvga()
          zmr.createFolder(targetPath, () => {
            zmr.writeToFileSync(path.join(targetPath, 'ai.config'), appVersion)
          })
        } else if (!data) {
          zmr.createFolder(targetPath, () => {
            zmr.writeToFileSync(path.join(targetPath, 'ai.config'), appVersion)
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  async getSimulateLessonState() {
    const { dispatch } = this.props;
    // 获取最近是否有课，是否有自助调试课
    const lessonStateRes = await dispatch({ type: 'kidHomePage/getSimulateLessonState', payload: { userId: userInfo.userId, bodyParams: { macAddress, stuId: userInfo.id, source: 5 } } });
    // 无自助调试课+最近无课则强制上自助调试课 / 无自助调试课+有课 在首页显示进入自助调试课 / 有过自助调试课则不显示自助调试课
    if (!!lessonStateRes && !lessonStateRes.hasRecentLesson && !lessonStateRes.hasSimulateLesson) {
      this.setState({
        showTestOrFailResult: false,
        isForceSimulateLesson: true,
      });
      this.loadSvga();
    } else if (!!lessonStateRes && lessonStateRes.hasRecentLesson && !lessonStateRes.hasSimulateLesson) {
      this.setState({
        firstSimulateLesson: true,
      });
    }
  }

  showToast(item) {
    this.setState({
      messagecontent: `课程将于${dayjs(item.lessonStartTime).format('YYYY-MM-DD HH:mm')}开始`,
      messagetype: 'error',
      showToast: true,
    }, () => {
      setTimeout(() => {
        this.setState({ showToast: false });
      }, 1000);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!!this.props.allLessonList.courseCards && this.props.allLessonList.courseCards.length > 0) {
      this.calculateSize();
    }
  }

  async toCompleteProfile() {
    const { dispatch } = this.props;
    const personInfo = await dispatch({ type: 'kidHomePage/getPersonalInfo' }) || {};
    // 补齐学生年级信息
    try {
      const userInfo = JSON.parse(localStorage.getItem('zm-chat-redux-userInfo') || '{}')
      if (!userInfo.stuGradeCode) {
        userInfo.stuGradeCode = personInfo.stuGradeCode || ''
        localStorage.setItem('zm-chat-redux-userInfo', JSON.stringify(userInfo))
      }
      if (personInfo.hasOwnProperty('sex')) {
        userInfo.sex = personInfo.sex || 0
        localStorage.setItem('zm-chat-redux-userInfo', JSON.stringify(userInfo))
      }
    } catch (e) {
      console.log('error', e)
    }
    if (personInfo && !personInfo.name && personInfo.stuGrade) {
      dispatch(routerRedux.push('/kid/kidprofilecomplete'));
    }
    if (personInfo && !personInfo.name || !personInfo.stuGrade) {
      dispatch(routerRedux.push(`/kid/kidprofilecomplete?stuGrade=${personInfo.stuGradeCode}`));
    } else {
      const buData = await dispatch({ type: 'kidHomePage/getIsBelongKidsBu' });
      if (!buData && !isKidsClient()) {
        localStorage.removeItem('isKidVersion');
        localStorage.setItem('zm-chat-redux-isLogin', true);
        location.href = '/studentNew'; // 跳转到新的学生端
      }
    }
  }

  // 获取设备信息
  getCurrentDevice = () => {
    try {
      if (isKidsClient()) {
        getDeviceInfo().then((data) => {
          if (data) {
            const deviceInfoData = data;
            const deviceInfo = {
              speakerId: deviceInfoData.curspeaker.id || '',
              videoId: deviceInfoData.curvideo.id || '',
              voiceId: deviceInfoData.curvoice.id || '',
              macAddress,
              source: 5,
            };

            this.setState({
              deviceInfo,
            });
          }
        });
      } else {
        nativeEmit('initInstance', { appid: '0368433925644e9b83eeff9fff26b61e' });
        nativeEmit('getDeviceInfoV2', {}, (data) => {
          console.log('data', data);
          if (data.MsgType === 'device info') {
            const deviceInfoData = data.data;
            const deviceInfo = {
              speakerId: deviceInfoData.currentSpeakerId || '',
              videoId: deviceInfoData.currentVideoId || '',
              voiceId: deviceInfoData.currentVoiceId || '',
              macAddress,
              source: 5,
            };

            this.setState({
              deviceInfo,
            });
          }
        });
      }

    } catch (e) {
      // console.log(e);
    }
  }

  // 获取平台信息
  getplatformInfo = () => {
    let userAgent = navigator.appVersion;
    if (isWin()) {
      nativeEmit('initInstance', { appid: '0368433925644e9b83eeff9fff26b61e' });
      nativeEmit('getSystemInfoV2', {}, (data) => {
        console.log(data, 'getSystemInfoV2');
        if (data.MsgType === 'CurrentSystemData') {
          const systemData = data;
          userAgent = `OS:${systemData.computerSystemInfo};cpu:${systemData.cpuName};MemoryFree:${systemData.MemoryAvailPhys};MemoryTotal:${systemData.MemoryTotalPhys};DiskUsage:${systemData.DiskUsage};DisplayCard:${systemData.DisplayCard}`;
          console.log('userAgent', userAgent);
        }
      });
    } else {
      userAgent = navigator.appVersion;
    }

    this.setState({
      platformInfo: userAgent,
    });
  }

  async getAiLastTestResult(simuBodyParams) {
    // 查看上节自助调试课是否通过 通过则显示通过（通过弹小窗口显示，关掉后更新通过状态），不通过则显示不通过理由（不通过理由在首页以卡牌形式展示）
    const simuRes = await this.props.dispatch({ type: 'kidHomePage/getAiLastTestResult', payload: { userId: userInfo.userId, bodyParams: simuBodyParams } });
    if (simuRes) {
      this.setState({
        showTestOrFailResult: !simuRes.hasPassedTest,
        unPassObj: simuRes,
      });
      const openSelfServiceClass = sessionStorage.getItem('openSelfServiceClass');
      if (openSelfServiceClass) {
        sessionStorage.removeItem('openSelfServiceClass');
        this.showPassNotification(simuRes.hasPassedTest, simuRes.lessonUid || '');
      }
    }
  }

  showPassNotification(pass, lessonUid) {
    if (!pass) {
      clearNotification();
      return;
    }
    // 查看接口看通不通过
    const info = {
      title: '自助调试课结果：',
      message: '非常棒，掌小萌期待与你在上课中相遇哦~',
      className: 'success',
      onCancel: () => {
        // 关掉后更新状态
        sendBuryEvent(['首页', '自助调试_少儿关闭通过确认框'], '', 'ai_kid_close_successful', '', {
          role: AppLocalStorage.getRole(),
        });
        this.props.dispatch({ type: 'kidHomePage/updateDeviceNotifyReadState', payload: { lessonUid } });
      },
    };
    zmNotification(info, true);
  }

  async openSimulateLesson(dataBuryId, description) {
    clickVoice();
    sessionStorage.setItem('openSelfServiceClass', true);
    if (dataBuryId) {
      sendBuryEvent(description, '', dataBuryId, '', {
        role: AppLocalStorage.getRole(),
      });
    }
    const { dispatch } = this.props;
    // 在这里开课并进入参数传啥？
    const bodyParams = {
      macAddress,
      platformInfo: this.state.platformInfo,
      role: userInfo.role,
      versionInfo: `${isKidsClient() ? 'kpc' : 'pc'}-${getClientVersion()}`,
      source: 5,
    };
    console.log(bodyParams);
    // 建好课后跳转到上课
    const res = await dispatch({ type: 'kidHomePage/openSimulateLesson', payload: { userId: userInfo.userId, bodyParams } });
    if (res) {
      const { lessonUid } = res;
      let segmentPath = '/classroom/simulation'
      if (isKidsClient()) {
        segmentPath = '/kids/stuclass/simulation'
      }
      location.href = `${Config.frameurl}${segmentPath}/${lessonUid}?source=5&returnUrl=${encodeURIComponent(window.location.href)}`;
    }
  }

  async getLessonForClass(item, index) {
    console.log('getLessonForClass============',item);
    const lessonInfo = await this.props.dispatch({ type: 'kidHomePage/getLessonForClass', payload: { type: item.type, lessonId: item.courseId } });
    if (lessonInfo && Object.keys(lessonInfo).length > 0 && Object.keys(lessonInfo.lesson).length > 0) {
      console.log('this', this)
      this.enterClass(this, lessonInfo.date, Object.assign(item, lessonInfo.lesson), item.type, item);
    }
  }

  handleDevice = () => {
    clickVoice();
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/kid/kiddevicetest'));
  }

  loadSvga() {
    import('svgaplayerweb').then((SVGA) => {
      let player = new SVGA.Player(this.svgaDiv);
      let parser = new SVGA.Parser(this.svgaDiv);
      parser.load(Ai, (videoItem) => {
        player.setVideoItem(videoItem);
        player.startAnimation();
      });
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.timer);
    window.removeEventListener('mousewheel', this.scroll);
    this.flag = null;
  }

  previewCourseWare(me, item) {
    item = Object.assign({}, item, { courseMode: item.type, lessonId: item.courseId, preparatoryCourseware: true });
    console.log('item', item)
    const { dispatch } = this.props;
    dispatch(routerRedux.push(
      {
        pathname: '/kid/kidcourseware',
        state: {
          data: item,
          courseType: 'preview',
          courseState: item.lessonState,
          from: '/kid',
        },
      },
    ));
  }

  calculateSize() {
    const card_items = this.refs.card_content && this.refs.card_content.querySelectorAll('.card-item');
    const scrolledLeft = Math.abs(parseInt(this.state.scrolledLeft));
    if (!card_items || !card_items.length) {
      return false;
    }
    const client_width = this.refs.scroll_view.offsetWidth;
    const card_content_width = this.refs.card_content.offsetWidth;
    const card_item_width = card_items[0].offsetWidth;
    if (client_width + scrolledLeft > card_content_width) {
      this.setState({ showScrollRightBtn: false });
    } else {
      this.setState({ showScrollRightBtn: true });
    }
  }

  showDialog(info, courseId) {
    const alert = {
      title: info.title || '',
      message: info.msg,
      className: info.className || 'default',
      okText: info.okText || '确定',
      cancelText: info.url ? '取消' : '',
      onOk: !info.url ? () => { this.setState({ belateId: localStorage.getItem('belateId', courseId) }) } : () => {
        blockWin(false);
        location.href = 'https://www.zhangmenkid.com/download';
      },
      onCancel: () => { console.log('no'); },
    };

    zmAlert(alert);
  }

  handleSelect(item, navIndex) {
    const { dispatch } = this.props;
    localStorage.setItem('subjectCode', item.subjectCode);
    localStorage.setItem('NavIndex', navIndex);
    this.setState({ scrolledLeft: 0, showScrollLeftBtn: false }, () => {
      this.requestTab();
    });
  }

  // 请求tab卡片数据
  requestTab = () => {
    const { dispatch } = this.props;
    const NavIndex = localStorage.getItem('NavIndex') - 0 || 0;
    const subjectCode = localStorage.getItem('subjectCode');
    NavIndex !== 0 ? dispatch({ type: 'kidHomePage/getStudyingCourse', payload: { subjectCode } }) : dispatch({ type: 'kidHomePage/getLessonList' });
  }

  // 向右滑动
  scrollLeft() {
    this.state.showScrollLeftBtn && clickVoice();
    const card_items = this.refs.card_content.querySelectorAll('.card-item');
    const scrolledLeft = Math.abs(parseInt(this.state.scrolledLeft));
    const card_item_width = card_items[0].offsetWidth;
    if (!card_items || !card_items.length || scrolledLeft === 0) {
      return false;
    }
    if (scrolledLeft > 0) {
      const rollRightWidth = parseInt(scrolledLeft - card_item_width * 2);
      this.setState({ scrolledLeft: -rollRightWidth });
      if (rollRightWidth > 0) {
        this.setState({ showScrollRightBtn: true });
      } else {
        this.setState({ showScrollLeftBtn: false });
      }
    }
  }

  // 向左滑动
  scrollRight() {
    this.state.showScrollRightBtn && clickVoice();
    const card_items = this.refs.card_content.querySelectorAll('.card-item');
    const scrolledLeft = Math.abs(parseInt(this.state.scrolledLeft));
    if (!card_items || !card_items.length) {
      return false;
    }
    const client_width = this.refs.scroll_view.offsetWidth;
    const card_content_width = this.refs.card_content.offsetWidth;
    const card_item_width = card_items[0].offsetWidth;
    if (client_width + scrolledLeft < card_content_width) {
      const rollLeftWidth = parseInt(scrolledLeft + card_item_width * 2);
      this.setState({ scrolledLeft: 0 - rollLeftWidth }, () => this.setState({ showScrollLeftBtn: true }));

      if (client_width + rollLeftWidth >= card_content_width) {
        this.setState({ showScrollRightBtn: false });
      }
    }
  }

  handleClick(index, linkUrl) {
    clickVoice();
    if (index === 1) {
      this.setState({ showModal: true });
    } else {
      this.props.dispatch(routerRedux.push(
        {
          pathname: 'kid/kidKnows',
          state: {
            type: 'knowKid',
            linkUrl,
          },
        },
      ));
    }
  }

  toStudyTest(data) {
    clickVoice();
    const { dispatch } = this.props;
    dispatch(routerRedux.push(
      {
        pathname: '/kid/kidpracticecenter',
        state: {
          url: data.centerUrl,
          from: '/kid',
        },
      },
    ));
    // if (!data.hasDoLearn) {
    //   this.props.dispatch(routerRedux.push('/kid/ability/test'));
    // } else {
    //   this.props.dispatch(routerRedux.push('/kid/studyability/report'));
    // }
  }

  // 鼠标滚动翻页
  scroll(event) {
    if (event.wheelDelta < 0) {
      // 向下
      this.flag++;
      if (this.flag > 1) {
        this.scrollRight();
        this.flag = 0;
      }
    } else {
      this.flag++;
      if (this.flag > 1) {
        this.flag = 0;
        this.scrollLeft();
      }
    }
  }

  // 检测客户端是否支持webgl
  coerceEquipmentTesting = async () => {
    let canvasDom = document.createElement('canvas');
    let canvasDomWebgl = canvasDom.getContext('webgl');

    const version = getClientVersion();

    const {planParam = {}} = await this.getUpdateInfo('VERSION_BLACKLIST')
    const {extras = {}} = planParam
    // 小班课，调试课，测评课
    if ((!canvasDomWebgl || extras.needUpgrade)) {
      this.setState({ checkwebgl: true, updateInfo: extras }, () => {
        canvasDom = null;
        canvasDomWebgl = null;
      });
      return true
    }
    return false
  };

  setBeLate = (itemList) => {
    localStorage.removeItem('belateId');
    localStorage.setItem('belateId', itemList.courseId);
    this.setState({ belateId: localStorage.getItem('belateId', itemList.courseId) })
  }

  enterClass(me, servertimespace, item, type, itemList) {
    console.log('item', item);
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
        // this.setState({ modalShow: true });
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
        if (item.courseType === 3) { //小班课
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
                location.href = isKidsClient() ? `${Config.apiurl}/kids/stuclass/one2one/${item.uid}` : `${Config.classroomurl}`;
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
        if (item.courseType === 3) { //小班课
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
        if (item.courseType === 3) { //小班课(测评课，正式课)
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

  findCourseTime = () => {
    clickVoice();
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/kidcoursecalendar'));
  }

  gotoHistory = () => {
    clickVoice();
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/kid/kidhistory'));
  }

  gotoDrivingCenter = () => {
    clickVoice();
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/kid/kiddrivingcenter'));
  }

  doHomeWork = (item) => {
    clickVoice();
    const { dispatch } = this.props;
    const targetPath = `/kid/${item.type === 1 ? 'kidhomework2' : 'kidhomework'}`;
    const homeworkLink = `${item.homeworkLink}&token=${AppLocalStorage.getOauthToken()}`;
    const state = {
      type: item.type === 1 ? 1 : 2, // 1小班课 ，2一对一
      editable: true,
      leftSide: false,
      homeworkstate: 33,
      id: item.id,
      homeworkLink,
      from: '/kid',
    };
    dispatch(routerRedux.push({
      pathname: targetPath,
      state,
    }));
  }

  gotoTest = (item = {}) => {
    const { dispatch } = this.props;
    const { homeworkLink } = item;
    if (!homeworkLink) {
      return;
    }
    const token = AppLocalStorage.getOauthToken();
    const src = `${homeworkLink}&token=${token}&device=PC`;
    dispatch(routerRedux.push({
      pathname: '/kid/phasetest',
      state: {
        src,
        from: '/kid'
      }
    }));
  }

  // 去领取学伴
  gotoKidFriends = () => {
    const { dispatch, manifestData } = this.props;
    // dispatch(routerRedux.push('/kid/kidFriends'));
    dispatch(routerRedux.push({
      pathname: '/kid/kiddownpartner',
      state: {
        from: '/kid',
        data: {
          parseCourseList: {id:manifestData.id,manifest:manifestData.url,...manifestData},
          moduleName:'partner',
          downloadMsg:'正在进入学伴房间，确定退出吗？'
        }
      }
    }));
  }

  // 签到获取魔力果
  signGetFruit = () => {
    const { dispatch, partnerInfo } = this.props;
    dispatch({
      type: 'kidHomePage/getAddFruit',
      payload: {
        lessonUid: '',
        partnerId: partnerInfo.partnerId,
        strategy: 'SIGN',
      },
      callBack: data => this.showFriuteNum(data),
    });
  }

  showFriuteNum = (data) => {
    if (data.detail) {
      this.setState({ showFriute: true, fruite: data.detail.sign }, () => {
        const audio = this.friendsAudio;
        if (audio && audio.paused) {
          audio.play();
        }
        setTimeout(() => {
          this.setState({ showFriute: false });
        }, 2000);
      });
    }
  }

  handlePartner = () => {
    clickVoice();
    const { partnerInfo } = this.props;
    //学伴入口埋点
    const { isAdoption, isHunger, isSign } = partnerInfo || {};
    const buryData = {
      companionStatus: {
        isAdoption,
        isHunger,
        isSign
      }
    }
    sendBuryEvent(['PC首页', '学伴入口点击'], '', 'click_companion_entrance', '', buryData);
    // 领取未签到，不能进入游戏，点击执行签到
    if (!partnerInfo.isSign && partnerInfo.isAdoption) {
      this.signGetFruit();
    } else {
      // 其他的可以进入游戏
      this.gotoKidFriends();
    }
  }

  getUpdateInfo(grayCode = 'PLAN_PC_LIMIT') {
    const appName = AppLocalStorage.getAppName() || 'KidsPC';
    const userId = userInfo.userId || '';
    const reqParam = {
      grayCode,
      map: {
        userId: userId.toString(),
        platform: window.process && window.process.platform,
        version: appVersion
      }
    };
    // 设置头部参数
    const reqHeaders = {
      // 'App-Name': appName,
      // 'App-Version': appVersion,
      'Accept': '*/*',
      'Api-Version': '1.0.0',
      'Content-Type': 'application/json',
    };
    return this.props.dispatch({ type: 'kidHomePage/getSelectSwitch', payload: { headers: reqHeaders, body: reqParam } });
  }

  //学习乐园入口
  handleStudylandEntry = ()=>{
    const {dispatch, entryConfig={}} = this.props;
    const {studyParkModuleConfigVO={}} = entryConfig;
    clickVoice();
    sendBuryEvent(['PC首页', '学习乐园入口埋点'], '', 'amusement_entrance_pc', '', {});
    dispatch(routerRedux.push({
      pathname: '/kid/kiddownpartner',
      state: {
        from: '/kid',
        data: {
          parseCourseList: {id:studyParkModuleConfigVO.moduleId,manifest:studyParkModuleConfigVO.manifest,...studyParkModuleConfigVO},
          moduleName:'studypark',
          downloadMsg:'正在进入学习乐园，确定退出吗？'
        }
      }
    }));
  }
  //关闭学习乐园入口引导
  onGuideClose = ()=>{
    this.setState({closeEntry:true});
    // this.handleStudylandEntry();
  }
  // 客户端升级
  async testClientUpgrade() {
    if (!window.require && !localStorage.getItem('noUpgrade')) {
      return;
    }
    let showUpgrade = JSON.parse(this.state.showUpgrade);
    if (showUpgrade === null) {
      showUpgrade = true;
    }
    if (!showUpgrade) {
      return;
    }
    const isMac = window.NativeLogin ? false : isMacPlatform();
    const appName = AppLocalStorage.getAppName() || 'KidsPC';
    const userId = userInfo.userId || '';

    try {
      // 请求升级信息
      const updateInfo = await this.getUpdateInfo()
      const { planParam: { extras } } = updateInfo;
      if (extras) {
        const downloadUrl = isMac ? extras.macdownloadUrl : extras.downloadUrl;
        await this.downloadUpdatePackage(extras, isMac);
        const updateOption = {
          isForce: extras.forceUpgrade, // 是否强制更新
          contentList: extras.promptTextList || [],
          onOk: () => {
            this.updateNow();
          },
          onCancel: () => {
            this.setState({ showUpgrade: false });
            sessionStorage.setItem('showUpgrade', false);
          },
        };
        updateAlert(updateOption);
      }
    } catch (err) { }

  }

  updateNow() {
    if (!window.require) {
      return;
    }
    const { packageName, downloadDir } = this.state;
    const isMac = window.NativeLogin ? false : isMacPlatform();
    try {
      const { remote } = window.require('electron');
      const child_process = remote.require('child_process');
      const path = remote.require('path');
      if (isMac) {
        const child = child_process.spawn(`open "${downloadDir + path.sep + packageName}"`, [], { detached: true, shell: true }); // mac调起安装包
        child.unref();
        setTimeout(() => {
          closeApp(); // 关闭客户端
        }, 2500);
      } else {
        const child = child_process.spawn(`"${downloadDir + path.sep + packageName}"`, [], { detached: true, shell: true });
        child.unref();
        setTimeout(() => {
          child_process.exec('taskkill /f /im 掌门1对1*'); // 杀掉进程，否则跟安装程序冲突
          child_process.exec('taskkill /f /im 掌门少儿*'); // 杀掉进程，否则跟安装程序冲突
        }, 5000);
      }
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  downloadUpdatePackage(extras, isMac) {
    let { downloadUrl } = extras;
    let { targetVersion } = extras;
    if (isMac) {
      downloadUrl = extras.macdownloadUrl;
      targetVersion = extras.mactargetVersion;
    }
    return new Promise((resolve, reject) => {
      const { remote } = window.require && window.require('electron') || {};
      if (!remote || !window.ZmResourcesLocalization) {
        reject();
        return;
      }
      const path = remote.require('path');
      const fs = remote.require('fs');
      const clientLoad = new window.ZmResourcesLocalization();
      const downloadDir = path.resolve(window.process.resourcesPath, '../zmDownload');
      // 判断目录是否存在，不存在创建
      if (!fs.existsSync(downloadDir)) {
        clientLoad.createFolder(downloadDir);
      }
      // 判断安装包是否存在，不存在下载
      const suffixReg = isMac ? /\.dmg$/ : /\.exe$/;
      let fileName = downloadUrl.split('/').pop().trim();
      if (!fileName.match(suffixReg)) {
        // 文件名不匹配，纠正文件名
        fileName = fileName.replace(/\.(\w{3})$/, isMac ? 'dmg' : 'exe');
      }
      this.setState({ packageName: fileName, downloadDir });
      // 判断文件是否存在
      const filePath = downloadDir + path.sep + fileName;
      const isPackageReady = fs.existsSync(filePath);
      if (!isPackageReady) {
        if (location.protocol === 'http:') {
          downloadUrl = downloadUrl.replace(/^https/, 'http');
        }
        const tmpFileName = `${fileName}.tmp`;
        remote.NewClientLoadReq = clientLoad.downLoadResourcesBreakpointResumePromise(downloadUrl, tmpFileName, path.resolve(downloadDir), () => {
          console.log('升级包下载成功');
          remote.NewClientLoadReq = null;
          const tmpPath = downloadDir + path.sep + tmpFileName;
          fs.renameSync(tmpPath, filePath);
          clientLoad.getFileMd5(filePath, function (data) {
            if (data.bizMessage === extras.sourceMD5Signature || data.bizMessage === extras.macsourceMD5Signature) {
              resolve()
            }else{
              fs.unlinkSync(filePath)
              reject(data);
            }
          }, function (data) {
            fs.unlinkSync(filePath)
            reject(data);
          })

        }, (err) => {
          console.log('升级包下载失败');
          remote.NewClientLoadReq = null;
          reject(err);
        });
      } else {
        clientLoad.getFileMd5(filePath, function (data) {
          if (data.bizMessage === extras.sourceMD5Signature || data.bizMessage === extras.macsourceMD5Signature) {
            resolve()
          }else{
            fs.unlinkSync(filePath)
            reject(data);
          }
        }, function (data) {
          fs.unlinkSync(filePath)
          reject(data);
        })
      }
    });
  }

  // 过滤出BU=1且不在学科列表里的课程subjectCode
  filterOneToOneBU = (data) => {
    const codeList = [];
    data.filter(item => item.subjectCode).map(it => codeList.push(it.subjectCode));
    return codeList;
  }

  aiCourse = () => {
    const { unPassObj, firstSimulateLesson } = this.state;
    return (
      <div className="card-item-wraper">
        <div className="card-item lesson-debug">
          <div className="card-wraper">
            <div className="card-title card-title-debug" style={{marginTop: '18px'}}>自助调试课</div>
            {
              firstSimulateLesson
                ? <div className="pre-aicourse">为了保证你的上课体验，建议先进行上【自助调试课】，测试上课设备正常后再上课，整个过程只需5分钟左右</div>
                : (
                  <div className="ai-result">
                    <p>不通过</p>
                    <div className="reasons">
                      <div className="question">{unPassObj.questionDesc || '----'}</div>
                      <div className="advise">{unPassObj.unPassedMessage || '----'}</div>
                    </div>
                  </div>
                )
            }
            <button
              className="attend-class"
              onClick={() => {
                clickVoice();
                let dataBuryId = 'ai_kid_fail_entry';
                let description = ['首页', '自助调试_少儿不通过后的入口'];
                if (firstSimulateLesson) {
                  dataBuryId = 'ai_kid_10min_entry';
                  description = ['首页', '自助调试_少儿小于10分钟提醒入口'];
                }
                this.openSimulateLesson(dataBuryId, description);
              }}
            >
              立即上课
            </button>
          </div>
        </div>
      </div>
    );
  };

  makeLearningTask = (homeWorkCards, pretestCenterVo) => {
    const { studiedData } = this.props;
    const { unlesson } = this.state;
    return unlesson ? (
      <div className="card-item-wraper">
        <div className="card-item task-card">
          <div className="card-wraper">
            <div className="card-title" style={{marginTop: '18px'}}>练一练</div>
            <div className="card-content">
              {
                homeWorkCards.map((item, index) => {
                  if (index > 2) {
                    return null;
                  }
                  return (
                    <div className="card-content-item" key={index}>
                      <span>{item.name}</span>
                      {parseInt(item.type) === 3 ? <KidButton type="normal" handleClick={() => this.gotoTest(item)}>去测评</KidButton>
                        : <KidButton type="normal" handleClick={() => this.doHomeWork(item)}>做练习</KidButton>}
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    ) : (
        <div className="card-item-wraper">
          <div className="card-item learning-card">
            <div className="card-wraper">
              <div className="card-title card-title-study" style={{marginTop: '18px'}}>入学测评</div>
              <img src={home_img_ceping} className="ceping" />
              {/* <p className="ceping">{!studiedData.hasDoLearn ? '快来测测宝宝的学习能力吧' : '报告已经出来啦，快来看看吧'}</p> */}
              <KidButton handleClick={() => this.toStudyTest(pretestCenterVo)}>开始测评</KidButton>
            </div>
          </div>
        </div>
      );
  };

  // 学习卡片详情
  handleCardDetails = (item) => {
    localStorage.removeItem('cardData');
    if (!item.lessonDetailUrl) return;
    const { dispatch } = this.props;
    localStorage.setItem('cardSource', 'pcIndex');
    localStorage.setItem('teacherUrl', item.lessonDetailUrl);
    localStorage.setItem('cardData', JSON.stringify(item));
    H5SendEvent({eventId: 'home_card', eventParam: {lessonUid: item.lessonUid}})
    dispatch(routerRedux.push({
      pathname: '/kid/kidcarddetails',
      state: {
        from: '/kid'
      }
    }))
  }

  lookTeacherDetails = (e, item) => {
    console.log('item', e)
    e.stopPropagation();
    if (!item.teacherIntroductionUrl) return;
    this.setState({ showTeacDetails: true, techerInfoUrl: item.teacherIntroductionUrl });
  }

  visibleTeacDetails = () => {
    this.setState({ showTeacDetails: false })
  }

  makeUnstartedLesson = (courseCards) => {
    const { subjectPadConfigList = [] } = this.props.allLessonList;
    const { belateId, currentDate } = this.state;
    const purchasedLesson = courseCards.length > 0 ? courseCards.map((item, index) => {
      return (
        <div className="card-item-wraper" key={index} style={{ animationDelay: `${index}s` }} onClick={() => this.handleCardDetails(item)}>
          <div className={`card-item lesson-${this.filterOneToOneBU(subjectPadConfigList).includes(item.courseCode) ? item.courseCode.toLowerCase() : 'other-card'}`}>
            <div className="card-wraper">
              <div className="course-state">
                <KidCountDown
                  belateId={belateId}
                  lesson={item}
                  lessonStartTime={item.lessonStartTime}
                  nowTimestamp={item.nowTimestamp}
                  isFromPage="kidHomePage"
                  enterClass={() => {
                    this.getLessonForClass(item, index);
                    //  this.enterClass(this, item, index)
                  }}
                  previewCourseWare={() => this.previewCourseWare(this, item)}
                  showDialog={() => {
                    this.showToast(item);
                  }}
                />
              </div>
              <div className={`card-title card-title-${item.courseName.toLowerCase()}`}>{item.courseName}</div>
              <div className={`teacher-name ${item.teacherIntroductionUrl ? 'hover-hand' : ''}`} onClick={(e) => this.lookTeacherDetails(e, item)}>
                <img className="teacher-pic" src={item.teacherAvatar || teacherdefault} alt="" />
                {item.courseTeacher}
              </div>
              <div className="lesson-info">
                <p className="time">{`${dayjs(item.lessonEndTime).year()}.${dayjs(item.lessonEndTime).month() + 1}.${dayjs(item.lessonEndTime).date()} ${((dayjs(item.lessonStartTime).year() === currentDate.year) && (dayjs(item.lessonStartTime).month() + 1 === currentDate.month) && (currentDate.date === dayjs(item.lessonStartTime).date())) ? '今天' : `周${WEEKARRAY[dayjs(item.lessonStartTime).day()]}`} `}</p>
                <p className="detail-time">{`${dayjs(item.lessonStartTime).format('HH:mm')}-${dayjs(item.lessonEndTime).format('HH:mm')}`}</p>
                {!!item.coursePointsStr && <p className="knowledge" style={{ whiteSpace: 'normal', display: ' -webkit-box', textOverflow: 'ellipsis', lineHeight: '22px', overflow: 'hidden', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical' }}>{item.coursePointsStr}</p>}
                {item.courseType === 1 && <span className="course-ceping">测评课</span>}
              </div>
            </div>
          </div>
        </div>
      );
    }) : (
        <div className="card-item-wraper" style={{ animationDelay: `${1}s` }}>
          {' '}
          <div className="card-item lesson-lack-time">
            <div className="card-wraper">
              <img src={home_img_wait} />
              <p>你目前还没有待上课程哦， 赶快联系班主任安排吧~</p>
            </div>
          </div>
        </div>
      );
    return purchasedLesson;
  };

  makeLackLessonTime = () => {
    return (
      <div className="card-item-wraper">
        <div className="card-item lesson-lack-time">
          <div className="card-wraper">
            <img src={home_img_time} />
            <p>您的课时所剩不多， 请联系班主任进行续费</p>
          </div>
        </div>
      </div>
    );
  };

  makeNoLesson = () => {
    return (
      <div className="card-item-wraper">
        <div className="card-item lesson-unlesson">
          <div className="card-wraper">
            <img src={home_img_wait} className="wait" />
            <p className="unlesson">你目前还没有待上课程哦， 赶快联系班主任安排吧~</p>

          </div>
        </div>
      </div>
    );
  };

  makeUnPurNoLesson = () => {
    const { zhangmenKidsUrl = `${Config.zhangmenKidsUrl}` } = this.props.allLessonList;
    return Array(2).fill('').map((item, index) => {
      return (
        <div className="card-item-wraper" key={index}>
          <div className={`card-item lesson-${index === 0 ? 'unlesson' : 'coursed'}`}>
            <div className="card-wraper">
              {index === 0 ? <img src={home_img_welcome} className="wait" /> : <img src={home_img_receive} className="wait" />}
              <p className="unlesson">{index === 0 ? '欢迎来到掌门少儿~' : '你有一节免费课程待领取'}</p>
              <KidButton handleClick={() => this.handleClick(index, zhangmenKidsUrl)}>{index === 0 ? '了解掌门少儿' : '立即领取'}</KidButton>
            </div>
          </div>
        </div>
      );
    });
  };

  makeStudyCeping = (pretestCenterVo) => {
    const { studiedData } = this.props;
    return (
      <div className="card-item-wraper">
        <div className="card-item lesson-ceping">
          <div className="card-wraper">
            <div className="card-title card-title-ceping" style={{marginTop: '18px'}}>入学测评</div>
            <img src={home_img_ceping} className="ceping" />
            {/* <p className="ceping">{!studiedData.hasDoLearn ? '快来测测宝宝的学习能力吧' : '报告已经出来啦，快来看看吧'}</p> */}
            <p className="ceping"></p>
            {/* <KidButton handleClick={() => this.toStudyTest(studiedData)}>{!studiedData.hasDoLearn ? '开始测评' : '查看测评报告'}</KidButton> */}
            <KidButton handleClick={() => this.toStudyTest(pretestCenterVo)}>入学测评</KidButton>
          </div>
        </div>
      </div>
    );
  };

  makeSomeLessonList = (paid, someLessonList) => {
    const { subjectPadConfigList = [] } = this.props.allLessonList;
    const { currentDate } = this.state;
    const navIndex = localStorage.getItem('NavIndex') - 0;
    return someLessonList.length > 0 ? someLessonList.map((item, index) => {
      return (
        <div className="card-item-wraper" key={index} style={{ animationDelay: `${index}s` }} onClick={() => this.handleCardDetails(item)}>
          <div className={`card-item lesson-${this.filterOneToOneBU(subjectPadConfigList).includes(item.courseCode) ? item.courseCode.toLowerCase() : 'other-card'}`}>
            <div className="card-wraper">
              <div className="course-state">
                <KidCountDown
                  lesson={item}
                  lessonStartTime={item.lessonStartTime}
                  nowTimestamp={item.nowTimestamp}
                  isFromPage="kidHomePage"
                  enterClass={() => {
                    this.getLessonForClass(item, index);
                  }}
                  previewCourseWare={() => this.previewCourseWare(this, item)}
                  showDialog={() => {
                    this.showToast(item);
                  }}
                />
              </div>
              <div className={`card-title card-title-${item.courseCode.toLowerCase()}`}>{item.courseName}</div>
              <div className={`teacher-name ${item.teacherIntroductionUrl ? 'hover-hand' : ''}`} onClick={(e) => this.lookTeacherDetails(e, item)}>
                <img className="teacher-pic" src={item.teacherAvatar || teacherdefault} alt="" />
                {item.courseTeacher}
              </div>
              <div className="lesson-info">
                <p className="time">{`${dayjs(item.lessonEndTime).year()}.${dayjs(item.lessonEndTime).month() + 1}.${dayjs(item.lessonEndTime).date()} ${((dayjs(item.lessonStartTime).year() === currentDate.year) && (dayjs(item.lessonStartTime).month() + 1 === currentDate.month) && (currentDate.date === dayjs(item.lessonStartTime).date())) ? '今天' : `周${WEEKARRAY[dayjs(item.lessonStartTime).day()]}`} `}</p>
                <p className="detail-time">{`${dayjs(item.lessonStartTime).format('HH:mm')}-${dayjs(item.lessonEndTime).format('HH:mm')}`}</p>
                {!!item.coursePointsStr && <p className="knowledge">{item.coursePointsStr}</p>}
                {item.courseType === 1 && <span className="course-ceping">测评课</span>}
              </div>
            </div>
          </div>
        </div>
      );
    }) : paid ? Array(2).fill('').map((item, index) => {
      return (
        <div className="card-item-wraper" key={index} style={{ animationDelay: `${index}s` }}>
          <div className="card-item lesson-lack-time">
            <div className="card-wraper">
              {index === 0 ? <img src={home_img_tixi} /> : <img src={home_img_wait} />}
              <p>{index === 0 ? '提升孩子9大思维能力' : '你目前还没有待上课程哦， 赶快联系班主任安排吧~'}</p>
              {index === 0 && (
                <KidButton handleClick={() => {
                  this.props.dispatch(routerRedux.push({
                    pathname: 'kid/kidKnows',
                    state: {
                      type: 'courseSys',
                      subject: subjectPadConfigList[navIndex],

                    },
                  }));
                }}
                >
                  查看课程体系
              </KidButton>
              )}
            </div>
          </div>
        </div>
      );
    }) : (
          <div className="card-item-wraper">
            <div className="card-item lesson-lack-time">
              <div className="card-wraper">
                <img src={home_img_tixi} />
                <p>提升孩子9大思维能力</p>
                <KidButton handleClick={() => {
                  this.props.dispatch(routerRedux.push({
                    pathname: 'kid/kidKnows',
                    state: {
                      type: 'courseSys',
                      subject: subjectPadConfigList[navIndex],

                    },
                  }));
                }}
                >
                  查看课程体系
            </KidButton>
              </div>
            </div>
          </div>
        );
  };

  render() {
    const {
      scrolledLeft,
      showScrollLeftBtn,
      showScrollRightBtn,
      showTestOrFailResult,
      isSupportAICourse,
      messagecontent,
      messagetype,
      isForceSimulateLesson,
      showModal,
      needSimulate,
      checkwebgl,
      updateInfo,
      closeEntry,
      showTeacDetails,
      techerInfoUrl
    } = this.state;
    const navIndex = localStorage.getItem('NavIndex') - 0;
    const {
      subjectPadConfigList = [],
      avatar = '',
      courseCards = [],
      paid = false,
      homeWorkCards = [],
      courseWarn = false,
      name = '',
      pretestCenterVo = {}, // 入学测评
    } = this.props.allLessonList;
    const {
      someLessonList = [], networkspeed, totalMessage, dispatch, partnerInfo, manifestData, festivalData, entryConfig,
      festivalBg: { homeIcon = {}, home = {} }
    } = this.props;
    const { matches, ...festivalInfo } = festivalData;
    const { courseSchedule, finishedCourse, exerciseCenter } = homeIcon;
    const { homeTabBackground, homeBackground } = home;
    const extStyle = prame => ({ style: { backgroundImage: prame && `url(${prame})` } });
    const userInfo = AppLocalStorage.getUserInfo();
    const defaultAvatar = {
      backgroundImage: `url(${userInfo.sex == 0 ? avatar_girl : avatar_boy})`
    }
    return (
      <div className="kidHome" {...extStyle(homeBackground)}>
        {
          (needSimulate || isForceSimulateLesson && isSupportAICourse)
          && (
            <div className="forceenter-simulate-lesson">
              <div ref={x => this.svgaDiv = x} className="svga-img" />
              <div className="content">
                <h1 className="title">欢迎来到掌门少儿“自助调试课”<p className="red-bg"/></h1>
                <p>为了保证宝贝上课流畅，先上一节“自助调试课”吧~</p>
                <button className="lesson-btn" onClick={() => this.openSimulateLesson()}>开始上课</button>
              </div>
            </div>
          )
        }

        {
          showModal && <KidAppointment switchModelStat={() => { this.setState({ showModal: !showModal }); }} />
        }
        {
          this.state.showToast && <KidMessage messagecontent={messagecontent} messagetype={messagetype} maskClick={() => { }} />
        }
        <div className="headerWrap">
          <header>
            <div className="user-info" onClick={() => { clickVoice(); dispatch(routerRedux.push('kid/personal')); }}>
              <div style={defaultAvatar} className="photo-box">
                <div className="pic-img-box">
                  <img src={avatar} alt="" />
                </div>
              </div>
              <div className="user-name">{name}</div>
            </div>
            <div className="navs">
              <nav>
                <span className={`${networkspeed < 80 ? 'you' : networkspeed >= 80 && networkspeed < 150 ? 'yiban' : networkspeed >= 150 && networkspeed < 300 ? 'cha' : 'wu'}`} />
                <i className="network">
                  {
                    networkspeed < 80 ? '网络优' : networkspeed >= 80 && networkspeed < 150 ? '网络一般' : networkspeed >= 150 && networkspeed < 300 ? '网络差' : '无网络'
                  }
                </i>
              </nav>
              {!isSupportAICourse && (
                <nav onClick={() => this.handleDevice()}>
                  <span />
                  <i className="device">设备检测</i>
                </nav>
              )}
              {isSupportAICourse && (
                <nav onClick={() => this.openSimulateLesson('ai_kid_active_entry', ['首页', '自助调试_少儿常驻入口'])}>
                  <span />
                  <i className="device">自助调试课</i>
                </nav>
              )}
              <nav onClick={() => { clickVoice(); dispatch(routerRedux.push('/kid/message')); }}>
                <span />
                <i className="message">消息中心</i>
                {' '}
                {!!totalMessage && <i className={`total ${totalMessage > 9 && 'large'}`}>{totalMessage > 99 ? '99+' : totalMessage > 0 ? totalMessage : ''}</i>}
              </nav>
              <nav onClick={() => { clickVoice(); dispatch(routerRedux.push('/kid/settings')); }}>
                <span />
                <i className="setting">设置</i>
              </nav>
              <nav onClick={() => { clickVoice(() => { location.reload(true); }); }}>
                <span />
                <i className="refesh">刷新</i>
              </nav>
            </div>
          </header>
        </div>
        <div className="navTabwraper">
          <KidNavTab selectBg={homeTabBackground} items={subjectPadConfigList || []} selectedIndex={navIndex} handleSelect={(item, navIndex) => this.handleSelect(item, navIndex)} />
        </div>
        <div className="containerWrap">
          <div className="out-scroll-wrapper" ref="scroll_view">
            <div className="card-content-wrapper" ref="card_content" style={{ transform: `translateX(${scrolledLeft}px)` }}>
              {
                // 自助调试课
                showTestOrFailResult && isSupportAICourse && this.aiCourse()
              }
              {
                // 全部标签/学习任务卡
                navIndex === 0 && homeWorkCards.length > 0 && this.makeLearningTask(homeWorkCards, pretestCenterVo)
              }
              {
                // 已购买有课
                navIndex === 0 && paid && courseCards.length > 0 && this.makeUnstartedLesson(courseCards)
              }
              {
                // 已购买无课 全部标签 显示学历测评
                paid && courseCards.length === 0 && this.makeStudyCeping(pretestCenterVo)
              }
              {
                // 已购买无课
                navIndex === 0 && paid && courseCards.length === 0 && this.makeNoLesson()
              }
              {
                // 未购买有课
                navIndex === 0 && !paid && courseCards.length > 0 && this.makeUnstartedLesson(courseCards)
              }
              {
                // 未购买有课 全部标签 显示学历测评
                navIndex === 0 && !paid && courseCards.length === 0 && this.makeStudyCeping(pretestCenterVo)
              }
              {
                // 未购买无课
                navIndex === 0 && !paid && courseCards.length === 0 && this.makeUnPurNoLesson()
              }
              {
                // 已购买无课时
                navIndex === 0 && paid && courseWarn && this.makeLackLessonTime()
              }
              {
                navIndex !== 0 && this.makeSomeLessonList(paid, someLessonList)
              }
            </div>
          </div>

          {
            showScrollLeftBtn && <span className="left-button" onClick={this.scrollLeft} />
          }
          {
            showScrollRightBtn && <span className="right-button" onClick={this.scrollRight} />
          }
          {/* 萤火虫动画 */}

        </div>
        <footer>
          <div className="footer-left">
            <div
              {...extStyle(courseSchedule)}
              className="course my-course" onClick={this.findCourseTime}>
              <span>我的课表</span>
            </div>
            <div
              {...extStyle(finishedCourse)}
              className="course history-courses" onClick={this.gotoHistory}>
              <span>历史课程</span>
            </div>
            <div
              {...extStyle(exerciseCenter)}
              className="course study-center" onClick={this.gotoDrivingCenter}>
              <span>练习中心</span>
            </div>
          </div>
          <div className="footer-right">
            {/* 学伴 */}
            {/* <div onClick={this.handlePartner}>
              {Object.keys(partnerInfo).length > 0 && <FriendsAnimate partnerInfo={partnerInfo} showFriute={this.state.showFriute} fruite={this.state.fruite} />}
              <audio src={soundList[partnerInfo.partnerId]} ref={ele => this.friendsAudio = ele} />
            </div> */}
            {/* 学习乐园 */}
            {entryConfig.canOpen&&!(needSimulate || isForceSimulateLesson && isSupportAICourse)&&<StudyParkEntryAnimate cartoonList={entryConfig.cartoonList} onClick={this.handleStudylandEntry}/>}
            {entryConfig.canOpen&&!(needSimulate || isForceSimulateLesson && isSupportAICourse)&&!closeEntry&&<div className="entryWrapper">
              <Studyland onClose={this.onGuideClose}/>
            </div>}
          </div>
        </footer>
        {
          !courseSchedule && (
            <>
              <div className="fireA">
                <img src={home_svga_fireworm} />
              </div>
              <div className="fireB">
                <img src={home_svga_fireworm} />
              </div>
              <div className="fireC">
                <img src={home_svga_fireworm} />
              </div>
            </>
          )
        }
        {checkwebgl && !isWeb() && <CheckWebgl updateInfo={updateInfo} visible={checkwebgl} onClose={() => { this.setState({ checkwebgl: false }); }} />}
        {matches && <TchFestival {...festivalInfo} />}
        {
          !checkwebgl && <DownloadZmgFileTip />
        }
        {<TeacherDetails visible={showTeacDetails} url={techerInfoUrl} setVisible={this.visibleTeacDetails} />}
      </div>
    );
  }
}

const mapStateToProps = ({ kidHomePage: { allLessonList, someLessonList, networkspeed, totalMessage, studiedData, simulateStatus, subjectCode, NavIndex, partnerInfo, manifestData, festivalData, entryConfig, festivalBg } }) => { // 见名知意，把state转换为props
  // 可以打印state看看数据结构，然后放到data里
  // console.log('loading======>', loading)
  return { allLessonList, someLessonList, networkspeed, totalMessage, studiedData, simulateStatus, subjectCode, NavIndex, partnerInfo, manifestData, festivalData, entryConfig, festivalBg };
};

export default connect(mapStateToProps)(KidHomePage);

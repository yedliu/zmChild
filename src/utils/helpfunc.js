import { AppLocalStorage } from 'utils/localStorage';
import { Config } from 'utils/config';
import { getClientVersion } from './nativebridge';
import { isWeb } from 'zmNativeBridge';

export function isWin() {
  return (navigator.platform == 'Win32') || (navigator.platform == 'Windows');
}

// 获取时间的时分秒对象
/**
 * @param {*} time // 参数为时间的毫秒数
 */
export const costTimeObj = (time = 0) => {
  const timeobj = {
    h: Math.floor(time / (60 * 60 * 1000)),
    m: Math.floor(time / 60000) % 60,
    s: Math.floor(time / 1000) % 60,
  };
  return timeobj;
};

// 数组降维只能适用一维数组
export function reduceDimension(arr) {
  return Array.prototype.concat.apply([], arr);
}
export function throttle(func, waitTime) {
  let context; let args; let previous = 0;
  return function () {
    const now = +new Date(); context = this; args = arguments;
    if (now - previous > waitTime) {
      func.apply(context, args);
      previous = now;
    }
  };
}
export function debounce(fn, wait) {
  let timer = null;
  return function () {
    const context = this;
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
}

// 点击事件添加声音
export function clickVoice(callback) {
  const audio = document.querySelector('#audio_click');
  if (callback) {
    audio.onended = callback;
  }
  if (audio && audio.paused) {
    audio.play();
  }
}

// 获取操作系统版本
export const detectOS = () => {
  const osKey = 'os';
  const versionKey = 'os_version';
  const os = {
    [osKey]: 'unKnown', // 系统
    [versionKey]: '', // 版本
  };
  if (!navigator) return os;
  const sUserAgent = navigator.userAgent;
  if (!sUserAgent) return os;
  const isWin = (navigator.platform == 'Win32') || (navigator.platform == 'Windows');
  const isMac = (navigator.platform == 'Mac68K') || (navigator.platform == 'MacPPC') || (navigator.platform == 'Macintosh') || (navigator.platform == 'MacIntel');
  if (isMac) os[osKey] = 'mac';
  const isUnix = (navigator.platform == 'X11') && !isWin && !isMac;
  if (isUnix) os[osKey] = 'unix';
  const isLinux = (String(navigator.platform).indexOf('Linux') > -1);
  if (isLinux) os[osKey] = 'linux';
  if (isWin) {
    os[osKey] = 'windows';
    const isWin2K = sUserAgent.indexOf('Windows NT 5.0') > -1 || sUserAgent.indexOf('Windows 2000') > -1;
    if (isWin2K) os[versionKey] = '2000';
    const isWinXP = sUserAgent.indexOf('Windows NT 5.1') > -1 || sUserAgent.indexOf('Windows XP') > -1;
    if (isWinXP) os[versionKey] = 'XP';
    const isWin2003 = sUserAgent.indexOf('Windows NT 5.2') > -1 || sUserAgent.indexOf('Windows 2003') > -1;
    if (isWin2003) os[versionKey] = '2003';
    const isWinVista = sUserAgent.indexOf('Windows NT 6.0') > -1 || sUserAgent.indexOf('Windows Vista') > -1;
    if (isWinVista) os[versionKey] = 'Vista';
    const isWin7 = sUserAgent.indexOf('Windows NT 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1;
    if (isWin7) os[versionKey] = '7';
    const isWin10 = sUserAgent.indexOf('Windows NT 10') > -1 || sUserAgent.indexOf('Windows 10') > -1;
    if (isWin10) os[versionKey] = '10';
  }
  return os;
};

// 获得session信息
export const obtainSessionInfo = () => {
  const os = detectOS(); // 系统版本
  const session_time_start = localStorage.getItem('loginTimestamp'); // session记录生成时间
  const duration_time = session_time_start
    ? (new Date().getTime() - session_time_start) / 1000
    : 0; // session时长
  const screen_width = window.screen.width;
  const screen_height = window.screen.height;
  const app_id = 'pc_client';
  const version = getClientVersion();// 客户端版本号
  const userInfo = AppLocalStorage.getUserInfo() || {};
  const platform = `pc${userInfo.role}`;
  const user_id = `${userInfo.userId}`;
  const tracker_type = 1; // 设备信息
  const os_language = navigator.language;
  return {
    user_id,
    session_id: localStorage.getItem('refreshToken'), // 为了保证每次会话只有一个sessionid 用refreshtoken（accessToken两个小时过期）
    session_time_start,
    duration_time,
    os: os.os,
    os_version: os.os_version,
    os_language,
    screen_width,
    screen_height,
    app_id,
    version,
    platform,
    tracker_type,
  };
};


// 上传session信息
export const uploadSession = () => {
  try {
    // 发送埋点session
    const sessionInfo = obtainSessionInfo();
    const url = `${Config.apiurl}/api/utility/getClientIP?access_token=${AppLocalStorage.getTocken().accessToken}`;
    fetch(url, {
      method: 'GET',
    }).then(res => res.json()).then((data) => {
      if (data.code == '0') {
        sessionInfo.network_ip = data.data;
        uploadServe(sessionInfo, 'api/pcSession');
      }
    }).catch((error) => {
      console.log('获取ip出错', error);
      sessionInfo.network_ip = '';
      uploadServe(sessionInfo, 'api/pcSession');
    });
    // 发送埋点数据
    window.uploadServer && window.uploadServer();
  } catch (e) {
    console.log('发送session出错', e);
  }
  // 重置刷新标志 保证下次进来重置登陆时间
  localStorage.setItem('isRefresh', '');
  // 2018/10/9 退出清除token保证每次会话拿到不一样的token。 by wgt
  localStorage.setItem('refreshToken', '');
  localStorage.setItem('accessToken', '');
};

// 上传数据到服务器信息
export const uploadServe = (data, url) => {
  const isNotProd = window.location.host !== 'chat.zmlearn.com';
  const uploadPath = `//log${isNotProd ? '-test' : ''}.zmlearn.com/${url}`;
  const xhr = new XMLHttpRequest();
  xhr.timeout = 3000;
  xhr.open('POST', uploadPath, true);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.onreadystatechange = xhr.onload = xhr.ontimeout = xhr.onerror = xhr.upload.onprogress = function (event) {
    window.debugUpload && console.log(event);
  };
  xhr.send(JSON.stringify(data));
};
// bi埋点相关方法
export function getIP(resolve, reject) {
  return new Promise(((resolve, reject) => {
    const RTCPeerConnection = window.RTCPeerConnection
                            || window.webkitRTCPeerConnection
                            || window.mozRTCPeerConnection;
    let ip = '';
    if (RTCPeerConnection) {
      (function () {
        const rtc = new RTCPeerConnection({ iceServers: [] });
        if (1 || window.mozRTCPeerConnection) {
          rtc.createDataChannel('', { reliable: false });
        }

        rtc.onicecandidate = function (evt) {
          if (evt.candidate) grepSDP(`a=${evt.candidate.candidate}`);
        };
        rtc.createOffer((offerDesc) => {
          grepSDP(offerDesc.sdp);
          rtc.setLocalDescription(offerDesc);
        }, (e) => { console.warn('offer failed', e); });


        const addrs = Object.create(null);
        addrs['0.0.0.0'] = false;

        function updateDisplay(newAddr) {
          if (newAddr in addrs) return;
          addrs[newAddr] = true;
          const displayAddrs = Object.keys(addrs)
            .filter((k) => { return addrs[k]; });
          for (let i = 0; i < displayAddrs.length; i++) {
            if (displayAddrs[i].length > 16) {
              displayAddrs.splice(i, 1);
              i--;
            }
          }
          ip = displayAddrs[0];
          resolve(ip);
        }

        function grepSDP(sdp) {
          const hosts = [];
          sdp.split('\r\n').forEach((line, index, arr) => {
            if (~line.indexOf('a=candidate')) {
              var parts = line.split(' ');
              var addr = parts[4];
              const type = parts[7];
              if (type === 'host') updateDisplay(addr);
            } else if (~line.indexOf('c=')) {
              var parts = line.split(' ');
              var addr = parts[2];
              updateDisplay(addr);
            }
          });
        }
      }());
    }
  }));
}
export function initZmAcc(reset) {
  if (!reset && initZmAcc.inited) return;
  const userInfo = AppLocalStorage.getUserInfo() || {};
  const { pathname } = location;
  const makeSource = (role) => {
    if (pathname == '/react/lessonreportamend' && GetQueryString('client') == 'manager') {
      return '管理后台';
    }
    if (role == 'student') {
      return '学生端';
    }
    if (role == 'teacher') {
      return '老师端';
    }
    return '';
  };
  const platform = 'PC';
  const source = makeSource(userInfo.role);
  const user_id = userInfo.userId;
  const user_name = userInfo.name;
  const user_mobile = userInfo.mobile;
  const session_id = localStorage.getItem('refreshToken'); // 为了保证每次会话只有一个sessionid 用refreshtoken（accessToken两个小时过期）
  const version = getClientVersion();
  getIP().then((ip) => {
    const paramMap = {
      platform,
      source,
      user_id,
      user_name,
      user_mobile,
      session_id,
      version,
      network_ip: ip,
    };
    window.initZmClientAcc && window.initZmClientAcc(paramMap);
    initZmAcc.inited = platform && source && user_id && user_name && user_mobile;
  });
}
export function createDataBuryFunction(eventType = '点击事件') {
  let buryFunc = () => {};
  if (window.zmClientAcc) {
    buryFunc = (...args) => {
      window.zmClientAcc(eventType, ...args);
    };
  }
  return buryFunc;
}
//学习乐园本地化
export const DataPersistence = {
  fd: null,
  buffer: {},
  init() {
    if (isWeb()) {
      this.fd = -1;
      this.buffer = JSON.parse(localStorage.getItem('studypark-storage'))||{};
      return;
    }
    //读取文件
    const { remote } = window.require && window.require('electron') || {};
    if (!remote) {
      return;
    }
    const fs = this.fs = remote.require('fs');
    const path = this.path = remote.require('path');
    const filePath = `${window.process.resourcesPath}${path.sep}data-persistence.data`;
    let flag = 'r+'
    if(!fs.existsSync(filePath)){
      flag = 'w+';
    }
    try {
      const fd = this.fd = fs.openSync(filePath,flag);
      const buffer = fs.readFileSync(fd,'utf8') || null;
      this.buffer = {...this.buffer,...(JSON.parse(buffer)||{})};
    } catch (err) {
      console.log('data-persistence: open or read record file failed:',err);
    }
  },
  getItem(key) {
    if (!key) {
      return;
    }
    const buffer = this.buffer;
    return buffer[key] || '';
  },
  setItem(key,value) {
    if (!key) {
      return;
    }
    this.buffer[key] = value;
    if (isWeb()) {
      localStorage.setItem('studypark-storage',JSON.stringify(this.buffer));
      return;
    }
    try {
      this.fs.writeFileSync(this.fd,JSON.stringify(this.buffer));
    } catch (err) {
      console.log('data-persistance: setitem failed:',err);
    }
  },
  close() {
    const fd = this.fd;
    try {
      if (fd) {
        this.fs.closeSync(fd);
      }
    } catch (err) {
      console.log('data-persistance: close file failed:',err);
    }
  }
}

// 初始化H5 kibana埋点
export const initZMJSSDK = () => {
  window.ZM_JSSDK && window.ZM_JSSDK.setConfig({
    environment: process.env.BUILD_TYPE === 'test' ? 'fat' : process.env.BUILD_TYPE,
  });
  
  window.ZM_JSSDK && window.ZM_JSSDK.setDefaults({
    appId: 10748,
    appVersion: getClientVersion()
  });
}

// H5 kibana埋点埋点
/**
 * @param {[string]} eventId [事件id]
 * @param {[number]} eventType [事件类型, 0: 事件次数 / 1: 事件时长] 非必填
 * @param {[number]} eventValue [事件值] 非必填
 * @param {[object]} eventParam [埋点点参数]
 */
export const H5SendEvent = ({eventId, eventParam, eventValue, eventType}) => {
  const mergeParam = {
    userId: AppLocalStorage.getUserInfo().userId,
    ...eventParam
  }
  ZM_JSSDK && ZM_JSSDK.sendEvent({
    eventId,
    eventParam: mergeParam,
    eventValue,
    eventType
  });
}


export const mask = (cls) => {
  let targetNode = document.querySelector(`.${cls}`);
  let pos = targetNode.getBoundingClientRect();
  let canvas = document.getElementById("mask");
  let width = window.innerWidth;
  let height = window.innerHeight;;
  canvas.setAttribute("width", width);
  canvas.setAttribute("height",height);
  var ctx = canvas.getContext("2d"); 
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle ='rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, width, height);
  ctx.fill();
  ctx.fillStyle ='white';
  ctx.globalCompositeOperation="xor";
  ctx.fillRect(pos.left,pos.top,pos.width,pos.height);
  ctx.fill();
}
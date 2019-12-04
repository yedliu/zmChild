import { AppLocalStorage } from 'utils/localStorage';
import { isXpNative, windowNativeMethod as winNativeMethod } from 'zmNativeBridge';
import appInfo from './app';
import { Config } from './config';
import { uploadSession } from './helpfunc';

// 获取当前客户端打包类型 zmlearn aplus
export function getAppReleaseKind() {
  try {
    const { remote } = window.require('electron');
    return remote.getGlobal('releasekind');
  } catch (e) {
    return '';
  }
}

export function setNativeWindowStyle(kind) {
  try {
    const { remote } = window.require('electron');
    const currentWin = remote.getCurrentWindow();
    if (kind === 'kid') {
      currentWin.setSize(1000, 630);
    } else {
    }
  } catch (e) {

  }
}
export function setResizeWH(cb) {
  try {
    const { remote } = window.require('electron');
    const currentWin = remote.getCurrentWindow();
    currentWin.on('resize', () => {
      currentWin.setMinimumSize(1170, 660);
    });
  } catch (e) {

  }
}

export const appid = '0368433925644e9b83eeff9fff26b61e';
export const tencent_app_id = '1400029101';
export const tencent_app_type = '12108';

export function initPlugin() {
  try {
    if (isSupportNewClassRoomWin() && isWinSupportOneToMore()) {
      const { remote } = window.require('electron');
      setResizeWH();
      const windowManager = remote.require('electron-window-manager');
      const data = { mobile: AppLocalStorage.getMobile(), password: AppLocalStorage.getPassWord(), hosturl: Config.frameurl, userId: AppLocalStorage.getTocken().userId, token: AppLocalStorage.getTocken().accessToken };
      windowManager.bridge.emit('InitPlugin', data);
    } else if (isXpNative()) {
      const data = {
        mobile: AppLocalStorage.getMobile(),
        token: AppLocalStorage.getTocken().accessToken,
        hosturl: Config.apiurl,
        userName: AppLocalStorage.getUserName(),
        userId: AppLocalStorage.getTocken().userId,
      };
      winNativeMethod('InitModule', [JSON.stringify(data)]);
    } else {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('Initplugin', appid, tencent_app_id, tencent_app_type);
    }
    // 新的登录窗口逻辑
    if (isSupportNewLoginWin()) {
      makeHomePageCloseLogic();
    }
    // alert("hahah")
  } catch (e) {
    forceCloseNw();
    // console.log(e);
  }
}

/* 获取原生elctron 窗口对象 */
export const getWinManager = (name) => {
  try {
    const { remote } = window.require('electron');
    const windowManager = remote.require('electron-window-manager');
    return windowManager.get(name);
  } catch (e) {
    return '';
  }
};

// 主窗口新加逻辑
export function makeHomePageCloseLogic() {
  if (isSupportNewLoginWin()) {
    getWinManager('home').object.on('close', () => {
    });
  }
}

export function forceCloseNw() {
  try {
    if (window.nw && window.nw.App) {
      const win = window.nw.Window.get();
      win.removeAllListeners('close');
      win.on('close', () => {
        // 关闭时（和退出类似）发送session
        uploadSession();
        console.log('forceCloseNw  close');
        win.close(true);
        // }
      });
    }
  } catch (e) {

  }
}


// 得到客户端版本
appInfo.getClientVersion = getClientVersion;
export function getClientVersion() {
  try {
    if (window.nw && window.nw.App) return `xp${window.nw.App.manifest.version}`;

    const { remote } = window.require('electron');
    return remote.app.getVersion();
  } catch (e) {
    return '0.0.0';
    // console.log(e);
  }
}

// 判断是否是少儿客户端
export function isKidsClient() {
  try {
    const { remote } = window.require('electron');
    return remote.app.getName() === 'kids-client';
  } catch (e) {
    // console.log(e);
  }
}

export function getElectronVersion() {
  try {
    const { remote, ipcRenderer } = window.require('electron');
    return { isElectron: true, platform: window.process.platform, version: window.process.versions.electron };
  } catch (e) {
    return { isElectron: false };
    // console.log(e);
  }
}

export function isWinSupportOneToMore() {
  const apptype = getElectronVersion();
  return (apptype.isElectron && apptype.platform === 'win32' && apptype.version >= '1.6.11');
}

export function isMacSupportOneToMore() {
  const apptype = getElectronVersion();
  return (apptype.isElectron && apptype.platform === 'darwin' && apptype.version >= '1.7.0');
}

/** 是否支持新登录窗口程序 * */
export function isSupportNewLoginWin() {
  return getClientVersion() >= '2.0.82' && (isWinSupportOneToMore() || isMacSupportOneToMore());
}
export function isSupportNewClassRoomWin() {
  return getClientVersion() >= '2.0.6' && (isWinSupportOneToMore() || isMacSupportOneToMore());
}
/** 通用版进入课堂新页面** */
export function createNewClassRoomWin() {
  try {
    const { remote } = window.require('electron');
    const windowManager = remote.require('electron-window-manager');
    let newClassRoomWin = windowManager.get('classroom');
    if (!newClassRoomWin) {
      windowManager.eventEmitter.removeAllListeners('leaveclassroom');
      windowManager.eventEmitter.removeAllListeners('fresh-lesson-list'); // http://192.168.52.4
      newClassRoomWin = windowManager.createNew('classroom', '', `${Config.frameurl}/react/amazingclassroom`, false,
        { width: 1200, height: 960, minimizable: !(AppLocalStorage.getRole() === 'student'), maximizable: !(AppLocalStorage.getRole() === 'student'), resizable: !(AppLocalStorage.getRole() === 'student' && isWinSupportOneToMore()), backgroundColor: '#2e2c29' }); // ${Config.frameurl}
      windowManager.bridge.on('leaveclassroom', () => {
        console.log('leaveclassroom jhh');
        // newClassRoomWin = null;
        if (window.nativeProps)window.nativeProps.dispatch(setCommunicationTypeAction(''));
      });
      windowManager.bridge.on('fresh-lesson-list', () => {
        if (AppLocalStorage.getRole() === 'student') {
          if (window.nativeProps) {
            if (judgeSmallGradeClass()) {
              window.nativeProps.dispatch(getSmallLessonListAction());
            } else {
              // window.nativeProps.dispatch(getLessonListAction());
            }
          }
        } else if (window.nativeProps) {

        }
      });
      newClassRoomWin.open();
      newClassRoomWin.focus();
      newClassRoomWin.object.on('close', () => {
      });
      newClassRoomWin.onReady(true, (win) => {
        let timenow = performance.now();
        win.object.on('resize', () => {
          windowManager.bridge.emit('classroomresize', {});
        });
        win.object.on('close', () => {
          windowManager.bridge.emit('classroomclose', {});
        });
        win.object.on('move', () => {
          if (performance.now() - timenow > 100) {
            setTimeout(() => {
              windowManager.bridge.emit('classroommove', {});
            }, 100);
            timenow = performance.now();
          }

          // var throttled = throttle(() => windowManager.bridge.emit('classroommove', {}), 500);
          // throttled
        });
        win.object.on('minimize', () => {
          console.log('minimize minimize');
          windowManager.bridge.emit('classroomminimize', {});
        });
        win.object.on('maximize', () => {
          console.log('maximize maximize');
          windowManager.bridge.emit('classroommaximize', {});
        });
        win.object.on('enter-full-screen', () => {
          console.log('enter-full-screen');
          windowManager.bridge.emit('classroom-enter-full-screen', {});
        });
        win.object.on('restore', () => {
          console.log('restore');
          windowManager.bridge.emit('classroomrestore', {});
        });
        win.object.maximize();
      });
    }

    newClassRoomWin.open();
    newClassRoomWin.focus();
    newClassRoomWin.object.maximize();
  } catch (e) {

  }
}
export function setShareDataByName(name, data) {
  try {
    const { remote } = window.require('electron');
    const windowManager = remote.require('electron-window-manager');
    windowManager.sharedData.set(name, data);
  } catch (e) {

  }
}
export function oneToOneLesson(lessonStr) {
  try {
    const { ipcRenderer } = window.require('electron');
    // console.log('lessonStr',lessonStr);
    // alert(lessonStr);
    const letme = this;
    ipcRenderer.send('EnterOneToOneRoom', lessonStr);
    // moveVideoWin(currentPoi);
    ipcRenderer.removeAllListeners(['nativecallback']);
    ipcRenderer.on('nativecallback', (evt, data) => {
      const jdata = JSON.parse(data);
      // console.log('oneToOneLesson', 'nativecallback', jdata);
      if (jdata.MsgType === 'showClient') {
        // console.log('jdata,MsgType',jdata.MsgType);
        // console.log('showClient',this,letme);
        // this.props.dispatch(getLessonListAction());
        // this.props.dispatch(getLessonListTAction());

        // this.props.dispatch(closeOrOpenLessonModal(false));

        // console.log('nativecallback', jdata.data);

        // setTimeout()
        // makeTeacherVideoLayout();
      } else if (jdata.MsgType === 'autolesson') {
        localStorage.setItem('autolesson', jdata.lessonUid);
        // this.props.dispatch(getLessonListAction());
        // this.props.dispatch(getLessonListTAction());
        // /window.location.reload();
      } else if (jdata.MsgType === 'autoEnterRoom') {
        // this.props.dispatch(getLessonListAction());
        // this.props.dispatch(getLessonListTAction());
        // window.location.reload();
      }
    });
    // moveVideoWin(currentPoi);
  } catch (e) {
    // console.log(e);
  }
}
export function isMacPlatform() {
  const apptype = getElectronVersion();
  return (apptype.isElectron && apptype.platform === 'darwin');
}
export function isNwxp() {
  try {
    return window.nw && window.nw.App;
  } catch (e) {
    return false;
  }
}
export function blockWin(flag) {
  try {
    const { ipcRenderer } = window.require('electron');
    if (!isSupportNewClassRoomWin())ipcRenderer.send('close window', flag);
  } catch (e) {
    // console.log(e);
  }
}

// 窗口最小化
export function minHomeWin() {
  try {
    const { remote } = window.require('electron');
    remote.getCurrentWindow().minimize();
    // const windowManager = remote.require('electron-window-manager');
    // windowManager.get('home').object.minimize();
  } catch (e) {

  }
}

// 关闭窗口
export function closeApp() {
  try {
    const { remote } = window.require('electron');
    remote.app.quit();
  } catch (e) {
    // console.log(e);
  }
}

export function closeWinExceptHome() {
  try {
    const { remote } = window.require('electron');
    const windowManager = remote.require('electron-window-manager');
    windowManager.bridge.emit('fresh-lesson-list', {});
    windowManager.closeAllExcept('home');
  } catch (e) {
  }
}

let isLogOutClose = false;
export function openNewLoginWin() {
  window.onbeforeunload = null;
  isLogOutClose = true;
  mainProcessEmit('createLoginWin', {});
  winManagerMethod('home', 'close', []);
  windowNativeMethod('LogOut', ['']);
}

// 关闭主页
export function closeHome() {
  try {
    if (!isLogOutClose) windowNativeMethod('SendClose', []);
    const { remote } = window.require('electron');
    window.onbeforeunload = null;
    setTimeout(() => remote.app.quit(), 300);
    // getWinManager('home').object.destroy();
  } catch (e) {

  }
}


/** 原生windows操作* */
export const winManagerMethod = (name, method, params) => {
  try {
    const { remote } = window.require('electron');
    const windowManager = remote.require('electron-window-manager');
    windowManager.get(name)[method](...params);
  } catch (e) {

  }
};

/** 主线程emit* */
export const mainProcessEmit = (name, data) => {
  try {
    const { remote } = window.require('electron');
    const windowManager = remote.require('electron-window-manager');
    windowManager.bridge.emit(name, data);
  } catch (e) {

  }
};

export function windowNativeMethod(funcname, params) {
  try {
    const { remote } = window.require('electron');
    const windowManager = remote.require('electron-window-manager');
    windowManager.bridge.emit('nativemethodexec', { funcname, params });
  } catch (e) {

  }
}

// 获取Mac地址
export const getMacAddress = () => {
  let macAddress = 'web';
  try {
    const { remote } = window.require('electron');
    macAddress = remote.require('node-machine-id').machineIdSync();
  } catch (e) {
    macAddress = 'web';
  }
  // console.log(macAddress, 'macAddress ');
  return macAddress;
};

export function isSupportOneToOne() {
  return getClientVersion() >= '2.0.0';
}

import { getCookie } from './cookies';

export const AppLocalStorage = {
  getUserInfo: () => (localStorage.getItem('zm-chat-redux-userInfo') ? JSON.parse(localStorage.getItem('zm-chat-redux-userInfo')) : false),
  getIsLogin: () => (localStorage.getItem('zm-chat-redux-isLogin') ? JSON.parse(localStorage.getItem('zm-chat-redux-isLogin')) : false),
  getTocken: () => ((localStorage.getItem('zm-chat-redux-tocken') && localStorage.getItem('zm-chat-redux-tocken') !== 'null') ? JSON.parse(localStorage.getItem('zm-chat-redux-tocken')) : {}),
  setUserInfo: data => localStorage.setItem('zm-chat-redux-userInfo', JSON.stringify(data)),
  setIsLogin: data => localStorage.setItem('zm-chat-redux-isLogin', JSON.stringify(data)),
  setTocken: data => localStorage.setItem('zm-chat-redux-tocken', data ? JSON.stringify(data) : ''),
  setAccessTocken: data => localStorage.setItem('accessToken', data),
  setRefreshTocken: data => localStorage.setItem('refreshToken', data),
  removeTocken: () => localStorage.removeItem('zm-chat-redux-tocken'),
  removeUserInfo: () => localStorage.removeItem('zm-chat-redux-userInfo'),
  removeIsLogin: () => localStorage.removeItem('zm-chat-redux-isLogin'),
  getMobile: () => (AppLocalStorage.getUserInfo() ? AppLocalStorage.getUserInfo().mobile : ''),
  getPassWord: () => (AppLocalStorage.getUserInfo() ? AppLocalStorage.getUserInfo().password : ''),
  getUserName: () => (AppLocalStorage.getUserInfo() ? AppLocalStorage.getUserInfo().name : ''),
  getQQ: () => (AppLocalStorage.getUserInfo() ? AppLocalStorage.getUserInfo().qq : ''),
  getWeixin: () => (AppLocalStorage.getUserInfo() ? AppLocalStorage.getUserInfo().weixin : ''),
  getRole: () => (AppLocalStorage.getUserInfo() ? AppLocalStorage.getUserInfo().role : ''),
  getAppName: () => (getCookie('appName') || localStorage.getItem('appName')),
  setAppName: data => localStorage.setItem('appName', data),
  // 新项目少儿作业需要的token
  setOauthToken: data => localStorage.setItem('oauthToken', data),
  setAccessOauthToken: data => localStorage.setItem('oauthToken', data),
  setRefreshOauthToken: data => localStorage.setItem('refreshOauthTokenn', data),
  getOauthToken: () => (getCookie('oauthToken') || localStorage.getItem('oauthToken')),
  getCurrentLessonData: () => (localStorage.getItem('CURRENT_LESSON_DATA') ? JSON.parse(localStorage.getItem('CURRENT_LESSON_DATA')) : false),
  setZmlDocNavGradeId: id => localStorage.setItem('zm-chat-zml-doc-nav-gradeId', id),
  getZmlDocNavGradeId: () => localStorage.getItem('zm-chat-zml-doc-nav-gradeId'),
  setZmlDocNavEditionId: id => localStorage.setItem('zm-chat-zml-doc-nav-editionId', id),
  getZmlDocNavEditionId: () => localStorage.getItem('zm-chat-zml-doc-nav-editionId'),
  setZmlDocNavExpandId: id => localStorage.setItem('zm-chat-zml-doc-nav-expandId', id),
  getZmlDocNavExpandId: () => localStorage.getItem('zm-chat-zml-doc-nav-expandId'),
  setZmlDocNavSelectedId: id => localStorage.setItem('zm-chat-zml-doc-nav-selectedId', id),
  getZmlDocNavSelectedId: () => localStorage.getItem('zm-chat-zml-doc-nav-selectedId'),
  setZmlDocNavSelectedLevel: level => localStorage.setItem('zm-chat-zml-doc-nav-selectedLevel', level),
  getZmlDocNavSelectedLevel: () => localStorage.getItem('zm-chat-zml-doc-nav-selectedLevel'),
  getIsDeviceTested: () => localStorage.getItem('zm-chat-device-tested'),
  setDevicceTested: flag => localStorage.setItem('zm-chat-device-tested', flag),
  getLastRoles: () => (localStorage.getItem('user.lastRoles') ? JSON.parse(localStorage.getItem('user.lastRoles')) : {}),
  setLastRoles: roles => localStorage.setItem('user.lastRoles', JSON.stringify(roles)),
  setLastLoginRoleByMobile: (mobile, role) => {
    const roles = AppLocalStorage.getLastRoles();
    roles[mobile] = role;
    AppLocalStorage.setLastRoles(roles);
  },
  getLastLoginRoleByMobile: mobile => AppLocalStorage.getLastRoles()[mobile],
  setRoleList: roleList => localStorage.setItem('user.roleList', roleList),
  getRoleList: () => (localStorage.getItem('user.roleList') ? localStorage.getItem('user.roleList').split(';') : []),
  removePassWord: () => {
    if (AppLocalStorage.getUserInfo()) {
      const data = AppLocalStorage.getUserInfo();
      data.password = '';
      AppLocalStorage.setUserInfo(JSON.stringify(data));
    }
  },
  setSmallClassTestLessonData: lessondata => localStorage.setItem('smallClassTestLessonData', JSON.stringify(lessondata)),
  getSmallClassTestLessonData: () => (localStorage.getItem('smallClassTestLessonData') ? JSON.parse(localStorage.getItem('smallClassTestLessonData')) : {}),
  removeSmallClassTestLessonData: () => localStorage.removeItem('smallClassTestLessonData'),
  // 获取本地存储的内容
  getItem: (itemName) => {
    let item = localStorage.getItem(itemName);
    try {
      item = JSON.parse(item);
    } catch (err) {
      // err Msg
    }
    return item;
  },
  /**
     * argument[0]: String
     * argument[1]: String | Object
     * 将 argument[1]上的对象属性添加到argument[0]上(Object),或将argument[1]替换argument[1]
     */
  setItem: (...rest) => {
    if (typeof rest[1] === 'string') {
      localStorage.setItem(rest[0], rest[1]);
    } else if (typeof rest[1] === 'object' && !Array.isArray(rest[1])) {
      const item = AppLocalStorage.getItem(rest[0]);
      if (typeof item === 'object') { // 原本存储的为对象则进行属性的替换或添加
        // eslint-disable-next-line max-len
        AppLocalStorage.setItem(rest[0], JSON.stringify(Object.assign({}, (item || {}), rest[1])));
      } else if (typeof item === 'string') { // 本身存储的是字符串则替换为现存储的对象
        AppLocalStorage.setItem(rest[0], JSON.stringify(rest[1]));
      }
    }
  },
  setCoursewareStatus: status => localStorage.setItem('zm-chat-courseware-status', JSON.stringify(status)),
  getCoursewareStatus: () => JSON.parse(localStorage.getItem('zm-chat-courseware-status')),
  removeItem: (...rest) => {
    let item = localStorage.getItem(rest[0]);
    if (rest.length === 1) {
      // eslint-disable-next-line no-unused-expressions
      !item || localStorage.removeItem(rest[0]);
      item = `removeItem ${rest[0]} success`;
    } else if (rest.length === 2) {
      if (item && item[rest[1]]) {
        delete item[rest[1]];
        item = `remove ${rest[0]}. success`;
      }
      item = `don't find ${rest[0]}`;
    }
    return item;
  },
  set: (key, value) => {
    localStorage.setItem(key, value);
  },
  get: (key) => {
    localStorage.getItem(key);
  },
};

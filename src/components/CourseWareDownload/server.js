import { Config } from 'utils/config';
import { AppLocalStorage } from 'utils/localStorage';
import request, { posthwjsonwithtoken } from 'utils/request';

export const checkVersionAndPlatform = () => {
  try {
    const { remote } = window.require('electron');
    const RequestUrl = `${Config.apiurl}/kidsStuApi/courseware/checkVersionAndPlatform`;
    // const RequestUrl = `http://10.80.228.48:8080/kidsStuApi/courseware/checkVersionAndPlatform`;
    const appVersion = remote.app.getVersion();
    const param = {
      platform: window.process && window.process.platform,
      version: appVersion,
    };
    const rest = posthwjsonwithtoken();
    Object.assign(rest.headers, { 'Api-version': '1.0.0', platform: 'pc', 'App-Name': 'KidsPC', 'App-Version': '1.0.0' });
    return request(RequestUrl, Object.assign({}, rest, { body: JSON.stringify(param) }));
  } catch (e) {
    console.log(e);
    return Promise.reject(new Error('checkPlatformVersion-error'));
  }
};

export const fetchCourseWareListForLocal = () => {
  const RequestUrl = `${Config.apiurl}/gateway/zmc-courseware-kidroom/lessonCswareLocal/findPCSmallLessonCswareList`;
  const param = JSON.stringify({
    id: AppLocalStorage.getUserInfo().id,
    role: AppLocalStorage.getRole(),
  });
  return request(RequestUrl, Object.assign({}, posthwjsonwithtoken(), { body: param }));
};

export const storageParam = {
  getStorage() {
    return localStorage.getItem('downloadZmgTip') ? JSON.parse(localStorage.getItem('downloadZmgTip')) : [];
  },
  setStorage() {
    const key = AppLocalStorage.getUserInfo().id;
    const results = this.getStorage();
    const _index = results.indexOf(key);
    if (_index === -1) {
      results.push(key);
    } else {
      results.splice(_index, 1);
    }
    localStorage.setItem('downloadZmgTip', JSON.stringify(results));
  },
  existStorage() {
    const result = this.getStorage();
    return result.indexOf(AppLocalStorage.getUserInfo().id) >= 0;
  },
};
export const preLoadImg = (items) => {
  try {
    for (let i = 0; i < items.length; i++) {
      const pImg = new Image();
      pImg.src = items[i];
    }
  } catch (e) {
    console.log(e);
  }
};

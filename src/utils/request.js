import { until } from 'wait-promise';
import { isSupportNewLoginWin, openNewLoginWin } from './nativebridge';

import { AppLocalStorage } from './localStorage';
import { Config } from './config';

let isRefreshingTocken = false;

export default function request(url, options, getparam, str) {
  let getparamstr = '';
  if (str && Array.isArray(getparam)) {
    getparam.forEach((value) => {
      getparamstr += `&${str}=${value}`;
    });
  } else {
    getparamstr = getparam ? (`&${JsonToUrlParams(getparam)}`) : '';
  }
  const nowdate = new Date().getTime();
  const accOptions = Object.assign({}, options);
  if (accOptions.mobile) delete accOptions.mobile;
  if (accOptions.password) delete accOptions.password;
  const accData = {
    action: '',
    url,
    param: getparamstr,
    options: accOptions,
    timeout: 0,
    response: null,
  };
  // [TODO]
  // if (encryptionUrl.find((n) => n === url) && options.body) {
  //     options.body = encryption(options.body, 'json');
  // }
  return fetch(`${url}?access_token=${AppLocalStorage.getTocken().accessToken}${getparamstr}`, options)
    .then((response) => {
      accData.timeout = new Date().getTime() - nowdate;
      if (response.status >= 200 && response.status < 300) {
        // 请求超时1000mslog日志方法
        if (accData.timeout > 1000) {
          accData.action = 'fetch timeout';
          // window.__acc__ && window.__acc__(accData);
        }
        return response;
      }
      accData.action = 'fetch status error';
      // 请求异常log日志方法
      // window.__acc__ && window.__acc__(accData);
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    })
    .then(parseJSON)
    .then((res) => {
      // [TODO]
      // if (encryptionUrl.find((n) => n === url) && Number(res.code) === 0 && res.data) {
      //     const data = res.data || '';
      //     res.data = decryption(data);
      // }
      return res;
    })
    .then(res => checkTocken(res, url, options))
    .catch(error => {
      console.log('request error', error);
    })
}

function makeTocken(response) {
  if (response.code.toString() === '1') {
    isRefreshingTocken = false;
    const tockenData = AppLocalStorage.getTocken();
    const newData = Object.assign({}, tockenData, { accessToken: response.data.accessToken, refreshToken: response.data.refreshToken, oauthToken: response.data.oauthToken });
    // 更新LocalStorage里的所有Token
    AppLocalStorage.setAccessTocken(response.data.accessToken);
    AppLocalStorage.setRefreshTocken(response.data.refreshToken);
    AppLocalStorage.setOauthToken(response.data.oauthToken);
    const loginType = localStorage.getItem('loginType');
    const basicInfo = AppLocalStorage.getUserInfo();
    if (loginType === '2' || loginType === '3') {
      AppLocalStorage.setUserInfo({ ...basicInfo, password: response.data.accessToken });
    }
    return AppLocalStorage.setTocken(newData);
  } if (response.code.toString() === '0') {
    // 清除登录数据
    localStorage.removeItem('user.password');
    localStorage.removeItem('user.mobile');
    localStorage.removeItem('NavIndex');
    localStorage.removeItem('subjectCode');
    localStorage.removeItem('remember-login-password');
    localStorage.removeItem('loginType');
    AppLocalStorage.removeIsLogin();
    AppLocalStorage.removeUserInfo();
    AppLocalStorage.removeTocken();
    if (window.NativeLogin) {
      window.NativeLogin('logout');
    } else if (isSupportNewLoginWin()) {
      openNewLoginWin();
      return;
    }
    location.href = '/';
  }
  return '';
}

function refreshTocken() {
  const refreshUrl = `${Config.apiurl}/api/oauth/refreshToken`;
  return fetch(refreshUrl, Object.assign({}, options('POST', 'form', false, true), {
    body: JsonToUrlParams({
      refresh_token: AppLocalStorage.getTocken().refreshToken,
    }),
  }))
    .then(checkStatus)
    .then(parseJSON)
    .then(res => makeTocken(res));
}

function checkTocken(response, url, options) {
  if (response.code === '-1' || response.code === '10001') {
    let actionFn = new Promise(resolve => resolve());
    const newOptions = options;
    if (!isRefreshingTocken) {
      actionFn = refreshTocken().then(() => {
        newOptions.headers.accessToken = AppLocalStorage.getOauthToken();
      });
    }
    isRefreshingTocken = true;
    const promise = actionFn.then(() => until(() => !isRefreshingTocken)).then(() => {
      newOptions.headers.accessToken = AppLocalStorage.getOauthToken();
    });
    return promise.then(() => fetch(`${url}?access_token=${AppLocalStorage.getTocken().accessToken}`, newOptions)
      .then(checkStatus)
      .then(parseJSON));
  }
  return response;
}

function parseJSON(response) {
  return response.json();
}

function checkStatus(response, url) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  if (url && window.logDataWrite) {
    window.logDataWrite(`${url},error,st:${response.status},stText:${response.statusText}`, 'interface');
  }
  throw error;
}

/**
 * JOSN转Url参数
 *
 * @export
 * @param {*} data
 * @returns
 */
export function JsonToUrlParams(data) {
  return Object.keys(data).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&');
}


/**
 * str转JOSN
 *
 * @export
 * @param {*} str
 * @returns
 */
export function UrlParamsToJson(str) {
  return JSON.parse(`{"${decodeURI(str).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`);
}

const contentType = new Map()
  .set('json', 'application/json;charset=utf-8')
  .set('form', 'application/x-www-form-urlencoded;charset=utf-8;')
  .set('multipart', 'multipart/form-data;boundary=----WebKitFormBoundarykkrZ5yIY8cr0hdgE');

/**
 *
 * @param {*} method GET POST DELETE PUT
 * @param {*} type json form multipart
 * @param {*} withMobile boolean
 * @param {*} withToken boolean
 */
export const options = (method, type, withMobile, withToken, apiVersion = '2.0.0') => {
  const opt = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': contentType.get(type),
    },
  };
  if (withMobile) {
    opt.headers = Object.assign({}, opt.headers, {
      mobile: AppLocalStorage.getMobile(),
      password: AppLocalStorage.getPassWord(),
    });
  }
  if (withToken) {
    opt.headers = Object.assign({}, opt.headers, {
      accessToken: AppLocalStorage.getOauthToken(),
      'App-version': '1.4.0',
      'Api-Version': apiVersion || '2.0.0',
      'App-Name': AppLocalStorage.getAppName() || 'KidsPC',
      Platform: navigator.platform,
      'User-Agent': navigator.userAgent,
    });
  }
  return opt;
};

export const posthwjsonwithtoken = () => ({
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
    accessToken: AppLocalStorage.getOauthToken(),
  },
});

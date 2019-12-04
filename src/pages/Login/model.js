import { AppLocalStorage } from 'utils/localStorage';
import { getAppReleaseKind, setNativeWindowStyle } from 'utils/nativebridge';
import { kidGradeList } from 'utils/zm-config';
import JSEncrypt from 'utils/rsa';
import { routerRedux } from 'dva/router';
import { getRoleList, getPubKey, getUserInfo, getToken } from './service';

const RSA = new JSEncrypt();
let loginData = '';
export default {

  namespace: 'LoginModule',

  state: {
    errmessage: '',
    isloading: false,
    isLogin: false,
    loading: false,
  },

  subscriptions: {

  },

  effects: {
    * getRoleList({ payload }, { call, put }) {
      const { mobile, password } = payload;
      const lastRole = AppLocalStorage.getLastLoginRoleByMobile(mobile);
      yield put({
        type: 'beginLogin',
      });
      const { code, data, msg } = yield call(getRoleList, payload);
      if (code.toString() === '0') {
        let role;
        data.roleList = data.roleList.replace(/-/g, '');
        if (lastRole && data.roleList.split(';').indexOf(lastRole) + 1) {
          role = lastRole;
        } else if (data.lastLoginRole && data.roleList.split(';').indexOf(data.lastLoginRole) + 1) {
          role = data.lastLoginRole;
        } else {
          role = data.roleList.split(';').slice(-1)[0];
        }

        AppLocalStorage.setRoleList(data.roleList);
        if (getAppReleaseKind() !== 'aplus') {
          yield put({
            type: 'getPubKey',
            payload: {
              mobile,
              password,
            },
          });
        }

        yield put({
          type: 'getUserInfo',
          payload: {
            role,
            mobile,
            password,
          },
        });
      } else {
        if (window.NativeLogin) {
          window.NativeLogin('loginFail', msg ? msg[0] : '账号或密码错误!', 1);
        }
        yield put({
          type: 'loginFailure',
          payload: {
            msg: (msg && msg[0]) ? msg[0] : '登录失败',
          },
        });
      }
    },
    * getPubKey({ payload }, { call, put }) {
      const { mobile, password } = payload;
      const { code, data } = yield call(getPubKey);
      if (code.toString() === '0') {
        AppLocalStorage.publicKey = data;
        RSA.setPublicKey(AppLocalStorage.publicKey);
        loginData = { body: JSON.stringify({ msg: RSA.encrypt(JSON.stringify({ mobile, password, timestamp: `${+new Date()}` })) }) };
      }
    },
    * getUserInfo({ payload }, { call, put }) {
      const { mobile, password } = payload;
      const { code, data, msg } = yield call(getUserInfo, payload);
      if (code.toString() === '0') {
        yield put({
          type: 'getToken',
          payload: {
            params: loginData,
            reposInfo: data,
            reposCode: code,
            mobile,
            password,
            msg,
          },
        });
      } else {
        yield put({
          type: 'loginFailure',
          payload: {
            msg: (msg && msg[0]) ? msg[0] : '登录失败',
          },
        });
      }
    },
    * getToken({ payload }, { call, put }) {
      const { reposInfo, reposCode, mobile, msg, password } = payload;
      const { code, data } = yield call(getToken, payload);
      if (code.toString() === '1') {
        const loginFunc = () => {
          AppLocalStorage.setTocken(data);
          AppLocalStorage.setAccessTocken(AppLocalStorage.getTocken().accessToken);
          AppLocalStorage.setRefreshTocken(AppLocalStorage.getTocken().refreshToken);
          // oauthToken
          AppLocalStorage.setOauthToken(AppLocalStorage.getTocken().oauthToken);
          if (window.NativeLogin) window.NativeLogin('login', data.role);
        };

        if (reposCode.toString() === '0') {
          localStorage.setItem('loginTimestamp', new Date().getTime());
          AppLocalStorage.setLastLoginRoleByMobile(mobile, data.role.replace('-', ''));
          if (reposInfo.role === 'student') {
            loginFunc();
            AppLocalStorage.setIsLogin(true);
            reposInfo.mobile = mobile;
            reposInfo.password = password;
            AppLocalStorage.setUserInfo(reposInfo);
            AppLocalStorage.setAppName('KidsPC');
            yield put({
              type: 'loginSuccess',
            });

            if (reposInfo.stuGrade && kidGradeList.indexOf(reposInfo.stuGrade) >= 0 && !window.NativeLogin) {
              localStorage.setItem('isKidVersion', true);
              setNativeWindowStyle('kid');
              window.onbeforeunload = null;
              // location.href = "/kid";
              yield put(routerRedux.push('/kid'));
              window.RSA = null;
            } else {
              localStorage.removeItem('isKidVersion');
            }
          } else {
            yield put({
              type: 'otherLogin',
            });
          }
        }
      }
    },
  },

  reducers: {
    loginFailure(state, action) {
      return { ...state, errmessage: action.payload.msg, loading: false };
    },
    loginSuccess(state, action) {
      return { ...state, isLogin: true, loading: false };
    },
    beginLogin(state, action) {
      return { ...state, loading: true };
    },
    // 如果是非少儿账号，不让登录
    otherLogin(state, action) {
      return { ...state, loading: false, isLogin: false, errmessage: '此账号不是学生账号' };
    },
  },
};

import { AppLocalStorage } from 'utils/localStorage';
import { routerRedux } from 'dva/router';

const paths = [
  '/kid/learningAbility',
  '/kid/personalCenter/report',
  '/kid/studyability/report',
  '/kid/ability/test',
]

export default {

  namespace: 'GlobalState',

  state: {
    isLogin: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname == '/') {
          if (AppLocalStorage.getIsLogin()) {
            dispatch(routerRedux.push('/kid'));
          }
        } else if ((paths.includes(location.pathname)) && AppLocalStorage.getAppName() === 'KidsPad') {
          AppLocalStorage.setIsLogin(true);
          document.body.style.minWidth = '400px';
          document.body.style.minHeight = '400px';
        } else if (!AppLocalStorage.getIsLogin()) {
          dispatch(routerRedux.push('/'));
        }
      });
    },
  },

  effects: {

  },

  reducers: {

  },
};

import * as settingsServer from './service';

export default {

  namespace: 'kidSettingsModel',

  state: {
  },

  subscriptions: {

  },

  effects: {
    * getBasicInfoByRole({ payload }, { call }) {
      try {
        const repos = yield call(settingsServer.getBasicInfoByRole, payload);
        return repos;
      } catch (err) {
        console.log(err);
      }
    },
    * changePasswd({ payload }, { call }) {
      try {
        const repos = yield call(settingsServer.changePasswd, payload);
        return repos;
      } catch (err) {
        console.log(err);
      }
    },
  },

  reducers: {
  },
};

import * as profileCompleteServer from './service';

export default {

  namespace: 'profileCompleteModel',

  state: {
    gradeList: [],
  },

  subscriptions: {

  },

  effects: {
    * getGradeList({}, { call, put }) {
      try {
        const repos = yield call(profileCompleteServer.gradeSubject);
        const { code = '0', data = {} } = repos;
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setGradeList', payload: { data } });
            break;
          default:
            break;
        }
      } catch (err) {
        console.log(err);
      }
    },
    * modifyStudent({ payload }, { call }) {
      try {
        const repos = yield call(profileCompleteServer.modifyStudent, payload);
        return repos;
      } catch (err) {
        console.log(err);
      }
    },
    * getPersonalInfo({ payload }, { call, put }) {
      try {
        const repos = yield call(profileCompleteServer.getPersonalInfo, payload);
        const { code = '0', data = {}, message = '' } = repos;
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setUserInfo', payload: data });
            return data;
        }
        // console.log('repos====>', repos)
      } catch (err) {
        console.log(err);
      }
    },
  },

  reducers: {
    setGradeList(state, { payload: { data } }) {
      // console.log('reducers lessonList===>', lessonList);
      return {
        ...state,
        gradeList: data,
      };
    },
  },
};

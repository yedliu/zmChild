import { routerRedux } from 'dva/router';
import * as abilityReportService from './service';

export default {

  namespace: 'KidPadPersonalAbilityReportModel',

  state: {
    doneLearningAbilityTest: false,
    learningAbilityResult: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname == '/kid/personalCenter/report') {
          console.log(document.body);
        }
      });
    },
  },

  effects: {
    * getDoneLearningAbilityTest({ payload }, { call, put }) {
      try {
        const repos = yield call(abilityReportService.getDoneLearningAbilityTest, payload);
        const { code = '0', data = {}, message = '' } = repos;
        console.log(repos);
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setDoneLearningAbilityTest', payload: data.hasDoLearn || false });
        }
      } catch (err) {
        console.log(err);
      }
    },
    * getLearningAbilityResult({ payload }, { call, put }) {
      try {
        const repos = yield call(abilityReportService.getLearningAbilityResult, payload);
        const { code = '0', data = {}, message = '' } = repos;
        console.log(repos);
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setLearningAbilityResult', payload: data });
        }
      } catch (err) {
        console.log(err);
      }
    },
  },

  reducers: {
    setDoneLearningAbilityTest(state, { payload }) {
      return {
        ...state,
        doneLearningAbilityTest: payload,
      };
    },
    setLearningAbilityResult(state, { payload }) {
      return {
        ...state,
        learningAbilityResult: payload,
      };
    },
  },
};

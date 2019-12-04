import * as abilityReportService from './service';

export default {

  namespace: 'KidAbilityReportModel',

  state: {
    doneLearningAbilityTest: false,
    learningAbilityResult: [],
  },

  subscriptions: {},

  effects: {
    * getDoneLearningAbilityTest({ payload }, { call, put }) {
      try {
        const repos = yield call(abilityReportService.getDoneLearningAbilityTest, payload);
        const { code = '0', data = {}, message = '' } = repos;
        console.log(repos);
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setDoneLearningAbilityTest', payload: data.hasDoLearn || false });
            break;
          default:
            break;
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
            break;
          default:
            break;
        }
      } catch (err) {
        console.log(err);
      }
    },
    * getIfPaid({ payload }, { call, put }) {
      try {
        const repos = yield call(abilityReportService.getIfPaid, payload);
        const { code = '0', data = {}, message = '' } = repos;
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setIfPaid', payload: data });
            break;
          default:
            break;
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
    setIfPaid(state, { payload }) {
      return {
        ...state,
        ifPaid: payload,
      };
    },
  },
};

import * as abilityTestService from './service';
import questions from './questions';

export default {

  namespace: 'KidAbilityTestModel',

  state: {
    questions,
    doneLearningAbilityTest: false,
    learningAbilityResult: [],
    submitLearningAbilityResult: 0,
  },

  subscriptions: {},

  effects: {
    * getDoneLearningAbilityTest({ payload }, { call, put }) {
      try {
        const repos = yield call(abilityTestService.getDoneLearningAbilityTest, payload);
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
        const repos = yield call(abilityTestService.getLearningAbilityResult, payload);
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
    * submitLearningAbility({ payload }, { call, put }) {
      try {
        const repos = yield call(abilityTestService.submitLearningAbility, payload);
        const { code = '0', data = {}, message = '' } = repos;
        console.log(repos);
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setSubmitLearningAbilityResult', payload: 1 });
            break;
          default:
            yield put({ type: 'setSubmitLearningAbilityResult', payload: -1 });
            break;
        }
        yield put({ type: 'setSubmitLearningAbilityResult', payload: 0 });
      } catch (err) {
        yield put({ type: 'setSubmitLearningAbilityResult', payload: -1 });
        console.log(err);
      }
    },
    * submitResultReset({ payload }, { call, put }) {
      yield put({ type: 'setSubmitLearningAbilityResult', payload: 0 });
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
    setSubmitLearningAbilityResult(state, { payload }) {
      return {
        ...state,
        submitLearningAbilityResult: payload,
      };
    },
  },
};

import { routerRedux } from 'dva/router';
import * as abilityService from './service';
import questions from './questions';

export default {

  namespace: 'KidLearningAbilityModel',

  state: {
    targetPage: '',
    doneLearningAbilityTest: false,
    learningAbilityResult: [],
    questions,
    submitLearningAbilityResult: 0,
  },

  subscriptions: {},

  effects: {
    * getDoneLearningAbilityTest({ payload }, { call, put }) {
      try {
        const repos = yield call(abilityService.getDoneLearningAbilityTest, payload);
        const { code = '0', data = {}, message = '' } = repos;
        console.log(repos);
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setTargetPage', payload: data.hasDoLearn ? 'report' : 'test' });
            if (data.hasDoLearn) {
              // yield put(routerRedux.push('/kid/ability/report'));
              yield put({
                type: 'getLearningAbilityResult',
              });
              yield put({
                type: 'getIfPaid',
              });
            } else {
              // yield put(routerRedux.push('/kid/ability/test'));
            }
            break;
          default:
            console.error(repos);
        }
      } catch (err) {
        console.log(err);
      }
    },
    * getLearningAbilityResult({ payload }, { call, put }) {
      try {
        const repos = yield call(abilityService.getLearningAbilityResult, payload);
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
        const repos = yield call(abilityService.getIfPaid, payload);
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
    * submitLearningAbility({ payload }, { call, put }) {
      try {
        const repos = yield call(abilityService.submitLearningAbility, payload);
        const { code = '0', data = {}, message = '' } = repos;
        console.log(repos, code);
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setSubmitLearningAbilityResult', payload: 1 });
            break;
          default:
            yield put({ type: 'setSubmitLearningAbilityResult', payload: -1 });
            break;
        }
        // yield put({type: 'setSubmitLearningAbilityResult', payload: 0})
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
    setTargetPage(state, { payload }) {
      return {
        ...state,
        targetPage: payload,
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
    setSubmitLearningAbilityResult(state, { payload }) {
      return {
        ...state,
        submitLearningAbilityResult: payload,
      };
    },
  },
};

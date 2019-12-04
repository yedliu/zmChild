import * as personalCenterService from './service';

export default {

  namespace: 'KidPersonalCenterModel',

  state: {
    userInfo: {
      sex: -1,
    },
    lessonsInfo: [],
    freeLessonsInfo: 0,
    gainLessonsDetail: { total: 0 },
    consumeLessonsDetail: { total: 0 },
    doneLearningAbilityTest: false,
    learningAbilityResult: [],
    phaseTestUrl:{}
  },

  subscriptions: {},

  effects: {
    * getPersonalInfo({ payload }, { call, put }) {
      try {
        const repos = yield call(personalCenterService.getPersonalInfo, payload);
        const { code = '0', data = {}, message = '' } = repos;
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setUserInfo', payload: data });
        }
        // console.log('repos====>', repos)
      } catch (err) {
        console.log(err);
      }
    },
    * getLessonsInfo({ payload }, { call, put }) {
      try {
        const repos = yield call(personalCenterService.getLessonsInfo, payload);
        const { code = '0', data = {}, message = '' } = repos;
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setLessonsInfo', payload: data });
        }
        // console.log('repos====>', repos)
      } catch (err) {
        console.log(err);
      }
    },
    * getFreeLessonsInfo({ payload }, { call, put }) {
      try {
        const repos = yield call(personalCenterService.getFreeLessonsInfo, payload);
        const { code = '0', data = {}, message = '' } = repos;
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setFreeLessonsInfo', payload: data });
        }
        // console.log('repos====>', repos)
      } catch (err) {
        console.log(err);
      }
    },
    * getLessonsDetail({ payload }, { call, put }) {
      try {
        const repos = yield call(personalCenterService.getLessonsDetail, payload);
        const { oldLessonsDetail } = payload;
        const { code = '0', data = {}, message = '' } = repos;
        data.list = oldLessonsDetail.concat(data.list);
        switch (code.toString()) {
          case '0':
            payload.inputType === 1 ? yield put({ type: 'setConsumeLessonsDetail', payload: data }) : yield put({ type: 'setGainLessonsDetail', payload: data });
        }
        // console.log('repos====>', repos)
      } catch (err) {
        console.log(err);
      }
    },
    * getDoneLearningAbilityTest({ payload }, { call, put }) {
      try {
        const repos = yield call(personalCenterService.getDoneLearningAbilityTest, payload);
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
        const repos = yield call(personalCenterService.getLearningAbilityResult, payload);
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
    * getPhasetestUrl({ payload }, { call, put }){
      try {
        const repos = yield call(personalCenterService.getPhasetestUrl, payload);
        const { code = '0', data = {}, message = '' } = repos;
        console.log(repos);
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setPhaseTestUrl', payload: data });
        }
      } catch (err) {
        console.log(err);
      }
    }
  },

  reducers: {
    setUserInfo(state, { payload }) {
      return {
        ...state,
        userInfo: payload,
      };
    },
    setLessonsInfo(state, { payload }) {
      return {
        ...state,
        lessonsInfo: payload,
      };
    },
    setFreeLessonsInfo(state, { payload }) {
      return {
        ...state,
        freeLessonsInfo: payload,
      };
    },
    setGainLessonsDetail(state, { payload }) {
      return {
        ...state,
        gainLessonsDetail: payload,
      };
    },
    setConsumeLessonsDetail(state, { payload }) {
      return {
        ...state,
        consumeLessonsDetail: payload,
      };
    },
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
    setPhaseTestUrl(state,{payload}){
      return {
        ...state,
        phaseTestUrl: payload
      }
    }
  },
};

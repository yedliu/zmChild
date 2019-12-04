
import { getPracticeCenter, getPersonalInfo, gradeSubject } from './service';

export default {

  namespace: 'kiddrivingcenter',

  state: {
    practiceItems: [],
    personInfo: {},
    gradeList: []
  },

  subscriptions: {

  },

  effects: {
    *getPracticeCenter({payload}, {call, put}) {
       const { code, data } = yield call(getPracticeCenter);
       if (code.toString() === '0' && data) {
         console.log(data);
         yield put({
           type: 'setData',
           practiceItems: data,
         })
       }
    },
    *getPersonalInfo({}, {call, put}) {
       const { code, data} = yield call(getPersonalInfo);
       if (code.toString() === '0' && data) {
         yield put({
           type: 'setData',
           personInfo: data,
         })
       }
    },
    *gradeSubject({}, {call, put}) {
      const { code, data } = yield call(gradeSubject);
      if (code.toString() === '0' && data) {
        yield put({
          type: 'setData',
          gradeList: data
        })
      }
    }
  },

  reducers: {
    setData(state, action) {
      return { ...state, ...action }
    }
  },
};

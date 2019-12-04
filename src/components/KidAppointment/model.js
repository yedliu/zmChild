import * as appointment from './service';


export default {

  namespace: 'kidAppointment',

  state: {
    appointSuccessful: false,
    defaultSubject: { code: '-1', label: '请选择' },
    data: { label: '', subjectList: [] },
  },

  subscriptions: {

  },

  effects: {
    * getUserAppointmentInfo({}, { call, put }) {
      try {
        const repos = yield call(appointment.getUserAppointmentInfo);
        const { code = '0', data = { } } = repos;
        switch (code.toString()) {
          case '0':
            const newData = {
              label: data[0].label,
              code: data[0].code,
              subjectList: data[0].subjects,
            };
            const defaultSubject = data[0].subjects[0];
            yield put({ type: 'setAppointSubjects', payload: { data: newData } });
            yield put({ type: 'setDefaultSubject', payload: { defaultSubject } });
            break;
          default:
            break;
        }
      } catch (err) {
        console.log(err);
      }
    },
    * getAppointment({ payload }, { call, put }) {
      try {
        const repos = yield call(appointment.getAppointment, payload);
        const { code = '0', data = [] } = repos;
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setAppointCourse', payload: { appointSuccessful: true } });
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
    setAppointSubjects(state, { payload: { data } }) {
      return {
        ...state,
        data,
      };
    },
    setDefaultSubject(state, { payload: { defaultSubject } }) {
      return {
        ...state,
        defaultSubject,
      };
    },
    setAppointCourse(state, { payload: { appointSuccessful } }) {
      return {
        ...state,
        appointSuccessful,
      };
    },
  },
};

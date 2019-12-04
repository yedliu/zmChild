import { getArr } from 'utils/date';
import dayjs from 'dayjs';
import * as calendarService from './service';

export default {

  namespace: 'kidcoursecalendar',

  state: {
    curCourseDate: [],
    noteDate: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, date: new Date().getDate() },
    courseStates: [],
    courseSchedule: {},
  },

  subscriptions: {

  },

  effects: {
    * queryCourseStates({ payload }, { call, put }) {
      try {
        const repos = yield call(calendarService.queryCourseStates, payload);
        const { code, data = [] } = repos;
        switch (code.toString()) {
          case '0':
            const curCourseDate = getArr(Math.floor(data.length / 7)).map(() => getArr(7));
            for (let i = 0; i < curCourseDate.length; i += 1) {
              const col = curCourseDate[i].length;
              for (let j = 0; j < col; j++) {
                curCourseDate[i][j] = data.shift();
              }
            }
            yield put({ type: 'setCourseStates', payload: { curCourseDate } });
            break;
          default:
            break;
        }
      } catch (err) {
        console.log(err);
      }
    },
    * queryCourseSchedule({ payload }, { call, put }) {
      try {
        const repos = yield call(calendarService.queryCourseSchedule, payload);
        const { code, data = {} } = repos;
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setCourseSchedule', payload: { courseSchedule: data } });
            break;
          default:
            break;
        }
      } catch (err) {
        console.log(err);
      }
    },
    * getLessonForClass({ payload }, { call, put }) {
      try {
        const repos = yield call(calendarService.getLessonForClass, payload);
        const { code = '0', data = {}, message = '' } = repos;
        switch (code.toString()) {
          case '0':
            return data;
        }
        // console.log('repos====>', repos)
      } catch (err) {
        console.log(err);
      }
    },
  },

  reducers: {
    setCurCourseDate(state, { payload: { curCourseDate } }) {
      return {
        ...state,
        curCourseDate,
      };
    },
    setNotesDate(state, { payload: { newNoteDate } }) {
      return {
        ...state,
        noteDate: newNoteDate,
      };
    },
    setCourseStates(state, { payload: { curCourseDate } }) {
      //  console.log('state====>', courseStates);
      return {
        ...state,
        curCourseDate,
      };
    },
    setCourseSchedule(state, { payload: { courseSchedule } }) {
      return {
        ...state,
        courseSchedule,
      };
    },
  },
};

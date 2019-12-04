import * as messageCenterService from './service';

export default {

  namespace: 'KidMessageCenterModel',

  state: {
    unreadMessagesCount: {
      homeworkCount: 0,
      courseCount: 0,
    },
    courseMessagesInfo: {},
    homeworkMessagesInfo: {},
    courseReadMessages: [],
  },

  subscriptions: {},

  effects: {
    * getUnreadMessagesCount({ payload }, { call, put }) {
      try {
        const repos = yield call(messageCenterService.getUnreadMessagesCount, payload);
        const { code = '0', data = {}, message = '' } = repos;
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setUnreadMessagesCount', payload: data });
            break;
          default:
            break;
        }
        // console.log('repos====>', repos)
      } catch (err) {
        console.log(err);
      }
    },
    * getCourseMessagesInfo({ payload }, { call, put }) {
      try {
        const { page, size, oldList } = payload;
        const repos = yield call(messageCenterService.getCourseMessagesInfo, { page, size });
        const { code = '0', data = {}, message = '' } = repos;
        data.list = data.list ? oldList.concat(data.list) : oldList;
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setCourseMessagesInfo', payload: data });
            break;
          default:
            break;
        }
        // console.log('repos====>', repos)
      } catch (err) {
        console.log(err);
      }
    },
    * setCourseMessagesRead({ payload }, { call, put }) {
      try {
        const repos = yield call(messageCenterService.setCourseMessagesRead, payload);
        const { code = '0', data = {}, message = '' } = repos;
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setCourseMessagesReadSuccess', payload: payload.messageIndex });
            break;
          default:
            break;
          // console.log('repos====>', repos)
        }
      } catch (err) {
        console.error(err);
      }
    },
    * getHomeworkMessagesInfo({ payload }, { call, put }) {
      try {
        const repos = yield call(messageCenterService.getHomeworkMessagesInfo, payload);
        const { code = '0', data = {}, message = '' } = repos;
        switch (code.toString()) {
          case '0':
            yield put({ type: 'setHomeworkMessagesInfo', payload: data });
        }
        // console.log('repos====>', repos)
      } catch (err) {
        console.log(err);
      }
    },
  },

  reducers: {
    setCourseMessagesInfo(state, { payload }) {
      return {
        ...state,
        courseMessagesInfo: payload,
      };
    },
    setHomeworkMessagesInfo(state, { payload }) {
      return {
        ...state,
        homeworkMessagesInfo: payload,
      };
    },
    setUnreadMessagesCount(state, { payload }) {
      return {
        ...state,
        unreadMessagesCount: payload,
      };
    },
    setCourseMessagesReadSuccess(state, { payload }) {
      const { courseMessagesInfo, unreadMessagesCount } = state;
      courseMessagesInfo.list[payload].isChecked = true;
      unreadMessagesCount.courseCount = unreadMessagesCount.courseCount > 0 ? (unreadMessagesCount.courseCount - 1) : 0;
      return {
        ...state,
        courseMessagesInfo,
        unreadMessagesCount,
      };
    },
  },
};

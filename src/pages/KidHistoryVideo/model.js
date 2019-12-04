import { getVideoTypeData } from './service';

export default {

  namespace: 'kidvideoModel',

  state: {
    videoData: {},
    selectVideoIndex: 0,
  },

  subscriptions: {

  },

  effects: {
    * getVideoTypeData({ payload }, { call, put }) {
      const { code, data } = yield call(getVideoTypeData, payload);
      if (code.toString() === '1') {
        payload.videotype = 2;
        payload.uid = payload.lessonUid;
        payload.tencentfiles = data;
        yield put({
          type: 'setVideoData',
          data: payload,
        });
        yield put({
          type: 'setVideoIndex',
          selectVideoIndex: 0,
        });
      } else {
        payload.videotype = 1;
        payload.uid = payload.lessonUid;
        yield put({
          type: 'setVideoData',
          data: payload,
        });
      }
    },
  },

  reducers: {
    setVideoData(state, action) {
      return { ...state, videoData: action.data };
    },
    setVideoIndex(state, action) {
      return { ...state, selectVideoIndex: action.selectVideoIndex };
    },
  },
};

import zmAlert from 'components/zmAlert';
import { getClassCourseware, getPreviewCourseware, updatePreviewProgress, getBUClassCourseware, getAddFruit } from './service';

export default {

  namespace: 'kidcoursewareModel',

  state: {
    courseClassData: [],
    coursePreviewData: {},
    pageInfo: {
      currentPage: 0,
      totalPage: 0,
      maxPage: 0,
    },
    toastText: '',
    fruit: {},
  },

  subscriptions: {

  },

  effects: {
    * getClassCourseware({ payload }, { call, put }) { // 1对1上课课件
      const { code, data } = yield call(getClassCourseware, payload);
      if (code.toString() === '0') {
        yield put({
          type: 'setCoursewareData',
          courseClassData: data,
        });
      }
    },
    * getPreviewCourseware({ payload }, { select, call, put }) {
      const pageInfo = yield select(state => state.kidcoursewareModel.pageInfo);
      const { code, data } = yield call(getPreviewCourseware, payload);
      if (code.toString() === '0') {
        yield put({
          type: 'setCoursePreviewData',
          coursePreviewData: { coursewareType: 1000502, ...data },
        });
        yield put({
          type: 'setPageInfo',
          pageInfo: { ...pageInfo, ...{ currentPage: data.currentPage, maxPage: data.currentPage === -1 ? 0 : data.currentPage } },
        });
      }
    },
    // * updatePreviewProgress({ payload }, { call, put }) {
    //   const { code } = yield call(updatePreviewProgress, payload);
    //   if (code.toString() === '0') {
    //     console.log('progress update success');
    //   } else {
    //     console.log('progress update failure');
    //   }
    // },
    * getBUClassCourseware({ payload }, { call, put }) { // 小班课上课课件
      const { data, code } = yield call(getBUClassCourseware, payload);
      if (code.toString() === '0') {
        yield put({
          type: 'setCoursewareData',
          courseClassData: data,
        });
      }
    },
    * getAddFruit({ payload }, { call, put }) { // 添加魔力果接口
      const { data, code } = yield call(getAddFruit, payload);
      if (code.toString() === '0') {
        yield put({
          type: 'setFruit',
          fruit: data,
        });
      }
    },
  },

  reducers: {
    setCoursewareData(state, action) {
      return { ...state, courseClassData: action.courseClassData };
    },
    setCoursePreviewData(state, action) {
      return { ...state, coursePreviewData: action.coursePreviewData };
    },
    setPageInfo(state, action) {
      return { ...state, pageInfo: action.pageInfo };
    },
    setToastText(state, action) {
      return { ...state, toastText: action.toastText };
    },
    setFruit(state, action) {
      return { ...state, fruit: action.fruit };
    },
  },
};

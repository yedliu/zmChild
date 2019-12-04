import { getCourse, showKidMindButton } from './service';

// 由于接口只有第一次返回会会有数据，后续请求都是空数组，故用全局变量做存储
let subjectList = [];
let dateList = [];
let kecList = [];
export default {

  namespace: 'kidHistory',

  state: {
    subjects: [],
    date: [],
    courseList: [],
    total: 0,
    checked: 0,
    subjectCode: '',
    showKidMindButton: false,
  },

  subscriptions: {

  },

  effects: {
    *getCourse({ payload }, { call, put }) {
     
      const { params, isScroll, kecItem } = payload;
      const { data, code } = yield call(getCourse, params);
      const all = { subjectCode: '', subjectLabel: '全部' };
      if (code.toString() === '0' && Object.keys(data).length > 0) {
        const list = [];

        const courseList = data.list;
        if (isScroll == 'right') {
          kecList = kecItem.concat.apply([], kecItem).concat(courseList);
        }

        if (data.tabs.length > 0) {
          const { subjectTabs } = data.tabs[0];
          const { lessonDistribution } = data.tabs[0];
          subjectTabs.unshift(all);
          subjectList = subjectTabs.slice();
          dateList = lessonDistribution.slice();
        }

        if (isScroll == 'right') {
          while (kecList.length) {
            list.push(kecList.splice(0, 4));
          }
        } else {
          while (courseList.length) {
            list.push(courseList.splice(0, 4));
          }
        }
        // 设置总条数
        yield put({
          type: 'setTotal',
          payload: {
            total: data.total,
          },
        });
        // 设置学科
        yield put({
          type: 'setData',
          payload: {
            subjects: subjectList,
          },
        });

        // 设置日期
        yield put({
          type: 'setDate',
          payload: {
            date: dateList,
          },
        });

        // 设置课程列表
        yield put({
          type: 'setCourseList',
          payload: {
            courseList: list,
          },
        });
      }
    },
    *showKidMindButton({payload}, {call, put}) {
      const { data, code } = yield call(showKidMindButton);
      if (code.toString() === '0') {
        yield put({
          type: 'setShowKidMindButton',
          showKidMindButton: data.show || false,
        })
      } else {
        yield put({
          type: 'setShowKidMindButton',
          showKidMindButton: false,
        })
      }
    }
  },

  reducers: {
    setData(state, action) {
      return { ...state, subjects: action.payload.subjects };
    },
    setDate(state, action) {
      return { ...state, date: action.payload.date };
    },
    setCourseList(state, action) {
      return { ...state, courseList: action.payload.courseList };
    },
    setTotal(state, action) {
      return { ...state, total: action.payload.total };
    },
    setChecked(state, action) {
      return { ...state, checked: action.checked };
    },
    setSubjectCode(state, action) {
      return { ...state, subjectCode: action.subjectCode };
    },
    setShowKidMindButton(state, action) {
      return { ...state, showKidMindButton: action.showKidMindButton };
    }
  },
};

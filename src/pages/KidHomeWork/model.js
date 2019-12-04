
import { fromJS } from 'immutable';
import { AppLocalStorage } from 'utils/localStorage';
import { routerRedux } from 'dva/router';
import zmAlert from 'components/zmAlert';
import {
  getDoSmallHomework,
  postSmallHomeworkAnswer,
  getSmallCourseReport,
  getOneToOneHomework,
  getOneToOneCourseReport,
  postOneToOneHomeworkAnswer,
  postOneToOneHomeworiAllAnswer,
  getAddFruit, // 获取能量果
} from './service';

export default {

  namespace: 'KidhomeworkModel',

  state: {
    homeData: {},
    questionList: [],
    questionIndex: 0,
    homeWorkInfo: {},
    answerList: fromJS([]),
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname == '/kid/kidhomework') {
          // console.log('lo', location)
        }
      });
    },
  },

  effects: {
    * getDoSmallHomework({ payload }, { call, put }) {
      const { code, data } = yield call(getDoSmallHomework, payload);
      if (code.toString() === '0') {
        yield put({
          type: 'getHomeData',
          data,
        });
      }
    },
    * postSmallHomeworkAnswer({ payload, leavePage, callback }, { call, put }) {
      const { code, data, message } = yield call(postSmallHomeworkAnswer, payload);
      if (code.toString() === '0') {
        yield put({
          type: 'getAddFruit',
          payload: {
            bizId: payload.id,
            userId: AppLocalStorage.getUserInfo().userId,
            extraMsg: {},
          },
          leavePage,
          classType: 1 // 小班课
        });
        // callback('success');
      } else {
        callback(message);
      }
    },
    * getSmallCourseReport({ payload }, { call, put }) {
      const { code, data } = yield call(getSmallCourseReport, payload);
      if (code.toString() === '0') {
        yield put({
          type: 'getSmallHomeworkReport',
          data,
        });
      }
    },
    * getOneToOneHomework({ payload, callback }, { call, put }) {
      const { code, data, message } = yield call(getOneToOneHomework, payload);
      if (code.toString() === '0') {
        const _list = data.homeworkLessonQuestionDTOList || [];
        const _answerList = [];
        _list.map((el) => {
          const answerItem = {
            id: el.id,
            stuAnswer: el.stuAnswer,
          };
          const children = el.questionOutputDTO.children || [];
          if (el.questionOutputDTO.templateType === 1 && children.length > 0) {
            answerItem.children = children.map((it) => {
              return ({ id: it.id, stuAnswer: it.stuAnswer });
            });
          }
          _answerList.push(answerItem);
        });
        sessionStorage.setItem('originData', JSON.stringify(_answerList));
        yield put({
          type: 'getQuestionList',
          _list,
          questionIndex: 0,
          homeData: data,
          answerList: _answerList,
        });
      } else {
        // 异常处理
        callback(message);
      }
    },
    * getOneToOneCourseReport({ payload }, { call, put }) {
      const { code, data } = yield call(getOneToOneCourseReport, payload);
      if (code.toString() === '0') {
        const _list = data.homeworkLessonQuestionDTOList || [];
        const info = Object.assign({}, data);
        delete info.homeworkLessonQuestionDTOList;
        yield put({
          type: 'getQuestionList',
          _list,
          questionIndex: 0,
          answerList: fromJS([]),
          homeData: fromJS(info),
        });
      } else {
        // 异常处理
      }
    },
    * postOneToOneHomeworkAnswer({ payload }, { call, put }) {
      const { code, data } = yield call(postOneToOneHomeworkAnswer, payload);
      if (code.toString() === '0') {
        if (data && data.id && data.homeworkLessonQuestionDTOList && data.homeworkLessonQuestionDTOList.length > 0) {
          const _list = data.homeworkLessonQuestionDTOList || [];
          const _answerList = [];
          _list.map((el) => {
            const answerItem = {
              id: el.id,
              stuAnswer: el.stuAnswer,
            };
            const children = el.questionOutputDTO.children || [];
            if (el.questionOutputDTO.templateType === 1 && children.length > 0) {
              answerItem.children = children.map((it) => {
                return ({ id: it.id, stuAnswer: it.stuAnswer });
              });
            }
            _answerList.push(answerItem);
          });

          yield put({
            type: 'setQuestionList',
            questionList: _list,
          });
          yield put({
            type: 'getHomeworkReport',
            data,
          });
          yield put({
            type: 'setAnswer',
            answerList: _answerList,
          });
        }
      } else {
        // 异常处理
      }
    },
    * postOneToOneHomeworiAllAnswer({ payload, leavePage, callback }, { call, put }) {
      const { code, data, message } = yield call(postOneToOneHomeworiAllAnswer, payload);
      if (code.toString() === '0') {
        yield put({
          type: 'getAddFruit',
          payload: {
            bizId: payload.id,
            userId: AppLocalStorage.getUserInfo().userId,
            extraMsg: {},
          },
          leavePage,
          classType: 2, // 1对1
        });
        // 如果全是自动批改的那么跳转到报告页面
        // CorrectModeEnum = 2 表示自动批改 1表示手动批改
        // callback('success', data.correctMode);
      } else {
        // 异常处理
        callback('error', message);
      }
    },
    * getAddFruit({payload, leavePage, classType}, {call, put}) {
      const { code, data } = yield call(getAddFruit, payload);
      if (code.toString() === '0') {
          const alert = {
            title: '练习提交成功啦~',
            message: `奖励爱学习的你 ${data.obtainValue} 能量果哦，继续努力哈~`,
            className: `partner${localStorage.getItem('partner')}`,
            okText: '完成',
            onOk: leavePage,
          };
       
        if (data.obtainValue != 0) {
          zmAlert(alert)
        }
      } else {
        yield put(routerRedux.push('/kid/kidhistory'));
      }
    }
  },

  reducers: {
    getHomeData(state, action) {
      console.log(action);
      return { ...state, homeData: action.data };
    },
    getHomeworkReport(state, action) {
      return { ...state, homeData: fromJS(action.data) };
    },
    getSmallHomeworkReport(state, action) {
      return { ...state, homeData: action.data };
    },
    getQuestionList(state, action) {
      return { ...state, questionList: fromJS(action._list), questionIndex: action.questionIndex, homeData: fromJS(action.homeData), answerList: fromJS(action.answerList) };
    },
    setQuestionList(state, action) {
      return { ...state, questionList: fromJS(action.questionList) };
    },
    setAnswer(state, action) {
      console.log('55', action);
      return { ...state, answerList: fromJS(action.answerList) };
    },
    setQuestionIndex(state, action) {
      console.log('333', action);
      return { ...state, questionIndex: action.questionIndex };
    },
  },
};

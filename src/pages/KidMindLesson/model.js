import { 
    checkUnfinishedLessonList,
    checkFinishedLessonList,
    beginMakeUpLesson,
    getEnterNum,
    getRecordedUid,
    getCourseWare,
    parseCourse,
} from './service';

let saveList = []; // 存放已学习数据
let subjectList = []; //存放学科

export default {

    namespace: 'kidmindlessonModel',
  
    state: {
        makeupLessonList : [], // 存储未学习数据
        alreadyLessonList: [], // 存放已学习数据
        subjectInfo: [],
        enterTypeData: '', // 判断是否可以学习有无学习课时及免费次数
        isEnter: null, // 学习次数是否正确扣除
        courseWare: {}, //存放下载课件的数据
        parseCourseList: {}, //解析后的下载地址
        recordLessonUid: '' //录播课的uid
    },
  
    subscriptions: {
  
    },
  
    effects: {
        // 待学习
        *checkUnfinishedLessonList({ payload }, { call, put }) {
            const { code, data } = yield call(checkUnfinishedLessonList);
            if (code.toString() === '0' && data.length > 0) {
                yield put({
                    type: 'setMakeupLessonList',
                    makeupLessonList: data,
                })
            } else {
                yield put({
                    type: 'setMakeupLessonList',
                    makeupLessonList: [],
                })
            }
            yield put({
                type: 'setSubjectInfo',
                subjectInfo: [],
            });
        },
        // 已学习
        *checkFinishedLessonList({payload}, { call, put }) {
            const { prevList, params, isScroll } = payload;
            const { code, data } = yield call(checkFinishedLessonList, params);
            if (code.toString() === '0' && Object.keys(data).length > 0) {
                // 学科
                // const all = { subjectCode: '', subjectName: '全部' };
                if (data.subjectInfo) {
                    const { subjectInfo } = data;
                    // subjectInfo.unshift(all);
                    subjectList = subjectInfo.slice();
                    yield put({
                        type: 'setSubjectInfo',
                        subjectInfo: subjectList,
                    });
                } else {
                    yield put({
                        type: 'setSubjectInfo',
                        subjectInfo: subjectList,
                    });
                }
                // 已学习列表
                if (data.recordLessons.length > 0) {
                    if (isScroll === 'right') {
                      saveList = prevList.concat.apply([], prevList).concat(data.recordLessons);
                    } else {
                        saveList = data.recordLessons; 
                    }
                    yield put({
                        type: 'setAlreadyLessonList',
                        alreadyLessonList: saveList,
                    })
                } else {
                    yield put({
                        type: 'setAlreadyLessonList',
                        alreadyLessonList: saveList,
                    })
                }
            } else {
                yield put({
                    type: 'setAlreadyLessonList',
                    alreadyLessonList: saveList,
                });
                yield put({
                    type: 'setSubjectInfo',
                    subjectInfo: subjectList,
                });
            }
        },
        // 点击开始学习
        *beginMakeUpLesson({payload}, { call, put }) {
            const { code, data } = yield call(beginMakeUpLesson, payload);
            if (code.toString() === '0' && Object.keys(data).length > 0) {
                yield put({
                    type: 'enterType',
                    data, 
                })
            }
        },
        // 消耗免费次数/课时进课堂
        *getEnterNum({ payload }, { call, put }) {
            const { code, data } = yield call(getEnterNum, payload);
            if (code.toString() === '0') {
                if (data) {
                    yield put({
                        type: 'setIsEnter',
                        isEnter: data,
                    });
                }
            } else {
                yield put({
                    type: 'setIsEnter',
                    isEnter: false,
                })
            }
        },
        //获取进入课堂的lessonUid
        *getRecordedUid({ payload }, { call, put }) {
            const { code, data } = yield call(getRecordedUid, payload);
            if (code.toString() === '0') {
                yield put({
                    type: 'setLessonUid',
                    recordLessonUid: data,
                })
            }
        },
        // 获取下载课件数据
        *getCourseWare({ payload }, { call, put }) {
            const { code, data } = yield call(getCourseWare, payload);
            if (code.toString() === '0' && Object.keys(data).length > 0) {
                yield put({
                    type: 'setCourseWare',
                    courseWare: data,
                });
            }
        },
        // 获取下载课件zip地址
        *parseCourse({ payload }, { call, put }) {
            const data = yield call(parseCourse, payload);
            yield put({
                type: 'setParseCourse',
                parseCourseList: data,
            })
        }
    },
  
    reducers: {
        setSubjectInfo(state, action) {
            return { ...state, subjectInfo: action.subjectInfo }
        },
        setMakeupLessonList(state, action) {
            return { ...state, makeupLessonList: action.makeupLessonList }
        },
        setAlreadyLessonList(state, action) {
            return { ...state, alreadyLessonList: action.alreadyLessonList }
        },
        enterType(state, action) {
            return { ...state, enterTypeData: action.data }
        },
        setIsEnter(state, action) {
            return { ...state, isEnter: action.isEnter }
        },
        setCourseWare(state, action) {
            return { ...state, courseWare: action.courseWare }
        },
        setParseCourse(state, action) {
            return { ...state, parseCourseList: action.parseCourseList }
        },
        setLessonUid(state, action) {
            return { ...state, recordLessonUid: action.recordLessonUid }
        }
    },
};
  
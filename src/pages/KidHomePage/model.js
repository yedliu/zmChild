import zmTip from 'components/zmTip'
import * as homeService from './service'
import { DataPersistence } from 'utils/helpfunc'
import { AppLocalStorage } from 'utils/localStorage'

export default {
	namespace: 'kidHomePage',

	state: {
		allLessonList: {},
		user: '',
		someLessonList: [],
		stuGradeInfo: {},
		defaultSubject: { channelName: 'zhangmenkid', subjectCode: '', label: '' },
		appointIsSuccessful: false,
		networkspeed: 0,
		totalMessage: 0,
		studiedData: { hasDoLearn: false, returnUrl: '' },
		simulateStatus: { hasRecentLesson: false, hasSimulateLesson: false },
		partnerInfo: {}, // 学伴信息
		manifestData: {}, // 学伴本地化下载信息
		festivalData: {}, // 节日信息
		entryConfig: {}, //学习乐园入口配置
		festivalBg: {}
	},

	subscriptions: {},

	effects: {
		*getLessonList({}, { call, put }) {
			try {
				const repos = yield call(homeService.getLessonList)
				const { code = '0', data = {} } = repos
				switch (code.toString()) {
					case '0':
						const { subjectPadConfigList } = data
						subjectPadConfigList.some(item => item.subjectLabel !== '全部') &&
							subjectPadConfigList.unshift({ subjectLabel: '全部' })
						yield put({
							type: 'setLessonList',
							payload: { allLessonList: data }
						})
						break
					default:
						break
				}
			} catch (err) {
				console.log(err)
			}
		},
		*getStudyingCourse({ payload }, { call, put }) {
			try {
				// console.log('subjectCode1111=====>', payload);
				const repos = yield call(homeService.getStudyingCourse, payload)
				const { code = '0', data = [] } = repos
				switch (code.toString()) {
					case '0':
						yield put({
							type: 'setStudyingCourse',
							payload: { someLessonList: data }
						})
						break
					default:
						break
				}
			} catch (err) {
				console.log(err)
			}
		},
		*getMessageCount({ payload }, { call, put }) {
			try {
				const repos = yield call(homeService.getMessageCount, payload)
				const { code = '0', data = [] } = repos
				switch (code.toString()) {
					case '0':
						const totalMessage =
							Number(data.courseCount) + Number(data.homeworkCount)
						yield put({ type: 'setMessageCount', payload: { totalMessage } })
						break
					default:
						break
				}
			} catch (err) {
				console.log(err)
			}
		},
		*getNetworkSpeed({}, { call, put }) {
			const beginTime = Date.now()
			try {
				const repos = yield call(homeService.getNetworkSpeed)
				const { code = '0', data = [] } = repos
				switch (code.toString()) {
					case '0':
						const networkspeed = Date.now() - beginTime
						yield put({ type: 'setNetworkSpeed', payload: { networkspeed } })
						break
					default:
						yield put({
							type: 'setNetworkSpeed',
							payload: { networkspeed: 500 }
						})
				}
			} catch (err) {
				yield put({ type: 'setNetworkSpeed', payload: { networkspeed: 500 } })
			}
		},
		*getLearningAbilityResult({}, { call, put }) {
			try {
				const repos = yield call(homeService.getLearningAbilityResult)
				const { code = '0', data = [] } = repos
				switch (code.toString()) {
					case '0':
						yield put({ type: 'setHasDoLearn', payload: { studiedData: data } })
						break
					default:
						break
				}
			} catch (err) {
				// yield put({type: 'setNetworkSpeed', payload: { networkspeed: 500 } });
			}
		},
		*getSimulateLessonState({ payload }, { call, put }) {
			try {
				const repos = yield call(homeService.getSimulateLessonState, payload)
				const { code = '0', data = {} } = repos
				switch (code.toString()) {
					case '0':
						yield put({
							type: 'setSimulateStatus',
							payload: { simulateStatus: data }
						})
						return data
					default:
						break
				}
			} catch (err) {
				console.log(err)
			}
		},
		*openSimulateLesson({ payload }, { call, put }) {
			try {
				const repos = yield call(homeService.openSimulateLesson, payload)
				const { code = '0', data = {} } = repos
				switch (code.toString()) {
					case '0':
						return data
					default:
						break
				}
			} catch (err) {
				console.log(err)
			}
		},
		*updateDeviceNotifyReadState({ payload }, { call, put }) {
			try {
				const repos = yield call(
					homeService.updateDeviceNotifyReadState,
					payload
				)
				const { code = '0', data = {} } = repos
				switch (code.toString()) {
					case '0':
						return data
					default:
						break
				}
			} catch (err) {
				console.log(err)
			}
		},
		*getAiLastTestResult({ payload }, { call, put }) {
			try {
				const repos = yield call(homeService.getAiLastTestResult, payload)
				const { code = '0', data = {} } = repos
				switch (code.toString()) {
					case '0':
						return data
					default:
						break
				}
			} catch (err) {
				console.log(err)
			}
		},
		*getPersonalInfo({ payload }, { call, put }) {
			try {
				const repos = yield call(homeService.getPersonalInfo, payload)
				const { code = '0', data = {}, message = '' } = repos
				switch (code.toString()) {
					case '0':
						yield put({ type: 'setUserInfo', payload: data })
						return data
				}
				// console.log('repos====>', repos)
			} catch (err) {
				console.log(err)
			}
		},
		*getIsBelongKidsBu({ payload }, { call, put }) {
			try {
				const repos = yield call(homeService.getIsBelongKidsBu, payload)
				const { code = '0', data = {}, message = '' } = repos
				switch (code.toString()) {
					case '0':
						return data
				}
				// console.log('repos====>', repos)
			} catch (err) {
				console.log(err)
			}
		},
		*getLessonForClass({ payload }, { call, put }) {
			try {
				const repos = yield call(homeService.getLessonForClass, payload)
				const { code = '0', data = {}, message = '' } = repos
				switch (code.toString()) {
					case '0':
						return data
				}
				// console.log('repos====>', repos)
			} catch (err) {
				console.log(err)
			}
		},
		*getSelectSwitch({ payload }, { call, put }) {
			try {
				const repos = yield call(homeService.getSelectSwitch, payload)
				const { code = '0', data = {}, message = '' } = repos
				switch (code.toString()) {
					case '0':
						return data
				}
				return {}
			} catch (err) {
				console.log(err)
				return {}
			}
		},
		*getSign({ payload }, { call, put }) {
			const { data, code } = yield call(homeService.getSign, payload)
			if (code.toString() === '0') {
				console.log('sign', data)
			}
		},
		// 学伴信息
		*getPartnerInfo({}, { call, put }) {
			const { data, code } = yield call(homeService.getPartnerInfo)
			if (code.toString() === '0') {
				// 设置partner用于设置对应学伴所显示的背景图片
				localStorage.setItem('partner', data.partnerId)
				yield put({ type: 'setPartnerInfo', payload: { partnerInfo: data } })
			} else {
				yield put({ type: 'setPartnerInfo', payload: { partnerInfo: {} } })
			}
		},
		// 学伴本地化
		*getManifest({}, { call, put }) {
			const { data, code } = yield call(homeService.getManifest)
			if (code.toString() === '0') {
				// console.log('mainfet', data);
				yield put({
					type: 'setManifest',
					payload: { manifestData: data }
				})
			} else {
				yield put({
					type: 'setManifest',
					payload: { manifestData: {} }
				})
			}
		},
		// 签到添加能量果
		*getAddFruit({ payload, callBack }, { call, put }) {
			const { code, data } = yield call(homeService.getAddFruit, payload)
			if (code.toString() === '0') {
				// console.log('data', data);
				yield put({ type: 'getPartnerInfo' })
				callBack(data)
			} else {
				const tip = {
					title: '签到失败，稍后重试',
					time: 2000
				}
				zmTip(tip)
			}
		},
		// 获取教师节活动信息
		*getFestival({ _ }, { call, put }) {
			try {
				const { code, data } = yield call(homeService.getFestival)
				if (code.toString() === '0') {
					yield put({
						type: 'setFestivalData',
						payload: { festivalData: data }
					})
				}
			} catch (err) {
				console.log(err)
			}
		},
		// 节日更换背景
		*changeFestivalBg({}, { call, put }) {
			try {
				const repos = yield call(homeService.getFestivalBg)
				const { code = '0', data = {}, message = '' } = repos
				if (code.toString() === '0') {
					yield put({
						type: 'changeData',
						festivalBg: data.context || {}
					})
				}
			} catch (err) {
				console.log(err)
			}
		},
		//获取学习乐园入口配置
		*getStudylandEntryConfig({}, { call, put }) {
			const { data, code } = yield call(homeService.getStudylandEntryConfig)
			if (code.toString() === '0') {
				//初始化数据存储
				if (data.canOpen) {
					DataPersistence.init()
				}
				yield put({
					type: 'setStudylandConfig',
					payload: { entryConfig: data }
				})
			} else {
				yield put({
					type: 'setStudylandConfig',
					payload: { entryConfig: {} }
				})
			}
		}
	},
	reducers: {
		setLessonList(state, action) {
			// console.log('action', action);
			const allLessonList = action.payload.allLessonList
			const userinfo = AppLocalStorage.getUserInfo() || {}
			AppLocalStorage.setUserInfo({
				...userinfo,
				name: allLessonList.name,
				avatar: allLessonList.avatar
			})
			return {
				...state,
				allLessonList
			}
		},
		setStudyingCourse(state, action) {
			return {
				...state,
				someLessonList: action.payload.someLessonList
			}
		},
		setNetworkSpeed(state, action) {
			return {
				...state,
				networkspeed: action.payload.networkspeed
			}
		},
		setMessageCount(state, action) {
			return {
				...state,
				totalMessage: action.payload.totalMessage
			}
		},
		setHasDoLearn(state, action) {
			return {
				...state,
				studiedData: action.payload.studiedData
			}
		},
		setSimulateStatus(state, action) {
			return {
				...state,
				simulateStatus: action.payload.simulateStatus
			}
		},
		setPartnerInfo(state, action) {
			return { ...state, partnerInfo: action.payload.partnerInfo }
		},
		setManifest(state, action) {
			return { ...state, manifestData: action.payload.manifestData }
		},
		setFestivalData(state, action) {
			return { ...state, festivalData: action.payload.festivalData }
		},
		setStudylandConfig(state, action) {
			return { ...state, entryConfig: action.payload.entryConfig }
		},
		changeData(state, action) {
			// 无处理数据逻辑时,可通用
			return { ...state, ...action }
		}
	}
}

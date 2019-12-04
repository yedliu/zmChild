import { getLessonForClass } from './service';

export default {

  namespace: 'CardDetailsModel',

  state: {
  },

  subscriptions: {

  },

  effects: {
    *getLessonForClass({ payload }, { call, put }) {
			try {
				const repos = yield call(getLessonForClass, payload)
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
  },

  reducers: {

  },
};

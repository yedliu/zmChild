export default {

  namespace: 'phaseTest',

  state: {
    srcState:{}
  },

  subscriptions: {      
    setup({ dispatch, history }) {
        history.listen((location) => {
            console.log('get phasetest query:',location);
            if(location.pathname.indexOf('/kid/phasetest') < 0){
                return;
            }
            const {state} = location;
            if(state){
                dispatch({
                    type:'setState',
                    payload:state
                });
            }
        });
      }
  },

  effects: {
  },

  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        srcState: payload,
      };
    }    
  },
};

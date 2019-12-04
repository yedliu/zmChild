import React,{ useEffect } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';


function PhaseTest(props) {
    console.log('props :',props);
    const { dispatch } = props;
    const { from,src } = props.srcState;

    const processMessage = (event) => {
        const { data = {} } = event;
        if (data.action === 'back') {
            //后退
            dispatch(routerRedux.push({
                pathname: from || '/kid'
            }));
        }
    }
    useEffect(() => {
        window.addEventListener('message',processMessage);
        return function clean() {
            console.log('clean up processMessage')
            window.removeEventListener('message',processMessage);
        }
    })
    return (
        <iframe src={src} frameBorder="0" width="100%" height="100%"></iframe>
    )
}
const mapStateToProps = (state) => { // 见名知意，把state转换为props
    // 可以打印state看看数据结构，然后放到data里
    console.log('state:',state)
    const { phaseTest } = state;
    return { ...phaseTest };
};

export default connect(mapStateToProps)(PhaseTest);
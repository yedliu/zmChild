import React, { useEffect, useState } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import KidHeader from 'components/kidHeader';
import ZmAlert from 'components/zmAlert';
import DownLoadPartner from '../KidFriends/downLoad';
import './style.scss';
const data1 = {
  id: "courseware.math-l1-spacething",
  url: "http://rs.hdkj.zmlearn.com/zip/spacething-07171826.zip",
  version: "spacething-07171825",
}
function KidDownPartner(props) {
  const { asComponent = false, onFinish = () => { } } = props;
  let dataSrc = {};
  if (asComponent) {
    dataSrc = props;
    // parseCourseList = props.parseCourseList;
    // moduleName = props.moduleName;
  } else {
    dataSrc = props.location.state.data;
  }
  let { parseCourseList, moduleName } = dataSrc;
  const [visibility, setVisibility] = useState(true);
  const [retry, setRetry] = useState(false);
  console.log('parseCourseList', parseCourseList)
  const isOk = () => {
    let postData = {
      action: 'CancelDownloadZip',
      data: {
        "id": 'zm_partner'
      }
    }
    window.frames[0].postMessage(postData, '*');
    const { dispatch } = props;
    if (asComponent) {
      setVisibility(false);
      onFinish();
      return;
    }
    dispatch(routerRedux.push(
      {
        pathname: '/kid',
        state: {
          from: '/kid/kiddownpartner',
        },
      },
    ));
  }
  const handleGoBack = () => {
    const { downloadMsg, location } = props;
    const download = {
      message: downloadMsg || location.state.data.downloadMsg,
      className: 'download studyPark',
      okText: '确定',
      cancelText: '取消',
      onOk: () => { isOk() },
      onCancel: () => { console.log('no'); },
    };
    ZmAlert(download);
  }
  const handleRetry = () => {
    setRetry(!retry);
  }
  return (
    visibility && <div id="kiddownparnter">
      <KidHeader goBack={handleGoBack} />
      <DownLoadPartner key={retry} asComponent={asComponent} onFinish={onFinish} dataSource={parseCourseList} folderName={moduleName} prot={9123} dispatch={props.dispatch} onRetry={handleRetry} />
    </div>
  )
}
function mapStateToProps({ kiddownpartnermodel }) {
  return { kiddownpartnermodel };
}
export default connect(mapStateToProps)(KidDownPartner);
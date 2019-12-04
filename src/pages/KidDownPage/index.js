import React, { useEffect } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import KidHeader from 'components/kidHeader';
import ZmAlert from 'components/zmAlert';
import DownLoading from '../KidMindLesson/downLoading.js';
import './style.scss';

const data1 = {
  id: "courseware.math-l1-spacething",
  url: "http://rs.hdkj.zmlearn.com/zip/spacething-07171826.zip",
  version: "spacething-07171825",
}

function KidDownPage(props) {
  console.log('props', props)
  const { data } = props.location.state;
  const { shareData, parseCourseList } = data;

  const isOk = () => {
    const { dispatch } = props;
    dispatch(routerRedux.push(
      {
        pathname: '/kid/kidmindlesson',
        state: {
          from: '/kid/kiddownpage',
        },
      },
    ));
  }

  const handleGoBack = () => {
    const download = {
      message: '正在下载课件进入教室，确定返回吗？',
      className: `download ${asComponent?'studyPark':''}`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => { isOk() },
      onCancel: () => { console.log('no'); },
    };
    ZmAlert(download);
  }

  return (
    <div id="kiddownpage">
      <KidHeader goBack={handleGoBack} center="AI互动课"/>
      <DownLoading dataSource={parseCourseList} shareData={shareData} folderName="zmg" prot={9123} />
    </div>
  )
}

function mapStateToProps({ kiddownpagemodel }) {
  return { kiddownpagemodel };
}

export default connect(mapStateToProps)(KidDownPage);
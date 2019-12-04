import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Config } from 'utils/config';
import { AppLocalStorage } from 'utils/localStorage';
import DownLoadPartner from '../KidDownPartner/index';
import {DataPersistence} from 'utils/helpfunc';
import './style.scss';

class KidFriends extends React.Component {
  state = {
    path: '',
    showDownload:false,
    downloadInfo:{}
  }

  componentDidMount() {
    window.addEventListener('message', this.IframeListener, false);
    this.setPartnerPath();
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.IframeListener, false);
  }

  getGender = () => {
    switch (AppLocalStorage.getUserInfo().stuGender) {
      case '女':
        return 0;
      case '男':
        return 1;
      default:
        return -1;
    }
  }

  IframeListener = (e) => {
    const {action,data} = e.data;
    const {dispatch} = this.props;
    if (action === 'getUserInfo') {
      window.frames[0].postMessage({
        action: 'setUserInfo',
        data: {
          token: AppLocalStorage.getOauthToken(),
          name: AppLocalStorage.getUserInfo().name,
          avatar: AppLocalStorage.getUserInfo().avatar,
          gender: this.getGender(),
          userId: AppLocalStorage.getUserInfo().userId,
        },
      }, '*');
    }
    if (action === 'logoutPartner') {
      dispatch(routerRedux.push(
        {
          pathname: this.state.path||'/kid',
          state: {
            from: '/kid/kidFriends',
          },
        },
      ));
    }
    //学习乐园页面加载完成
    if(action === 'showGame'){
      //关闭下载界面
    }
    //子模块下载信息
    if(action === 'requestDownloadZip'){
      if(data){
        const parseCourseList = {
          id:data.id,
          version:data.version,
          manifest:data.url,
          ...data
        }
        const extraInfo = {
          moduleName:'studypark',
          downloadMsg:'正在加载学习乐园所需资源，确认退出吗？',
          folderName:'studypark'
        }
        this.setState({downloadInfo:{parseCourseList,...extraInfo},showDownload:true});
      }
      // dispatch(routerRedux.push({
      //   pathname: '/kid/kiddownpartner',
      //   state: {
      //     from: '/kid/kidFriends',
      //     data: {
      //       parseCourseList: {},
      //       moduleName:'studypark-submodule',
      //       downloadMsg:'正在进入学习乐园，确定退出吗？'
      //     }
      //   }
      // }));
    }
    //学习乐园本地存储
    if(action === 'setUserDefaults'){
      if(data){
        DataPersistence.setItem(data.key,data.value);
      }
    }
    if(action === 'getUserDefaults'){
      const value = DataPersistence.getItem(data.key);
      window.frames[0].postMessage({
        action:'userDefaults',
        data:{
          key:data.key,
          value
        }
      },'*');
    }
    //退出乐园
    if(action === 'logoutGame'){
      dispatch(routerRedux.push(
        {
          pathname: '/kid',
          state: {
            from: '/kid/kidFriends',
          },
        },
      ));
    }
  }

  getHost = () => {
    const { host } = window.location;
    switch (host) {
      case 'chat.zmlearn.com':
        return 'prod';
      case 'chat.uat.zmops.cc':
        return 'uat';
      case 'x-chat-test.zmlearn.com':
        return 'test';
      case 'x-chat-dev.zmlearn.com':
        return 'dev';
      default:
        return 'test';
    }
  };
  onFinish = (code) => {
    if(code === undefined){
      this.setState({ showDownload: false });
      return;
    }
    const {parseCourseList,moduleName,onlineUrl} = this.state.downloadInfo;
    const token = AppLocalStorage.getOauthToken();
    const userInfo = AppLocalStorage.getUserInfo()||{};
    let postData = {
      action: 'downloadZipCompleted',
      code: 4,
      message: '',
      data: {
        id: String(parseCourseList.id),
        localUrl: ''
      }
    }
    let data = {};
    let path = '';
    if (code === 0) {
      //下载成功
      postData.code = 0;
      postData.message = "下载成功";
      if(moduleName === 'studypark'){
          path = `${localStorage.getItem('localResourcesLocalServer')}zmcourse/${moduleName}/${parseCourseList.id}/${parseCourseList.version}/index.html?device=PC&msgSendModle=post&userId=${userInfo.userId}&token=${token}`
      }
    } else {
      postData.code = code;
      if(code === 1){
        postData.message = "磁盘不足";
      }else if (code ===4){
        postData.message = 'WEB端需使用线上资源';
      }
      else{
        postData.message = "其他错误";
      }
    }
    postData.data.localUrl = path;
    //通知乐园使用线上资源
    window.frames[0].postMessage(postData,'*');
    this.setState({ showDownload: false });
  }
  handleGoBack = () => {
    const { dispatch } = this.props;
    DataPersistence.close();
    dispatch(routerRedux.push(
      {
        pathname: '/kid',
        state: {
          from: '/kid/kidFriends',
        },
      },
    ));
  }

  setPartnerPath = () => {
    const { data } = this.props.location.state;
    const { dataSource, loadInfo, moduleType } = data;
    const {onlineUrl,id,version} = dataSource;
    const token = AppLocalStorage.getOauthToken();
    const userInfo = AppLocalStorage.getUserInfo()||{};
    let path = '';
    if(moduleType === 'studypark'){
      path = `${onlineUrl}?device=PC&msgSendModle=post&userId=${userInfo.userId}&token=${token}`;
      if(loadInfo.code === 0 && onlineUrl){
        path = `${localStorage.getItem('localResourcesLocalServer')}zmcourse/${moduleType}/${id}/${version}/index.html?device=PC&msgSendModle=post&userId=${userInfo.userId}&token=${token}`
      }
    }else if (moduleType === 'partner'){
      path = `${Config.game}/web-mobile/index.html?device=PC&msgSendModle=post&env=${this.getHost()}`;
      if(loadInfo.code === 0){
        path = `${localStorage.getItem('localResourcesLocalServer')}zmcourse/${moduleType}/${id}${version}/web-mobile/index.html?device=PC&msgSendModle=post&env=${this.getHost()}&local=true`;
      }
    }
    if(this.state.path){
      return;
    }
    this.setState({ path });
  }

  render() {
    const { path,showDownload,downloadInfo } = this.state;
    return (
      <React.Fragment>
      {showDownload&&<DownLoadPartner asComponent={true} {...downloadInfo} onFinish={this.onFinish}/>}
      <div id="kidFriends" style={{display:showDownload?'none':'block'}}>
        <div className="friends-content">
          <iframe
            ref={(dom) => {
              if (dom) {
                this.dom = dom;
              }
            }}
            onLoad={() => {
              window.addEventListener('message', this.IframeListener, false);
            }}
            src={path}
            width="100%"
            height="100%"
            frameBorder="no"
            marginWidth="0"
            marginHeight="0"
            scrolling="yes"
            allowtransparency="yes"
            allowFullScreen={true}
          />
        </div>
      </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps({ KidFriendsModel }) {
  return { KidFriendsModel };
}

export default connect(mapStateToProps)(KidFriends);

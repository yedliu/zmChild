import React from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { AppLocalStorage } from 'utils/localStorage';
import { isSupportNewLoginWin, openNewLoginWin, getClientVersion } from 'utils/nativebridge';
import { uploadSession, clickVoice } from 'utils/helpfunc';
import KidHeader from 'components/kidHeader';
import ZmTab from 'components/zmModal/index';

import Config from 'utils/config';
import './settings.scss';

import avatar from './image/home_img_photo_default@2x.png';
import avatar_boy from './image/photo_boy_110@2x.png';
import avatar_girl from './image/photo_girl_110@2x.png';

const roleName = {
  seller: '销售',
  student: '学生',
  watcher: '老师',
  teacher: '老师',
};

class KidSettings extends React.Component {
  constructor(props) {
    super(props);
    ['handleQuit', 'handleOkDialog', 'handleCancelDialog'].forEach(f => this[f] = this[f].bind(this));

    this.state = {
      dialogVisible: false,
      dialogContent: '',
      dialogType: '',
      dialogRole: '',
      activeRole: 'student',
      roleList: [],
    };
  }

  componentDidMount() {
    const roleList = AppLocalStorage.getRoleList();
    const activeRole = AppLocalStorage.getRole();
    const activeRoleIndex = roleList.indexOf(activeRole);
    this.setState({
      roleList: roleList.length > 2 ? this.swapItem(roleList, activeRoleIndex, 1) : roleList,
      activeRole,
    });
  }

  handleQuit() {
    clickVoice();
    this.setState({
      dialogVisible: true,
      dialogContent: '确认登出当前的账号吗？',
      dialogType: 'logout',
    });
  }

  handleOkDialog() {
    clickVoice();
    this.setState({
      dialogVisible: false,
    }, async () => {
      if (this.state.dialogType === 'logout') {
        uploadSession();
        localStorage.removeItem('user.password');
        localStorage.removeItem('user.mobile');
        localStorage.removeItem('NavIndex');
        localStorage.removeItem('subjectCode');
        localStorage.removeItem('remember-login-password');
        localStorage.removeItem('loginType');
        // 移除用户屏幕分辨率的数据统计便是
        localStorage.removeItem('screenAcc');
        sessionStorage.removeItem('REACT_HISTORIES_KEY');
        AppLocalStorage.removeIsLogin();
        AppLocalStorage.removeUserInfo();
        AppLocalStorage.removeTocken();
        if (window.NativeLogin) {
          window.NativeLogin('logout');
        } else if (isSupportNewLoginWin()) {
          openNewLoginWin();
          return;
        }
        location.href = '/';
      } else if (this.state.dialogType === 'changerole') {
        // 发接口
        const res = await this.props.dispatch({ type: 'kidSettingsModel/getBasicInfoByRole', payload: { role: this.state.dialogRole } });
        if (res.code === '0') {
          const index = this.state.roleList.indexOf(this.state.dialogRole);
          let { roleList } = this.state;
          roleList = this.swapItem(roleList, index, 1);

          this.setState({
            roleList,
            activeRole: this.state.dialogRole,
          });
          // 排序设置到locastorage里面
          const storageRoleList = [...new Set([this.state.dialogRole, ...roleList])];
          const userInfo = AppLocalStorage.getUserInfo();
          AppLocalStorage.setLastLoginRoleByMobile(userInfo.mobile, this.state.dialogRole);
          // 过滤空值
          const resData = res.data;
          for (const prop in resData) {
            if (resData.hasOwnProperty(prop)) {
              const resProp = resData[prop];
              if (resProp === '' || resProp === null || resProp === undefined) {
                delete resData[prop];
              }
            }
          }
          AppLocalStorage.setUserInfo({ ...userInfo, ...resData });
          AppLocalStorage.setRoleList(storageRoleList.join(';'));
          location.href = '/';
        }
      }
    });
  }

  swapItem(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  }

  handleCancelDialog() {
    clickVoice();
    this.setState({
      dialogVisible: false,
    });
  }

  handleChangeRole(item) {
    clickVoice();
    if (item === this.state.activeRole) return;
    this.setState({
      dialogVisible: true,
      dialogContent: `确认切换为${roleName[item]}账号吗？`,
      dialogType: 'changerole',
      dialogRole: item,
    });
  }

  handleGoBack = () => {
    const { dispatch } = this.props;
    clickVoice();
    dispatch(routerRedux.push(
      {
        pathname: '/kid',
        state: {
          from: '/kid/settings',
        },
      },
    ));
  }

  render() {
    const { dispatch } = this.props;
    const version = getClientVersion();
		const userInfo = AppLocalStorage.getUserInfo();
		const defaultAvatar = {
			backgroundImage: `url(${userInfo.sex == 0 ? avatar_girl : avatar_boy})`
		}
    return (
      <div id="kidSettings">
        <KidHeader goBack={this.handleGoBack} center="设置" />
        <div className="setting-box">
          <div className="setting-content">
            <div className="roles">
              {
                this.state.roleList.map((item, index) => {
                  return (
                    <dl className={`avatar-box ${this.state.activeRole === item ? 'active' : ''} ${this.state.roleList.length === 1 ? 'no-bgc' : ''}`} key={index} onClick={() => this.handleChangeRole(item)}>
											<dt className="avatar">
												<div style={defaultAvatar}>
													<img src={userInfo.avatar} alt="" />
												</div>
												</dt>
                      <dd className="name">{userInfo && userInfo.name}</dd>
                      <dd className="role">{roleName[item]}</dd>
                    </dl>
                  );
                })
              }
            </div>
            <div className="btn-group">
              <button onClick={() => { clickVoice(); dispatch(routerRedux.push('/kid/modifypass')); }}>修改密码</button>
              <button onClick={this.handleQuit}>退出</button>
            </div>
            <p className="version">
              V
              {version}
            </p>
          </div>
        </div>

        <ZmTab visible={this.state.dialogVisible}>
          <div className="setting-dialog">
            <div className="dialog-content">
              <p>{this.state.dialogContent}</p>
            </div>
            <div className="dialog-footer">
              <button className="cancel" onClick={this.handleCancelDialog}>取消</button>
              <button className="ok" onClick={this.handleOkDialog}>确定</button>
            </div>
          </div>
        </ZmTab>
      </div>
    );
  }
}

function mapStateToProps({ kidSettingsModel }) {
	return { kidSettingsModel };
}

export default connect(mapStateToProps)(KidSettings);

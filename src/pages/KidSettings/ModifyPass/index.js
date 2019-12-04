import React from 'react';
import { connect } from 'dva';
import { isSupportNewLoginWin, openNewLoginWin } from 'utils/nativebridge';
import { AppLocalStorage } from 'utils/localStorage';
import Config from 'utils/config';
import KidMessage from 'components/KidMessage';
import KidHeader from 'components/kidHeader';

import './modifypass.scss';

const defaultFormItems = {
  defaultPwd: {
    placeholder: '请输入原密码',
    showText: false,
    value: '',
  },
  newPwd: {
    placeholder: '设置密码，不少于8位',
    showText: false,
    value: '',
  },
  comfirmNewPwd: {
    placeholder: '再次输入密码',
    showText: false,
    value: '',
  },
};

class ModifyPass extends React.Component {
  constructor(props) {
    super(props);
    ['handleMackClick'].forEach(f => this[f] = this[f].bind(this));

    this.state = {
      messagetype: '',
      messagecontent: '',
      canSubmit: false,
      formItems: JSON.parse(JSON.stringify(defaultFormItems)),
    };
  }

  passwordValidate(password) {
    return password.length >= 8 && password.length <= 30;
  }

  formValidate(formItems) {
    return !!formItems.defaultPwd.value && this.passwordValidate(formItems.newPwd.value) && formItems.newPwd.value === formItems.comfirmNewPwd.value;
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (!this.state.formItems.defaultPwd.value) {
      this.setState({
        messagetype: 'error',
        messagecontent: '请输入原密码',
      });

      return;
    }
    if (!this.state.formItems.newPwd.value || !this.state.formItems.comfirmNewPwd.value || (this.state.formItems.newPwd.value !== this.state.formItems.comfirmNewPwd.value) || !this.passwordValidate(this.state.formItems.newPwd.value)) {
      this.setState({
        messagetype: 'error',
        messagecontent: '新密码格式不正确',
      });

      return;
    }
    const { mobile } = AppLocalStorage.getUserInfo();
    const oldPasswd = this.state.formItems.defaultPwd.value;
    const newPasswd = this.state.formItems.newPwd.value;
    const repeatPasswd = this.state.formItems.comfirmNewPwd.value;
    const exitLogin = () => {
      // localStorage.removeItem('user.password');
      // localStorage.removeItem('user.mobile');
      // localStorage.removeItem('NavIndex');
      // localStorage.removeItem('subjectCode');
      // AppLocalStorage.removeIsLogin();
      // AppLocalStorage.removeUserInfo();
      // AppLocalStorage.removeTocken();
      // location.href = Config.apiurl;
      localStorage.removeItem('user.password');
      localStorage.removeItem('user.mobile');
      localStorage.removeItem('NavIndex');
      localStorage.removeItem('subjectCode');
      localStorage.removeItem('remember-login-password');
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
    };
    // 提交新密码
    const res = await this.props.dispatch({ type: 'kidSettingsModel/changePasswd', payload: { mobile, oldPasswd, newPasswd, repeatPasswd } });
    if (res.code === '1') {
      this.setState({
        messagetype: 'success',
        messagecontent: '密码修改成功啦~',
        formItems: defaultFormItems,
      });

      setTimeout(() => {
        exitLogin();
        // AppLocalStorage.removeIsLogin();
        // AppLocalStorage.removeUserInfo();
        // AppLocalStorage.removeTocken();
        // //清除登录数据并跳到登录页
        // localStorage.removeItem('user.password');
        // localStorage.removeItem('user.mobile');
        // localStorage.removeItem('NavIndex');
        // localStorage.removeItem('subjectCode');
        // if (window.NativeLogin) {
        //   window.NativeLogin('logout');
        // } else if (isSupportNewLoginWin()) {
        //   openNewLoginWin();
        //   return;
        // }
        // location.href = '/';
        // // if (window.location.host.indexOf('localhost') > -1) {
        // //   location.href = '/';
        // // } else {
        // //   window.onbeforeunload = null;
        // //   location.href = Config.apiurl;
        // // }
      }, 1000);
    } else {
      this.setState({
        messagetype: 'error',
        messagecontent: res.message || '修改失败',
      });
    }
  }

  handleMackClick() {
    this.setState({
      messagetype: '',
      messagecontent: '',
    });
  }

  handlePwdChange(e, type) {
    const formItems = JSON.parse(JSON.stringify(this.state.formItems));
    formItems[type].value = e.target.value.trim();
    this.setState({
      canSubmit: this.formValidate(formItems),
      formItems,
    });
  }

  togglePwdText(type) {
    const formItems = JSON.parse(JSON.stringify(this.state.formItems));
    formItems[type].showText = !this.state.formItems[type].showText;
    this.setState({
      canSubmit: this.formValidate(formItems),
      formItems,
    });
  }

  render() {
    const { history } = this.props;
    return (
      <div id="modifyPass">
        <KidHeader history={history} center="修改密码" />
        <div className="modify-content">
          <form onSubmit={e => this.handleSubmit(e)}>
            {
              Object.keys(this.state.formItems).map((item, index) => {
                return (
                  <div className="form-item" key={index}>
                    <input maxLength="30" autoComplete="off" type={this.state.formItems[item].showText ? 'text' : 'password'} value={this.state.formItems[item].value} placeholder={this.state.formItems[item].placeholder} onChange={e => this.handlePwdChange(e, item)} />
                    <i className={this.state.formItems[item].showText ? 'open' : 'close'} onClick={() => this.togglePwdText(item)} />
                  </div>
                );
              })
            }
            <div className="form-item custom">
              <button className={`submit-btn ${this.state.canSubmit ? '' : 'disable'}`}>确认修改</button>
            </div>
          </form>
        </div>
        <KidMessage messagecontent={this.state.messagecontent} messagetype={this.state.messagetype} maskClick={() => this.handleMackClick()} />
      </div>
    );
  }
}

function mapStateToProps({ kidSettingsModel }) {
  return { kidSettingsModel };
}

export default connect(mapStateToProps)(ModifyPass);

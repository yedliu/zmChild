import './style.scss';
import React, { Component } from 'react';
import { connect } from 'dva';
import Config from 'utils/config';
import { messages } from './constants';


class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobile: '',
      password: '',
    };
  }

  handleMobile = (e) => {
    this.setState({ mobile: e.target.value });
  }

  handlePassword = (e) => {
    this.setState({ password: e.target.value });
  }

  handlePress = (e) => {
    if (e.key === 'Enter') {
      this.handleLogin();
    }
  }

  handleLogin = () => {
    const { mobile, password } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'LoginModule/getRoleList',
      payload: {
        mobile,
        password,
      },
    });
  }

  render() {
    const { LoginModule } = this.props;
    const { errmessage, isLogin, loading } = LoginModule;
    return (
      <div id="login">
        <div className="logo" />
        <div className="formwrapper">
          <div className="messagetip">
            <span>{isLogin ? messages.success : errmessage}</span>
          </div>
          <div className="row">
            <input type="text" placeholder="手机" name="mobile" onChange={this.handleMobile} />
          </div>
          <div className="row">
            <input type="password" placeholder="密码" name="password" onChange={this.handlePassword} onKeyPress={e => this.handlePress(e)} />
          </div>
          <div className="buttonrow" onClick={this.handleLogin}>
            <div className={`click-login ${loading ? 'loading-style' : ''}`}>
                登录
              {loading ? '..' : ''}
            </div>
            {loading ? <div className="loading" /> : ''}
          </div>
          <div className="forget-password">
            <a href={`${Config.officeurl}/forgot-password`} target="_blank">
              忘记密码
            </a>
          </div>
        </div>
      </div>
    );
  }
}

// Login.propTypes = {
//   LoginModule: PropTypes.object,
// };

function mapStateToProps({ LoginModule }) {
  return { LoginModule };
}

export default connect(mapStateToProps)(Login);

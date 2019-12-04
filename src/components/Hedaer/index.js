import React, { Component } from 'react';
import { minHomeWin, blockWin, closeApp, closeHome } from 'utils/nativebridge';
import { isWin } from 'utils/helpfunc.js';
import { isSupportNewLoginWin, isMacPlatform } from 'utils/nativebridge.js';
import ZmModal from 'components/zmModal';
import './style.scss';

class Header extends Component {
  state = {
    ctrlWin: true, // 控制放大缩小
    closeWin: false, // 控制退出客户端
  }

  handleClickSmallClient = () => {
    minHomeWin();
  }

  handleClickBigClient = () => {
    const isMac = isMacPlatform();
    this.setState({ ctrlWin: !this.state.ctrlWin }, () => {
      const { ctrlWin } = this.state;
      const { remote } = window.require('electron');
      const browserWindow = remote.getCurrentWindow();
      if (!ctrlWin) {
        isMac ? browserWindow.setFullScreen(false) : browserWindow.setSize(1170, 660);

      } else {
        isMac ? browserWindow.setFullScreen(true) : browserWindow.maximize();
      }
    });
  }

  handleClickCloseClient = () => {
    this.setState({ closeWin: true });
    // window.nativeProps.dispatch(setwinAlertMessageIsOpenAction(true));
  }

  handleCancel = () => {
    this.setState({ closeWin: false });
  }

  handleConfime = () => {
    // setTimeout(() => {
    //   blockWin(false);
    //   localStorage.removeItem('NavIndex');
    //   localStorage.removeItem('subjectCode');
    //   localStorage.removeItem('remember-login-password');
    //   closeApp();
    // }, 500);

    blockWin(false);
    localStorage.removeItem('NavIndex');
    localStorage.removeItem('subjectCode');
    localStorage.removeItem('remember-login-password');
    // 移除用户屏幕分辨率的数据统计便是
    localStorage.removeItem('screenAcc');
    sessionStorage.removeItem('REACT_HISTORIES_KEY');
    closeHome();
  }

  renderCloseWin = () => {
    return (
      <div id="quit">
        <div className="ellipse" />
        <div className="title">是否确认退出掌门客户端？</div>
        <div className="buttons">
          <div className="yes" onClick={this.handleConfime}>确认</div>
          <div className="no" onClick={this.handleCancel}>取消</div>
        </div>
      </div>
    );
  }

  render() {
    const isShowWin = isWin() && isSupportNewLoginWin();
    const isMac = isMacPlatform();
    const { closeWin, ctrlWin } = this.state;
    if (isShowWin) {
      return (
        <div id="top-header">
          <div className="header-left">
            <div className="logo" />
            <div className="text">掌门少儿</div>
          </div>
          <div className="header-right">
            <div className="small" onClick={this.handleClickSmallClient} />
            <div className="big" onClick={this.handleClickBigClient} />
            <div className="close" onClick={this.handleClickCloseClient} />
          </div>
          {
            closeWin
            && (
              <ZmModal visible={closeWin}>
                {this.renderCloseWin()}
              </ZmModal>
            )
          }
        </div>
      );
    }

    if (isMac) {
      return (
        <div className="mac-header">
          <div className="header-right">
            <div className="close" onClick={this.handleClickCloseClient} />
            <div className="small" onClick={this.handleClickSmallClient} />
            <div className={ctrlWin?"big":"big-s"} onClick={this.handleClickBigClient} />
          </div>

          <div className="header-left">
            <div className="logo" />
            <div className="text">掌门少儿</div>
          </div>

          <div className="header-null" />
          {
            closeWin
            && (
              <ZmModal visible={closeWin}>
                {this.renderCloseWin()}
              </ZmModal>
            )
          }
        </div>
      )
    }
    return null;
  }
}

export default Header;

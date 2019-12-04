import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { preLoadImg } from './server';
import openIcon from './images/icon_fangda.svg';
import miniIcon from './images/icon_suoxiao.svg';
import closeIcon from './images/icon_close.svg';
import fileIcon from './images/img_kejian_zmg.svg';
import errorIcon from './images/icon_fail2.svg';
import successIcon from './images/icon_success.svg';
import './downloadPannel.scss';

const ERRORMESSAGE = {
  '-1': '下载失败',
  '-2': '下载失败',
  '-3': '网络异常，下载失败',
  '-5': '网络异常，下载失败',
  '-6': '磁盘已满，下载失败',
};

export default class CoursewareDownloadPannel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      miniState: false,
      hidden: false,
    };
  }

  componentDidMount() {
    preLoadImg([successIcon, errorIcon, fileIcon, closeIcon, miniIcon, openIcon]);
  }

  handleMiniStateChange = () => {
    this.setState({ miniState: !this.state.miniState });
  }

  handleCloseAction = () => {
    this.setState({ hidden: true });
  }

  handleDownloadLocalZmg = () => {
    this.props.handleDownloadLocalZmg();
  }

  makeResetDownloadInfo = (fileList) => {
    const currentItem = fileList.filter(list => list.loadInfo && list.loadInfo.code < 0)[0];
    const currentCode = currentItem && currentItem.loadInfo && currentItem.loadInfo.code || '-1';
    return (
      <div className="resetInfo">
        <span className="warningInfo">{ERRORMESSAGE[`${currentCode}`]}</span>
        <span className="resetTodo" onClick={this.handleDownloadLocalZmg}>重试</span>
      </div>
    );
  }

  makeInnerTopContain = (visible, errorSome, fileList, miniState) => {
    if (visible) {
      if (miniState) {
        return '';
      } if (errorSome && fileList.length >= 2) {
        return this.makeResetDownloadInfo(fileList);
      }
      return <p className="text">下载的课件是今日上课所用到的ZMG课件哦</p>;
    }
    return '';
  }

  makeLoadedText = (fileList, currentDownloadIndex) => {
    const errorInfo = fileList.filter(list => list.loadInfo && list.loadInfo.code < 0).length > 0;
    const successInfo = fileList.every(list => list.loadInfo && list.loadInfo.code === 0);
    const len = fileList.length;
    if (errorInfo) {
      return (
        <div className="finalInfo">
          <img src={errorIcon} alt="" />
          <strong>下载失败</strong>
        </div>
      );
    } if (successInfo) {
      return (
        <div className="finalInfo">
          <img src={successIcon} alt="" />
          <strong>下载成功</strong>
        </div>
      );
    } if (len === 1) {
      return <span>正在下载1个课件</span>;
    } if (len > 1) {
      return (
        <span>
          正在下载
          {currentDownloadIndex + 1}
          /
          {len}
          课件
        </span>
      );
    }
    return '';
  }

  maleLoadInfoContent = (item, fileList) => {
    const errorSome = fileList.some(list => list.loadInfo && list.loadInfo.code < 0);
    const lenState = fileList.length && fileList.length >= 2 && errorSome;
    const loadInfoCode = item.loadInfo && item.loadInfo.code;
    if (loadInfoCode === 1) {
      return (
        <div className="infoProgress">
          <div className="range">
            <div className="progress" style={{ width: `${item.rate}%` }} />
          </div>
          <div className="progress">
            <span>下载中...</span>
            <span className="rate">{`${item.rate || 0}%`}</span>
          </div>
        </div>
      );
    } if (loadInfoCode === 0) {
      return <span className="success">下载成功</span>;
    } if (loadInfoCode < 0) {
      return (
        <div className="infoErr">
          <span className="error" style={{ color: lenState ? '#666' : '' }}>
            {lenState ? '未下载' : ERRORMESSAGE[`${loadInfoCode}`]}
          </span>
          <span className="reset" onClick={this.handleDownloadLocalZmg}>{lenState ? '' : '重试'}</span>
        </div>
      );
    }
    return (
      <span className="common" style={{ color: lenState ? '#666' : '' }}>
        {fileList.length === 1 ? '下载中...' : (lenState ? '未下载' : '排队等待...')}
      </span>
    );
  }

  makeFileListItem = (fileList) => {
    return fileList.map((item, index) => {
      return !item.notShow ? (
        <div className="listItem" key={index}>
          <img src={fileIcon} alt="zmg" />
          <span className="fileName">{item.name}</span>
          <span className="common">{item.totalSize ? `${item.totalSize}M` : ''}</span>
          <div className="info">
            {this.maleLoadInfoContent(item, fileList)}
          </div>
        </div>
      ) : null;
    });
  }

  render() {
    const { fileList, fetchError, visible, currentDownloadIndex } = this.props;
    if (!visible) return null;
    const { miniState, hidden } = this.state;
    if (hidden) {
      return false;
    }
    const errorSome = fileList.some(list => list.loadInfo && list.loadInfo.code < 0);
    const successEvery = fileList.every(list => list.loadInfo && list.loadInfo.code === 0);
    return (
      <div className="pannelContainer">
        <div className="pannelHeader">
          <div className="downloadStatus">
            {this.makeLoadedText(fileList, currentDownloadIndex)}
          </div>
          <div className="controlButtons">
            <span onClick={this.handleMiniStateChange}>
              <img src={miniState ? openIcon : miniIcon} alt="隐藏" />
            </span>
            {
              (errorSome || successEvery || fetchError)
                ? (
                  <span className="closeButton" onClick={this.handleCloseAction}>
                    <img src={closeIcon} alt="关闭" />
                  </span>
                )
                : null
            }
          </div>
        </div>
        <div className="pannelBody" />
        {this.makeInnerTopContain(visible, errorSome, fileList, miniState)}
        <div className="pannelCoursewareList" style={{ display: miniState ? 'none' : 'block' }}>
          {this.makeFileListItem(fileList)}
        </div>
      </div>
    );
  }
}

CoursewareDownloadPannel.propTypes = {
  visible: PropTypes.bool.isRequired,
  fileList: PropTypes.array.isRequired,
  fetchError: PropTypes.bool.isRequired,
  currentDownloadIndex: PropTypes.number.isRequired,
  handleDownloadLocalZmg: PropTypes.func.isRequired,
};

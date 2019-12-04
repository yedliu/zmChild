import './kidAbilityReport.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import KidHeader from 'components/kidHeader';
import { LearningAbilityReport } from 'components/LearningAbilityReport';
import { routerRedux } from 'dva/router';
import { nativeGoBack, nativeGetGift, nativeShowPage } from 'utils/padCommon';
import KidAppointment from 'components/KidAppointment';
import { throttle } from 'utils/helpfunc';
import { AppLocalStorage } from '../../utils/localStorage';

class KidAbilityReport extends Component {
  static defaultProps = {
    KidAbilityReportModel: {},
  }

  static propTypes = {
    KidAbilityReportModel: PropTypes.object,
  }

  state = {
    currentMenuIndex: 0,
    reportScrollTop: 0,
    showModal: false,
    flagState: true,
  }

  componentWillMount() {
    this.getLearningAbilityResult();
    this.getIfPaid();
  }

  componentDidMount() {
    nativeShowPage();
    const { flagState } = this.state;
    this.setState({ flagState: !flagState });
    console.log('aaa');
  }

  getDoneLearningAbilityTest = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'KidAbilityReportModel/getDoneLearningAbilityTest',
    });
  }

  getIfPaid = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'KidAbilityReportModel/getIfPaid',
    });
  }

  getLearningAbilityResult = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'KidAbilityReportModel/getLearningAbilityResult',
    });
  }

  goBack = () => {
    const appName = AppLocalStorage.getAppName();
    if (appName === 'KidsPad') {
      nativeGoBack();
      return;
    }
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/kid',
      state: {
        from: '/kid/ability/report',
      },
    }));
  }

  getScale = () => {
    // 按照设计稿尺寸 1170*660 等比缩放
    const { clientWidth, clientHeight } = document.body;
    const appName = AppLocalStorage.getAppName();
    if (appName !== 'KidsPad') return;
    let scale = clientHeight / 730;
    if (clientWidth > 1440) {
      scale /= 1.2;
    }
    const scaleStyle = {
      transform: `scale(${scale})`,
    };
    return scaleStyle;
  }

  goRetry = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/kid/ability/test',
      state: {
        from: '/kid',
      },
    }));
  }

  getGift = () => {
    const appName = AppLocalStorage.getAppName();
    if (appName === 'KidsPad') {
      nativeGetGift();
    } else {
      this.setState({
        showModal: true,
      });
    }
  }

  renderRight = () => {
    const { ifPaid } = this.props.KidAbilityReportModel
    const u = navigator.userAgent
    const appName = AppLocalStorage.getAppName()
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    return (
      <div className="right-area">
        {
          ifPaid || (appName === 'KidsPad' && isiOS) ? ''
            : <div className="gift-btn" onClick={throttle(() => this.getGift(), 1000)} />
        }
        <div className="retry-btn" onClick={() => this.goRetry()}>重新测试</div>
      </div>
    )
  }

  handleScroll = (e) => {
    const { currentMenuIndex } = this.state;
    const srollTop = e.target.scrollTop;
    let menuIndex = 0;
    if (srollTop < 170) {
      menuIndex = 0;
    } else if (srollTop < 440) {
      menuIndex = 1;
    } else if (srollTop < 760) {
      menuIndex = 2;
    } else {
      menuIndex = 3;
    }
    if (menuIndex !== currentMenuIndex) {
      this.setState({
        currentMenuIndex: menuIndex,
      });
    }
  }

  clickMenu = (index) => {
    let scrollTop = 0;
    switch (index) {
      case 0:
        scrollTop = 1;
        break;
      case 1:
        scrollTop = 320;
        break;
      case 2:
        scrollTop = 655;
        break;
      case 3:
        scrollTop = 870;
    }
    this.setState({
      currentMenuIndex: index,
      reportScrollTop: scrollTop,
    }, () => {
      this.setState({
        reportScrollTop: 0,
      });
    });
  }

  render() {
    const { KidAbilityReportModel, history } = this.props;
    const { learningAbilityResult, dispatch } = KidAbilityReportModel;
    const { currentMenuIndex, reportScrollTop, showModal } = this.state;
    const scaleStyle = this.getScale();
    return (
      <div id="learning-ability" onScroll={e => this.handleScroll(e)}>
        <KidHeader history={history} center="学习力测评报告" goBack={() => this.goBack()} right={this.renderRight()} />
        <div className="report-container">
          <div className="report" style={scaleStyle}>
            <div className="menu-bar">
              <div className={currentMenuIndex === 0 ? 'menu-item active' : 'menu-item'} onClick={() => this.clickMenu(0)}>专注力</div>
              <div className={currentMenuIndex === 1 ? 'menu-item active' : 'menu-item'} onClick={() => this.clickMenu(1)}>记忆类型</div>
              <div className={currentMenuIndex === 2 ? 'menu-item active' : 'menu-item'} onClick={() => this.clickMenu(2)}>毅力</div>
              <div className={currentMenuIndex === 3 ? 'menu-item active' : 'menu-item'} onClick={() => this.clickMenu(3)}>思考能力</div>
            </div>
            <div className="report-dom-box">
              <LearningAbilityReport reportScrollTop={reportScrollTop} dispatch={dispatch} learningAbilityInfo={learningAbilityResult} header={false} />
            </div>
          </div>
          {
            showModal && <KidAppointment switchModelStat={() => this.setState({ showModal: false })} />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => { // 见名知意，把state转换为props
  // 可以打印state看看数据结构，然后放到data里
  const { KidAbilityReportModel } = state;
  return { KidAbilityReportModel };
};

export default connect(mapStateToProps)(KidAbilityReport);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { LearningAbilityReport } from 'components/LearningAbilityReport';
import { routerRedux } from 'dva/router';
import { nativeGoBack, nativeGetGift, nativeShowPage } from 'utils/padCommon';
import KidHeader from 'components/kidHeader';
import zmTip from 'components/zmTip';
import KidAppointment from 'components/KidAppointment';
import zmAlert from 'components/zmAlert';
import './kidLearningAbility.scss';
import { throttle } from 'utils/helpfunc';
import { AppLocalStorage } from '../../utils/localStorage';

class KidLearningAbility extends Component {
  static defaultProps = {
    KidLearningAbilityModel: {},
  }

  static propTypes = {
    KidLearningAbilityModel: PropTypes.object,
  }

  state = {
    currentMenuIndex: 0,
    reportScrollTop: 0,
    showModal: false,
    flagState: true,
    testing: false,
    questions: [],
    originPage: '',
    currentQuestionIndex: 0,
    urlTargetPage: '',
  }

  componentWillMount() {
    this.getDoneLearningAbilityTest();
    const { KidLearningAbilityModel } = this.props;
    const { questions } = KidLearningAbilityModel;
    const urlTargetPage = window.location.search.includes('report') ? 'report' : window.location.search.includes('test') ? 'test' : ''
    questions.forEach((item, index) => {
      item.answer ? delete item.answer : '';
    });
    this.setState({
      questions,
      urlTargetPage,
    });
    // if (window.location.href.split('?')[1] && window.location.href.split('?')[1].includes('personal')) {
    //   this.setState({
    //     originPage: 'personal',
    //   });
    // }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { originPage } = this.state;
    const { submitLearningAbilityResult } = nextProps.KidLearningAbilityModel;
    const oldSubmitLearningAbilityResult = this.props.KidLearningAbilityModel.submitLearningAbilityResult;
    if (submitLearningAbilityResult === oldSubmitLearningAbilityResult) return;
    if (submitLearningAbilityResult && submitLearningAbilityResult === 1) {
      const tip = {
        title: '提交成功啦',
        time: 2000,
        className: `partner${localStorage.getItem('partner')}`,
      };
      zmTip(tip);
      setTimeout(() => {
        // const appName = AppLocalStorage.getAppName();
        // if (appName === 'KidsPad' && originPage === 'personal') {
        //   nativeGoBack();
        //   return;
        // }
        // const { dispatch } = this.props;
        // dispatch(routerRedux.push({
        //   pathname: '/kid/learningAbility',
        //   search: 'target=report',
        //   state: {
        //     from: '/kid',
        //   },
        // }));
        this.setState({
          urlTargetPage: 'report',
        }, () => {
          this.getDoneLearningAbilityTest();
        });
      }, 2000);
    } else if (submitLearningAbilityResult && submitLearningAbilityResult === -1) {
      const alert = {
        title: '提交失败',
        message: '可能是网络异常导致提交失败，请检查网络',
        className: 'submit-error',
        okText: '知道啦',
        onOk: () => {
          const { dispatch } = this.props;
          dispatch({
            type: 'KidLearningAbilityModel/submitResultReset',
          });
        },
      };
      zmAlert(alert);
    }
  }

  componentDidMount() {
    nativeShowPage();
  }

  getDoneLearningAbilityTest = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'KidLearningAbilityModel/getDoneLearningAbilityTest',
    });
  }

  goBack = () => {
    const { targetPage } = this.props.KidLearningAbilityModel;
    const { urlTargetPage } = this.state;
    const targetPage_ = urlTargetPage || targetPage;
    if (targetPage_ === 'report') {
      this.defaultGoBack();
      return;
    }
    const alert = {
      message: '宝贝还没有完成学习力测评哦，确定要退出吗？',
      className: 'default',
      okText: '取消',
      cancelText: '退出',
      onOk: () => {
      },
      onCancel: () => {
        this.defaultGoBack();
      },
    };
    zmAlert(alert);
  }

  defaultGoBack = () => {
    const appName = AppLocalStorage.getAppName();
    if (appName === 'KidsPad') {
      nativeGoBack();
      return;
    }
    const { history } = this.props;
    history.goBack();
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
    const { questions } = this.state;
    questions.forEach((item, index) => {
      item.answer ? delete item.answer : '';
    });
    this.setState({
      urlTargetPage: 'test',
      questions,
      currentQuestionIndex: 0,
    });
    dispatch({
      type: 'KidLearningAbilityModel/submitResultReset',
    });
    // const { dispatch } = this.props;
    // const { originPage } = this.state;
    // const pathname = '/kid/learningAbility';
    // if (originPage === 'personal') {
    //   dispatch(routerRedux.push({
    //     pathname,
    //     search: 'target=test',
    //     state: {
    //       from: '/kid',
    //     },
    //     originPage: 'personal',
    //   }));
    // } else {
    //   dispatch(routerRedux.push({
    //     pathname,
    //     state: {
    //       from: '/kid',
    //     },
    //   }));
    // }
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
    const { targetPage, ifPaid } = this.props.KidLearningAbilityModel;
    const { urlTargetPage } = this.state;
    const targetPage_ = urlTargetPage || targetPage;
    if (targetPage_ !== 'report') {
      return null;
    }

    const u = navigator.userAgent;
    const appName = AppLocalStorage.getAppName();
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
    return (
      <div className="right-area">
        {
          ifPaid || (appName === 'KidsPad' && isiOS) ? ''
            : <div className="gift-btn" onClick={throttle(() => this.getGift(), 1000)} />
        }
        <div className="retry-btn" onClick={() => this.goRetry()}>重新测试</div>
      </div>
    );
  }

  startTest = () => {
    this.setState({
      testing: true,
    });
  }

  answerCheck = (index, answer, score) => {
    const { questions } = this.state;
    questions[index].answer = answer;
    questions[index].score = score;
    this.setState({
      questions,
    });
  }

  goLast = () => {
    const { currentQuestionIndex } = this.state;
    this.setState({
      currentQuestionIndex: currentQuestionIndex - 1,
    });
  }

  goNext = (answer, submit) => {
    if (!answer) {
      const tip = {
        title: '请选择答案',
        time: 1500,
        className: `sadpartner${localStorage.getItem('partner')}`,
      };
      zmTip(tip);
      return;
    }
    if (submit !== 'submit') {
      const { currentQuestionIndex } = this.state;
      this.setState({
        currentQuestionIndex: currentQuestionIndex + 1,
      });
    } else {
      this.handleSubmit();
    }
  }

  handleSubmit = () => {
    const { questions } = this.state;
    let result = '';
    questions.forEach((item, index) => {
      result += (item.score || 0);
      if (index < 14) {
        result += ',';
      }
    });
    const { dispatch } = this.props;
    const payload = {
      score: result,
    };
    dispatch({
      type: 'KidLearningAbilityModel/submitLearningAbility',
      payload,
    });
  }


  render() {
    const { history, KidLearningAbilityModel, dispatch } = this.props;
    const { targetPage, learningAbilityResult } = KidLearningAbilityModel;
    const { currentMenuIndex, showModal, reportScrollTop, testing, questions, currentQuestionIndex, urlTargetPage } = this.state;
    const scaleStyle = this.getScale();
    const currentQuestion = questions[currentQuestionIndex];
    const tergetPage_ = urlTargetPage || targetPage;
    return (
      <div id="learning-ability">
        <div className="cloud-left"></div>
        <div className="cloud-right"></div>
        <div className="bg-grassland">
          <div className="bg-grass-arc"></div>
        </div>
        <KidHeader history={history} center="学习力测评" goBack={() => this.goBack()} right={this.renderRight()} />
        {
          tergetPage_ === 'report'
            ? (
              <div className="report-container" onScroll={e => this.handleScroll(e)}>
                <div className="report" style={scaleStyle}>
                  <div className="menu-bar">
                    <div className={currentMenuIndex === 0 ? 'menu-item active' : 'menu-item'} onClick={() => this.clickMenu(0)}>
                      专注力
                    </div>
                    <div className={currentMenuIndex === 1 ? 'menu-item active' : 'menu-item'} onClick={() => this.clickMenu(1)}>
                      记忆类型
                    </div>
                    <div className={currentMenuIndex === 2 ? 'menu-item active' : 'menu-item'} onClick={() => this.clickMenu(2)}>
                      毅力
                    </div>
                    <div className={currentMenuIndex === 3 ? 'menu-item active' : 'menu-item'} onClick={() => this.clickMenu(3)}>
                      思考能力
                    </div>
                  </div>
                  <div className="report-dom-box">
                    <LearningAbilityReport
                      reportScrollTop={reportScrollTop}
                      dispatch={dispatch}
                      learningAbilityInfo={learningAbilityResult}
                      header={false}
                    />
                  </div>
                </div>
                {
                  showModal && <KidAppointment switchModelStat={() => this.setState({ showModal: false })} />
                }
              </div>
            ) : tergetPage_ === 'test'
              ? (
                <div className="test-container">
                  {
                  !testing
                    ? (
                      <div className="guide" style={scaleStyle}>
                        <div className="text-area">
                          <p>
                            亲爱的小朋友：
                          </p>
                          <p>
                            欢迎来到学习力测评，在这里你将会看到一些与学习相关的问题，请根据你的实际情况作答哦～
                          </p>
                          <div className="start-btn" onClick={() => this.startTest()}>开始答题</div>
                        </div>
                      </div>
                    )
                    : (
                      <div className="test-main" style={scaleStyle}>
                        <div className="page-show">
                          {currentQuestionIndex + 1}
                          /15
                        </div>
                        <div className="question-main">
                          <div className="stem">
                            【单选题】
                            {currentQuestion.stem}
                          </div>
                          {
                            currentQuestionIndex !== 11
                              ? (
                                <div className="options">
                                  <div
                                    className={currentQuestion.answer === 'A' ? 'option selected' : 'option'}
                                    onClick={() => this.answerCheck(currentQuestionIndex, 'A', currentQuestion.options[0].score)}
                                  >
                                    A、
                                    {currentQuestion.options[0].content}
                                  </div>
                                  <div
                                    className={currentQuestion.answer === 'B' ? 'option selected' : 'option'}
                                    onClick={() => this.answerCheck(currentQuestionIndex, 'B', currentQuestion.options[1].score)}
                                  >
                                    B、
                                    {currentQuestion.options[1].content}
                                  </div>
                                  <div
                                    className={currentQuestion.answer === 'C' ? 'option selected' : 'option'}
                                    onClick={() => this.answerCheck(currentQuestionIndex, 'C', currentQuestion.options[2].score)}
                                  >
                                    C、
                                    {currentQuestion.options[2].content}
                                  </div>
                                </div>
                              )
                              : (
                                <div className="options-img">
                                  <div className="img-box">
                                    <div className="item-box">
                                      <div className="content green rhombus" />
                                    </div>
                                    <div className="item-box">
                                      <div className="content purple circle" />
                                    </div>
                                    <div className="item-box" />
                                    <div className="item-box">
                                      <div className="content yellow circle" />
                                    </div>
                                    <div className="item-box">
                                      <div className="content green" />
                                    </div>
                                    <div className="item-box">
                                      <div className="content purple rhombus" />
                                    </div>
                                    <div className="item-box">
                                      <div className="content purple" />
                                    </div>
                                    <div className="item-box">
                                      <div className="content yellow rhombus" />
                                    </div>
                                    <div className="item-box">
                                      <div className="content green circle" />
                                    </div>
                                  </div>
                                  <div className="options-list">
                                    <div
                                      className={currentQuestion.answer === 'A' ? 'option selected' : 'option'}
                                      onClick={() => this.answerCheck(currentQuestionIndex, 'A', currentQuestion.options[0].score)}
                                    >
                                      A、
                                      <div className="content yellow" />
                                    </div>
                                    <div
                                      className={currentQuestion.answer === 'B' ? 'option selected' : 'option'}
                                      onClick={() => this.answerCheck(currentQuestionIndex, 'B', currentQuestion.options[1].score)}
                                    >
                                      B、
                                      <div className="content yellow rhombus" />
                                    </div>
                                    <div
                                      className={currentQuestion.answer === 'C' ? 'option selected' : 'option'}
                                      onClick={() => this.answerCheck(currentQuestionIndex, 'C', currentQuestion.options[2].score)}
                                    >
                                      C、
                                      <div className="content green" />
                                    </div>
                                  </div>
                                </div>
                              )
                          }
                        </div>
                        <div className="btn-area">
                          {
                            currentQuestionIndex > 0
                              ? (
                                <div className="btn-item last" onClick={() => this.goLast()}>
                                  上一题
                                </div>
                              ) : ''
                          }
                          {
                            currentQuestionIndex < 14
                              ? (
                                <div
                                  className={currentQuestion.answer ? 'btn-item next' : 'btn-item disable'}
                                  onClick={() => this.goNext(currentQuestion.answer)}
                                >
                                  下一题
                                </div>
                              ) : ''
                          }
                          {
                            currentQuestionIndex >= 14
                              ? (
                                <div
                                  className={currentQuestion.answer ? 'btn-item next' : 'btn-item disable'}
                                  onClick={() => this.goNext(currentQuestion.answer, 'submit')}
                                >
                                  提交
                                </div>
                              ) : ''
                          }
                        </div>
                      </div>
                    )
                }
                </div>
              ) : ''
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => { // 见名知意，把state转换为props
  // 可以打印state看看数据结构，然后放到data里
  const { KidLearningAbilityModel } = state;
  return { KidLearningAbilityModel };
};

export default connect(mapStateToProps)(KidLearningAbility);

import './kidAbilityTest.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import KidHeader from 'components/kidHeader';
import zmTip from 'components/zmTip';
import zmAlert from 'components/zmAlert';
import { routerRedux } from 'dva/router';
import { nativeGoBack, nativeShowPage } from 'utils/padCommon';
import { AppLocalStorage } from '../../utils/localStorage';

class KidAbilityTest extends Component {
  static defaultProps = {
    KidAbilityTestModel: {},
  }

  static propTypes = {
    KidAbilityTestModel: PropTypes.object,
  }

  state = {
    testing: false,
    questions: [],
    originPage: '',
    currentQuestionIndex: 0,
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { originPage } = this.state;
    const { submitLearningAbilityResult } = nextProps.KidAbilityTestModel;
    const oldSubmitLearningAbilityResult = this.props.KidAbilityTestModel.submitLearningAbilityResult;
    if (submitLearningAbilityResult === oldSubmitLearningAbilityResult) return;
    if (submitLearningAbilityResult && submitLearningAbilityResult === 1) {
      const tip = {
        title: '提交成功啦',
        time: 2000,
        className: `partner${localStorage.getItem('partner')}`,
      };
      zmTip(tip);
      setTimeout(() => {
        const appName = AppLocalStorage.getAppName();
        if (appName === 'KidsPad' && originPage === 'personal') {
          nativeGoBack();
          return;
        }
        const { dispatch } = this.props;
        dispatch(routerRedux.push({
          pathname: '/kid/ability/report',
          state: {
            from: '/kid',
          },
        }));
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
            type: 'KidAbilityTestModel/submitResultReset',
          });
        },
      };
      zmAlert(alert);
    }
  }

  componentWillMount() {
    const { KidAbilityTestModel } = this.props;
    const { questions } = KidAbilityTestModel;
    questions.map((item, index) => {
      item.answer ? delete item.answer : '';
    });
    this.setState({
      questions,
    });
    if ((window.location.href.split('?')[1] && window.location.href.split('?')[1].includes('personal')) || (this.props.location && this.props.location.originPage === 'personal')) {
      this.setState({
        originPage: 'personal',
      });
    }
  }

  componentDidMount() {
    nativeShowPage();
    const { flagState } = this.state;
    this.setState({ flagState: !flagState });
    console.log('aaa');
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
        className: `sadpartner${localStorage.getItem('partner')}`
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
    questions.map((item, index) => {
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
      type: 'KidAbilityTestModel/submitLearningAbility',
      payload,
    });
  }

  goBack = () => {
    const alert = {
      message: '宝贝还没有完成学习力测评哦，确定要退出吗？',
      className: 'default',
      okText: '取消',
      cancelText: '退出',
      onOk: () => {},
      onCancel: () => { this.defaultGoBack(); },
    };
    zmAlert(alert);
  }

  defaultGoBack = () => {
    const appName = AppLocalStorage.getAppName();
    if (appName === 'KidsPad') {
      nativeGoBack();
      return;
    }
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/kid',
    }));
  }

  render() {
    const { history } = this.props;
    const { testing, questions, currentQuestionIndex } = this.state;
    const scaleStyle = this.getScale();
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <div id="learning-ability">
        <KidHeader history={history} center="学习力测评" goBack={() => { this.goBack(); }} />
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
                          <div className={currentQuestion.answer === 'A' ? 'option selected' : 'option'} onClick={() => this.answerCheck(currentQuestionIndex, 'A', currentQuestion.options[0].score)}>
A、
                            {currentQuestion.options[0].content}
                          </div>
                          <div className={currentQuestion.answer === 'B' ? 'option selected' : 'option'} onClick={() => this.answerCheck(currentQuestionIndex, 'B', currentQuestion.options[1].score)}>
B、
                            {currentQuestion.options[1].content}
                          </div>
                          <div className={currentQuestion.answer === 'C' ? 'option selected' : 'option'} onClick={() => this.answerCheck(currentQuestionIndex, 'C', currentQuestion.options[2].score)}>
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
                            <div className={currentQuestion.answer === 'A' ? 'option selected' : 'option'} onClick={() => this.answerCheck(currentQuestionIndex, 'A', currentQuestion.options[0].score)}>
A、
                              <div className="content yellow" />
                            </div>
                            <div className={currentQuestion.answer === 'B' ? 'option selected' : 'option'} onClick={() => this.answerCheck(currentQuestionIndex, 'B', currentQuestion.options[1].score)}>
B、
                              <div className="content yellow rhombus" />
                            </div>
                            <div className={currentQuestion.answer === 'C' ? 'option selected' : 'option'} onClick={() => this.answerCheck(currentQuestionIndex, 'C', currentQuestion.options[2].score)}>
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
                        <div className={currentQuestion.answer ? 'btn-item next' : 'btn-item disable'} onClick={() => this.goNext(currentQuestion.answer)}>
                        下一题
                        </div>
                      ) : ''
                  }
                    {
                    currentQuestionIndex >= 14
                      ? (
                        <div className={currentQuestion.answer ? 'btn-item next' : 'btn-item disable'} onClick={() => this.goNext(currentQuestion.answer, 'submit')}>
                        提交
                        </div>
                      ) : ''
                  }
                  </div>
                </div>
              )
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => { // 见名知意，把state转换为props
  // 可以打印state看看数据结构，然后放到data里
  const { KidAbilityTestModel } = state;
  return { KidAbilityTestModel };
};

export default connect(mapStateToProps)(KidAbilityTest);

import React from 'react';
import { fromJS } from 'immutable';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import KidHeader from 'components/kidHeader';
import ZmTab from 'components/zmModal';
import { stateList, verifyFinishAll } from './constants';
import Question from './smallClassQuestion';
import KidQuestion from './oneToOneQuestion';
import LeftCard from './smallClassQuestion/leftCard';
import { changeImgSrc } from './oneToOneQuestion/common';
import './style.scss';

class KidHomeWork extends React.Component {
  state = {
    current: 0,
    visible: false,
    title: '',
    secondButton: false,
    button1Content: '知道了',
    button2Content: '取消',
    workState: '',
    unfinishedIndex: '',
    confirmFunc: () => {},
    cancelFunc: null,
  }

  componentDidMount() {
    const { state } = this.props.location;
    const { type, homeworkstate, id, editable, leftSide, isDoAgain } = state;
    if (type == 1) {
      this.fetchOneToMore(homeworkstate, id);
    } else {
      this.fetchOneToOne(editable, id, isDoAgain);
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('nextProps', nextProps)
  //   if (nextProps.KidhomeworkModel.homeData) {
  //     return true;
  //   }
  // }

  fetchOneToMore = (homeworkstate, id) => {
    const { dispatch } = this.props;
    if (stateList.includes(homeworkstate)) {
      // 做作业
      dispatch({
        type: 'KidhomeworkModel/getDoSmallHomework',
        payload: {
          id,
        },
      });
    }
    if (homeworkstate == 31) {
      // 作业报告
      dispatch({
        type: 'KidhomeworkModel/getSmallCourseReport',
        payload: {
          id,
        },
      });
    }
  }

  fetchOneToOne = (editable, id, isDoAgain) => {
    // 做作业
    if (editable) {
      if (isDoAgain) {
        this.doAgain();
      } else {
        this.doFirst(id);
      }
    } else { // 作业报告
      const { dispatch } = this.props;
      dispatch({
        type: 'KidhomeworkModel/getOneToOneCourseReport',
        payload: {
          id,
        },
      });
    }
  }

  doAgain = () => {
    this.doFirst(false);
  }

  doFirst = (id, bool) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'KidhomeworkModel/getOneToOneHomework',
      payload: {
        id,
        bool,
      },
      callback: str => this.homeworkcallback(str),
    });

    this.setState({
      editMode: true,
      isAutoCorrectPage: false,
    });
  }

  homeworkcallback = (str) => {
    this.setState({
      title: str || '系统繁忙，请稍后再试',
      visible: true,
      confirmFunc: this.handlecancleModal,
    });
  }

  handleSubmit = () => {
    const { KidhomeworkModel } = this.props;
    const { homeData } = KidhomeworkModel;
    const { homeworkLessonQuestionDTOList } = homeData;
    const stuAnswerItemDTOList = homeworkLessonQuestionDTOList.map((item, index) => {
      return { id: item.id, stuAnswer: item.stuAnswer, index };
    });
    const noAnswer = stuAnswerItemDTOList.filter((item) => {
      return item.stuAnswer == null;
    });
    if (noAnswer.length > 0) {
      this.setState({
        title: `还有${noAnswer.length}题未完成，是否确认提交练习？`,
        unfinishedIndex: noAnswer[0].index,
        visible: true,
        secondButton: true,
        button1Content: '继续提交',
        button2Content: '继续做题',
        confirmFunc: this.handleSubmitSmallWrok,
        cancelFunc: this.handleGoOnDo,
      });
    } else {
      this.setState({ visible: true, title: '确定要提交吗？', secondButton: true, button1Content: '确定', confirmFunc: this.handleSubmitSmallWrok });
    }
  };

  handleGoOnDo = () => {
    const { unfinishedIndex } = this.state;
    this.setState({
      visible: false,
      current: unfinishedIndex,
      button2Content: '取消',
      cancelFunc: null,
    });
  }

  handleSubmitSmallWrok = () => {
    const { KidhomeworkModel, dispatch } = this.props;
    const { homeData } = KidhomeworkModel;
    const { homeworkLessonQuestionDTOList } = homeData;
    const stuAnswerItemDTOList = homeworkLessonQuestionDTOList.map((item) => {
      return { id: item.id, stuAnswer: item.stuAnswer };
    });
    const { id } = this.props.location.state;
    // this.setState({ title: '提交中...' });
    this.setState({visible: false})
    dispatch({
      type: 'KidhomeworkModel/postSmallHomeworkAnswer',
      payload: {
        id,
        stuAnswerItemDTOList,
        equipmentType: 1,
        state: 1,
      },
      leavePage: () => this.leavePage(),
      callback: str => this.smallCallback(str),
    });
  }

  leavePage = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/kid/kidhistory',
    }));
  }

  smallCallback = (str) => {
    const { dispatch } = this.props;
    if (str == 'success') {
      this.setState({ title: '提交成功!' }, () => {
        // dispatch(routerRedux.push({
        //   pathname: '/kid/kidhistory',
        // }));
      });
    } else {
      this.setState({
        title: str || '系统繁忙，请稍后再试',
        visible: true,
        confirmFunc: this.handlecancleModal,
      });
    }
  }

  handleChangeCurrent = (current) => {
    this.setState({ current });
  }

  handleChange(obj) {
    const { current } = this.state;
    const { KidhomeworkModel, dispatch } = this.props;
    const { homeData } = KidhomeworkModel;
    const { homeworkLessonQuestionDTOList } = homeData;
    const { templateType } = homeworkLessonQuestionDTOList[current].questionOutputDTO;
    switch (templateType) {
      case 2:
        if (homeworkLessonQuestionDTOList[current].id == obj.id) {
          homeworkLessonQuestionDTOList[current].stuAnswer = obj.stuAnswer;
          this.setState({});
        }
        break;
      case 6:
        homeworkLessonQuestionDTOList[current].stuAnswer = obj.stuAnswer;
        break;
      case 7:
        homeworkLessonQuestionDTOList[current].stuAnswer = obj.stuAnswer;
        break;
      case 5:
        homeworkLessonQuestionDTOList[current].stuAnswer = obj.stuAnswer;
        break;
      default:
        break;
    }
  }

  renderSmallClassHomework = () => {
    const { KidhomeworkModel } = this.props;
    const { homeData } = KidhomeworkModel;
    const { state } = homeData;
    const { current } = this.state;
    return (
      <div className="homeWraper">
        {state == 2 ? <LeftCard {...homeData} /> : ''}
        <div className="question-bg">
          <Question
            data={homeData}
            current={current}
            options={[
              'title',
              state === 2 ? 'analysis' : '',
              state === 2 ? 'answerList' : '',
              state === 2 ? 'knowledges' : '',
            ]}
            showCorrection={state === 2}
            interactive={!!(state === 0 || state === 3)}
            handleSubmit={obj => this.handleSubmit(obj)}
            handleChange={obj => this.handleChange(obj)}
            handleChangeCurrent={this.handleChangeCurrent}
          />
        </div>
      </div>
    );
  }

  setAnswer = (props, data, templateType) => {
    const list = props.questionList;
    const index = props.questionIndex;
    const { dispatch } = this.props;
    const curQues = fromJS(list).get(index);
    const answerList = fromJS(props.answerList);
    let newAnswerList = answerList;
    if (templateType === 1) {
      newAnswerList = answerList.set(index, fromJS({ id: curQues.get('id'), stuAnswer: '', children: data }));
    } else {
      newAnswerList = answerList.set(index, fromJS({ id: curQues.get('id'), stuAnswer: data }));
    }
    dispatch({
      type: 'KidhomeworkModel/setAnswer',
      answerList: newAnswerList,
    });
  }

  getNextQuestion = () => {
    const { KidhomeworkModel, dispatch } = this.props;
    const { homeData, questionIndex, questionList, answerList } = KidhomeworkModel;
    // const { questionIndex, questionList, answerList } = homeData.toJS();
    console.log('questionList', questionList);
    if (questionIndex + 1 < questionList.size) {
      dispatch({
        type: 'KidhomeworkModel/setQuestionIndex',
        questionIndex: questionIndex + 1,
      });
    } else {
      // 检查是否完
      const alertFlag = verifyFinishAll(answerList.toJS());
      if (alertFlag.status == 'undone') {
        this.setState({ visible: true, title: '完成所有题目才可以提交哦!', confirmFunc: this.handlecancleModal });
      } else {
        this.setState({ title: '是否提交练习？', visible: true, secondButton: true, button1Content: '确定', confirmFunc: this.handleCloseModal });
      }
    }
  }

  nextQues = (propsModel, bool, editMode) => {
    const { dispatch } = this.props;
    const { questionIndex, questionList, answerList, homeData } = propsModel;
    const { state } = homeData.toJS();
    if (!editMode) {
      this.getNextQuestion();
      return false;
    }
    // // 检查是否完
    const alertFlag = verifyFinishAll(answerList.toJS());
    if (bool) {
      // 已经做过了
      if (state === 1) {
        this.setState({ title: '是否确认提交修改后的练习？', button1Content: '确定', visible: true, confirmFunc: this.handleCloseModal });
      } else if (alertFlag.status == 'undone') {
        this.setState({ title: '完成所有题目才可以提交哦!', visible: true, confirmFunc: this.handlecancleModal });
        return false;
      } else if (alertFlag.status == 'done') {
        this.setState({ title: '确认提交？', visible: true, secondButton: true, button1Content: '确定', confirmFunc: this.handleCloseModal });
      }
      return false;
    }
    this.setState({ workState: state });
    if (questionIndex + 1 <= questionList.size) {
      const { state } = this.props.location;
      const { workState } = this.state;
      const { id } = state;
      const curAnswer = answerList.get(questionIndex) || fromJS({});
      const curAnswerJS = curAnswer.toJS();
      curAnswerJS.stuAnswer = changeImgSrc(curAnswerJS.stuAnswer || '', '', true);
      if (curAnswerJS.children) {
        curAnswerJS.children = curAnswerJS.children.map((item) => {
          return { id: item.id, stuAnswer: changeImgSrc(item.stuAnswer || '', '', true) };
        });
      }
      dispatch({
        type: 'KidhomeworkModel/postOneToOneHomeworkAnswer',
        payload: {
          id,
          state: workState === 1 ? 1 : 3,
          stuAnswerItemDTOList: [curAnswerJS],
        },
      });

      this.getNextQuestion();
    }
  }

  preQues = () => {
    const { dispatch, KidhomeworkModel } = this.props;
    const { questionIndex } = KidhomeworkModel;
    if (questionIndex > 0) {
      dispatch({
        type: 'KidhomeworkModel/setQuestionIndex',
        questionIndex: questionIndex - 1,
      });
    }
  }

  renderOneToOneClassHomework = () => {
    const { KidhomeworkModel } = this.props;
    const { homeData, questionList, questionIndex, answerList } = KidhomeworkModel;
    const leftSide = this.state.leftSide ? this.state.leftSide : this.props.location.state.leftSide;
    const curQuestion = fromJS(questionList).get(questionIndex) || [];
    const isAutoCorrectPage = typeof (this.state.isAutoCorrectPage) === 'boolean' ? this.state.isAutoCorrectPage : this.props.location.state.isAutoCorrectPage;
    const _editMode = typeof (this.state.editMode) === 'boolean' ? this.state.editMode : this.props.location.state.editMode;
    const curAnswer = fromJS(answerList).get(questionIndex) || [];
    return (
      <div className="homeWraper">
        <div>
          <KidQuestion
            homeWorkInfo={homeData}
            key={2}
            data={fromJS(curQuestion || {})}
            leftSide={leftSide}
            isAutoCorrectPage={isAutoCorrectPage}
            nextOne={bool => this.nextQues(KidhomeworkModel, bool, _editMode)}
            preOne={() => this.preQues()}
            index={questionIndex + 1}
            total={questionList.size}
            editMode={_editMode}
            submit={() => { this.nextQues(this.props, true, _editMode); }}
            receiveAnswer={(str, templateType) => { this.setAnswer(KidhomeworkModel, str, templateType); }}
            value={fromJS(curAnswer).get('stuAnswer') || ''}
            info={fromJS(homeData) || []}
            doAgain={this.doAgain}
          />
        </div>
      </div>
    );
  }

  handleCloseMask = () => {
    this.setState({ visible: false });
  }

  callback = (info, str) => {
    const { dispatch } = this.props;
    const { state } = this.props.location;
    const { id } = state;
    if (info == 'success') {
      if (str == '2') {
        this.setState({
          title: '提交成功, 系统已经为你批改完成！',
          confirmFunc: this.handlecancleModal,
        });
      } else {
        this.setState({
          title: '提交成功, 跳转到自动批改页面！',
          confirmFunc: this.handlecancleModal,
          editMode: false,
          leftSide: true,
          isAutoCorrectPage: false,
        });
      }

      dispatch({
        type: 'KidhomeworkModel/getOneToOneCourseReport',
        payload: {
          id,
        },
      });
    } else {
      this.setState({
        title: str || '提交失败!',
        confirmFunc: this.handlecancleModal,
      });
    }
  }

  handleCloseModal = () => {
    // this.setState({ title: '提交中...' });
    this.setState({visible: false})
    const { state } = this.props.location;
    const { id } = state;
    const { dispatch } = this.props;
    const { answerList } = this.props.KidhomeworkModel;
    const answerListJS = answerList.toJS();
    const imgUpdateListJS = answerListJS.map((e) => {
      e.stuAnswer = changeImgSrc(e.stuAnswer || '', '', true);
      if (e.children) {
        e.children = e.children.map((item) => {
          return { id: item.id, stuAnswer: changeImgSrc(item.stuAnswer || '', '', true) };
        });
      }
      return e;
    });

    dispatch({
      type: 'KidhomeworkModel/postOneToOneHomeworiAllAnswer',
      payload: {
        id,
        state: 1,
        stuAnswerItemDTOList: imgUpdateListJS,
      },
      leavePage: () => this.leavePage(),
      callback: (info, str) => this.callback(info, str),
    });
  }

  handlecancleModal = () => {
    this.setState({ visible: false, secondButton: false, title: '' });
  }

  renderModal = () => {
    const { title, secondButton, button1Content, button2Content, confirmFunc, cancelFunc } = this.state;
    return (
      <div id="question-modal">
        <div className="ellipse" />
        <div className="title">{title}</div>
        <div className="buttons">
          {secondButton && <div className="button2" onClick={cancelFunc || this.handlecancleModal}>{button2Content}</div>}
          <div className={`${secondButton ? 'button1' : 'button'}`} onClick={confirmFunc}>
            {button1Content}
          </div>
        </div>
      </div>
    );
  }

  handleGoBack = () => {
    const { dispatch, location } = this.props;
    const { from } = location.state;
    let pathName = '';
    let fromMessage = '';
    if (from == '/kid/message') {
      // pathName = '/kid/message';
      fromMessage = 'homework';
    } 
    // else if (from == '/kid') {
    //   pathName = '/kid';
    // } else {
    //   pathName = '/kid/kidhistory';
    // }
    dispatch(routerRedux.push(
      {
        pathname: from,
        state: {
          from: '/kid/kidhomework',
          fromMessage,
        },
      },
    ));
  }

  render() {
    const { state } = this.props.location;
    const { type } = state;
    const { history, KidhomeworkModel } = this.props;
    const { homeData } = KidhomeworkModel;
    const name = homeData.name || fromJS(homeData).get('name');
    const { visible } = this.state;
    return (
      <div id="KidHomework">
        <KidHeader goBack={this.handleGoBack} center={name} />
        <div className="homeworkContainer">
          {
            type == 1 ? this.renderSmallClassHomework() : this.renderOneToOneClassHomework()
          }
        </div>
        {visible && <ZmTab visible={visible} maskClick={this.handleCloseMask}>{this.renderModal()}</ZmTab>}
      </div>
    );
  }
}

function mapStateToProps({ KidhomeworkModel }) {
  return { KidhomeworkModel };
}

export default connect(mapStateToProps)(KidHomeWork);

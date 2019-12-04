/**
*
* KidQuestion
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import { browserHistory } from 'react-router';
import Immutable, { fromJS } from 'immutable';
// import {KidBtn} from 'components/KidBtn'
import dayjs from 'dayjs';
import ZmExamda from 'components/ZmExamda';
import EditBox from './edit';
import { addImgSrc, costTimeObj, renderToKatex as iRenderToKatex } from './common';
import KidComplexQuestion from './KidComplexQuestion';
import QuestionItemContent from './QuestionItemContent';
import QuestionItemAnswer from './QuestionItemAnswer';
import { QuestionSwitch, QuestionAnswer } from '../smallClassQuestion/comp';
import './one.scss';
// import '../smallClassQuestion/question.scss';
import 'katex/dist/katex.min.css';

const EMPTY_OBJ = fromJS({});
const EMPTY_LIST = fromJS({});
const Katex_field = ['title', 'analysis', 'answerList', 'Content', 'Answer', 'Method', 'Options', 'optionList'];
const renderToKatex = (str) => {
  return iRenderToKatex(str).replace(/^(<p[^>]*>(<br\/>)?<\/p>){1,3}/, '').replace(/(<p[^>]*>(<br\/>)?<\/p>){1,3}$/, '').replace(/^(<br\s?\/>){1,3}/, '')
    .replace(/(<br\s?\/>){1,3}$/, '');
};
const katexTranform = (ques_data) => {
  Katex_field.forEach((i) => {
    if (ques_data[i]) {
      if (Object.prototype.toString.call(ques_data[i]) == '[object Array]') {
        ques_data[i].map((e, index) => {
          ques_data[i][index] = renderToKatex(e);
        });
      }
      if (typeof ques_data[i] === 'string') {
        ques_data[i] = renderToKatex(ques_data[i]);
      }
    }
  });
  return ques_data;
};
class KidQuestion extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      score: 100,
      show: false,
      imgList: [],
      showPreview: false,
      answer: '',
      childrenAnswer: fromJS([]),
      active: true,
      showRightAnswer: false,
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.receiveAnswer = this.receiveAnswer.bind(this);
    this.delegationClick = this.delegationClick.bind(this);
    this.changePreImg = this.changePreImg.bind(this);
    this.changeNextImg = this.changeNextImg.bind(this);
    this.togglePreviewBox = this.togglePreviewBox.bind(this);
    this.drawCanvas = this.drawCanvas.bind(this);
    this.drawCircle = this.drawCircle.bind(this);
    this.changeQuestion = this.changeQuestion.bind(this);
    this.getChildrenAnswer = this.getChildrenAnswer.bind(this);
  }

  componentDidMount() {
    const { data } = this.props;
    this.drawCircle();
    this.setState({
      answer: data.get('stuAnswer') || '',
      childrenAnswer: this.getChildrenAnswer(data),
    });
    const starCanvas = this.refs.shooting_star;
  }

  componentWillReceiveProps(nextprops) {
    const { info, leftSide, data } = nextprops;
    const infoJS = (info || EMPTY_OBJ).toJS();
    if (data.get('id') !== this.props.data.get('id')) {
      this.setState({
        answer: data.get('stuAnswer') || '',
        childrenAnswer: this.getChildrenAnswer(data),
      });
    }
    const getScore = parseInt(infoJS.stuGetScore || 0);
    const full_score = parseInt(infoJS.totalScore);
    this.drawCircle(nextprops);
    if (getScore && full_score && leftSide) {
      setTimeout(this.drawCanvas, 1000);
    }
  }

  // 复合体时获取 children 的答案列表
  getChildrenAnswer(data) {
    const childrenList = (data.getIn(['questionOutputDTO', 'children']) || fromJS([])).map(item => fromJS({ id: item.get('id'), stuAnswer: item.get('stuAnswer') || '' }));
    return childrenList;
  }

  drawCircle(nextprops) {
    if (!this.props.leftSide && (nextprops ? !nextprops.leftSide : true)) {
      return false;
    }
    const canvas = this.refs.score_canvas;
    if (!canvas) {
      return false;
    }
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(64, 64, 54, 0, Math.PI * 2, true);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#F2EADB';
    ctx.stroke();
    ctx.closePath();
  }

  drawCanvas() {
    if (!this.props.leftSide) {
      return false;
    }
    const canvas = this.refs.score_canvas;
    if (!canvas) {
      return false;
    }
    const getScore = this.props.info.get('stuGetScore');
    const full_score = this.props.info.get('totalScore');
    const rate = parseInt(getScore) / parseInt(full_score);
    const value = rate * Math.PI * 2;
    const endColor = `rgb(${255 - parseInt(rate * 15)},${196 - parseInt(rate * 110)},${86 - parseInt(rate * 7)})`;
    let angle = value - Math.PI / 2;
    angle = value > 0 ? Math.max(Math.PI / 360 - Math.PI / 2, angle) : -1 * Math.PI / 2;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.arc(64, 64, 54, -0.5 * Math.PI, angle, false);
    const grd = ctx.createLinearGradient(0, 0, 170, 0);
    grd.addColorStop('0', 'rgb(255,196,86)');
    grd.addColorStop('1', endColor);
    ctx.strokeStyle = grd;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();
    if (value > 0) {
      ctx.beginPath();
      ctx.arc(64, 10, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.closePath();
    }
  }

  toggleShow() {
    this.setState({
      show: !this.state.show,
    });
  }

  receiveAnswer(str) {
    this.setState({
      answer: str,
    });
  }

  syncAnswer() {
    this.receiveAnswer(this.state.answer);
    this.setState({ showRightAnswer: false, active: true });
  }

  delegationClick(e, str) {
    if (e.target && e.target.nodeName == 'IMG') {
      const res = str.match(/<img.+?>/g) || [];
      let index = null;
      res.map((el, i) => {
        if (el == e.target.outerHTML) {
          index = i;
        }
      });
      this.setState({
        imgList: res,
        imgIndex: index,
        showPreview: true,
      });
    }
  }

  changePreImg() {
    const index = this.state.imgIndex;
    if (index == 0) {
      return false;
    }
    this.setState({
      imgIndex: parseInt(index) - 1,
    });
  }

  changeNextImg() {
    const index = this.state.imgIndex;
    const list = this.state.imgList;
    if (list && list.length) {
      if (index + 1 < list.length) {
        this.setState({
          imgIndex: parseInt(index) + 1,
        });
      }
    }
  }

  togglePreviewBox(e) {
    const class_str = e.target && e.target.className;
    if (class_str.indexOf('ImgPreview') >= 0) {
      this.setState({
        showPreview: false,
      });
    }
  }

  resultTemplate1 = (title, fillNum, allNum, _text) => {
    return (
      <div className="ResultTemplate1">
        <div className="title">{title}</div>
        <div className="blank-bar">
          <div className="fill-bar" style={{ width: allNum == 0 ? 0 : `${fillNum / allNum * 100}%` }} />
        </div>
        <div className="ResultText">
          {_text + fillNum}
题，共
          {allNum}
题
        </div>
      </div>
    );
  }

  changeQuestion(value, i) {
    const childrenAnswer = this.state.childrenAnswer.setIn([i, 'stuAnswer'], value);
    console.log('childrenAnswer', childrenAnswer);
    this.setState({ stuAnswer: '', childrenAnswer });
    setTimeout(() => {
      this.props.receiveAnswer(childrenAnswer, 1);
    }, 20);
  }

  handleChange = (obj, templateType) => {
    switch (templateType) {
      case 5:
        this.props.receiveAnswer(obj.stuAnswer, 5);
        break;
      case 6:
        this.props.receiveAnswer(obj.stuAnswer, 6);
        break;
      case 7:
        this.props.receiveAnswer(obj.stuAnswer, 7);
        break;
      default:
        break;
    }
  }

  handleCutClick = () => {
    this.setState({
      active: true,
      showRightAnswer: false,
    });
  };

  handleSureClick = () => {
    this.setState({
      active: false,
      showRightAnswer: true,
    });
  };

  handlePre = () => {
    this.setState({ showRightAnswer: false, active: true });
  }

  renderQuestion(params) {
    const { data } = this.props;
    console.log('data', data.toJS());
    const {
      questionEsDto,
      optionList,
      editMode,
      isWrongQuestion,
      subject,
    } = params;
    const { showRightAnswer } = this.state;
    if ([5, 6, 7].includes(questionEsDto.templateType)) {
      return (
        <div id="Warp">
          {!editMode
            && (
            <QuestionSwitch
              cutMyClick={() => this.handleCutClick()}
              cutSureClick={() => this.handleSureClick()}
              active={this.state.active}
            />
            )}
          <div id="questionContainer">
            <ZmExamda
              question={fromJS(data)}
              showCorrection={!editMode}
              handleChange={obj => this.handleChange(obj, questionEsDto.templateType)}
              options={[
                'title',
                'answerList',
                !editMode ? 'analysis' : '',
                !editMode ? 'answerList' : '',
                !editMode ? 'knowledges' : '',
              ]}
              interactive={editMode}
              showRightAnswer={showRightAnswer}
            />
            {!editMode && <QuestionAnswer data={fromJS(data)} />}
          </div>
        </div>
      );
    } if (questionEsDto.templateType === 1) {
      if (editMode) {
        return (
          <KidComplexQuestion
            answerList={this.state.childrenAnswer}
            questionData={questionEsDto || {}}
            changeQuestion={this.changeQuestion}
            showEditor={this.state.showEditor}
          />
        );
      }
      return (
        <QuestionItemContent isWrongQuestion={isWrongQuestion} questionData={questionEsDto || {}} />
      );
    }
    return (
      <div id="KatexQuestionItem" className="title part KatexQuestionItem">
        <div className="content" dangerouslySetInnerHTML={{ __html: questionEsDto.title }} />
        {optionList}
      </div>
    );
  }

  render() {
    const { homeWorkInfo, data, preOne, nextOne, hasDone, index,
      total, editMode, noteBook,
      value, reportInfo, info, leftSide,
      doAgain, receiveAnswer, isAutoCorrectPage,
      isWrongQuestion,
    } = this.props;
    const dataJS = data.toJS();
    const infoJS = (info || EMPTY_OBJ).toJS();
    const getScore = parseInt(infoJS.stuGetScore || 0);
    const full_score = parseInt(infoJS.totalScore);
    const subject = infoJS.subject == '英语' ? 3 : 1;
    const score_p = parseInt(getScore) / full_score * 1069;
    const score_p_c = score_p > 600 ? 600 : score_p;
    const source_type = dataJS.questionSource;
    const questionEsDto = (source_type == 1 ? dataJS.questionEsDto : dataJS.questionOutputDTO) || {};
    katexTranform(questionEsDto);
    if (source_type === 2 && questionEsDto.templateType === 2) {
      questionEsDto.Cate = 1;
      questionEsDto.CateName = '选择题';
    }
    const isChoice = !!((questionEsDto.Cate == 1 || questionEsDto.CateName == '选择题'));
    const costTime = costTimeObj(infoJS.costTime);
    const optionList = (questionEsDto.Options || questionEsDto.optionList || []).map((e, i) => {
      return (
        <div style={{ display: 'flex', marginBottom: 15 }} key={i}>
          {`${String.fromCharCode(i + 65)}：`}
          {' '}
          <span className="option-list" dangerouslySetInnerHTML={{ __html: e || '' }} />
        </div>
      );
    });
    const answerCompletedImg = addImgSrc(dataJS.stuAnswer, 'stuAnswer');
    // 客观题正确数，客观题总数 主观题完成数，主观题总数
    const homeworkInfoData = homeWorkInfo ? fromJS(homeWorkInfo).toJS() : {};
    const objectiveRightAmount = homeworkInfoData.objectiveRightAmount || 0;
    const objectiveAmount = homeworkInfoData.objectiveAmount || 0;
    const nonObjectiveAnsweredAmount = homeworkInfoData.nonObjectiveAnsweredAmount || 0;
    let amountExceptObjective = (homeworkInfoData.questionAmount || 0) - objectiveAmount;
    amountExceptObjective < 0 ? amountExceptObjective = 0 : '';
    const params = {
      questionEsDto,
      optionList,
      editMode,
      isWrongQuestion,
      subject,
    };

    return (
      <div id="BodyWrapper">
        <div className="BoardWrapper">
          {isAutoCorrectPage ? (
            <div className="board-left">
              <div style={{ color: '#452B13' }}>答题概况</div>
              {this.resultTemplate1('客观题正确数', objectiveRightAmount, objectiveAmount, '正确')}
              {this.resultTemplate1('其他题型完成数', nonObjectiveAnsweredAmount, amountExceptObjective, '完成')}
            </div>
          ) : ''}
          <div className="board-left" style={{ display: (leftSide ? 'block' : 'none') }}>
            <div className="innerleft">
              <div className="progress">
                <canvas className="score_canvas" ref="score_canvas" width="128" height="128" />
                <div className="score-number">
                  <span className="number">{getScore}</span>
分
                </div>
              </div>
              <div className="distribution">
                <div className="score-item">
                  <span>{infoJS.rightAmount || 0}</span>
                  <br />
                    正确题数
                </div>
                <div className="score-item">
                  <span>{infoJS.wrongAmount || 0}</span>
                  <br />
                    错误题数
                </div>
                <div className="score-item">
                  <span>{infoJS.partRightAmount || 0 }</span>
                  <br />
                    部分错误
                </div>
              </div>
              <div className="info">
                <div className="info-item">
                  <span>用时：</span>
                  {`${costTime.h}小时${costTime.m}分钟${costTime.s}秒`}
                </div>
                <div className="info-item">
                  <span>提交时间：</span>
                  {' '}
                  {dayjs(infoJS.submitTime).format('YYYY-MM-DD HH:MM:ss')}
                </div>
                <div className="info-item">
                  <span>教师评语：</span>
                  <br />
                  {infoJS.teaTotalComment || '暂无评语'}
                </div>
                <div className="info-item knowlegge">
                  <span>知识点掌握情况：</span>
                  <br />
                  <div className="line-progress">
                    {infoJS.graspKnowledgeDTOList && infoJS.graspKnowledgeDTOList.map((e, i) => {
                      const width = `${parseInt(e.rightAmount) / parseInt(e.allAmount) * 100}%`;
                      return (
                        <div key={i}>
                          {e.knowledgeName}
                          {' '}
                          {e.rightAmount || 0 }
/
                          {e.allAmount || 0}
                          {' '}
                          <br />
                          <div className="progressLine">
                            <div className="inner" style={{ width }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="board-right">

            { this.props.leftSide || isAutoCorrectPage ? '' : ''
            // <img className='bottom-img  left' src={mogu} alt=""/>
            }
            { this.props.leftSide || isAutoCorrectPage ? '' : ''
            // <img className='bottom-img  right' src={shitou} alt=""/>
            }
            {
              <div className="board-content">
                {
                  source_type == 1
                    ? (
                      <div className="view">
                        <div id="KatexQuestionItem" className="title part">
                          <div className="content" dangerouslySetInnerHTML={{ __html: questionEsDto.Content }} />
                          {optionList}
                        </div>
                        {(!editMode && leftSide) || isAutoCorrectPage
                          ? (
                            <div className={`analysis part ${this.state.show ? 'opended' : ''}`}>
                              <div className="answer-tag">
                              答案和解析
                                <div className="open-btn" onClick={this.toggleShow}>
                                  {this.state.show ? '收起' : '展开'}
                                  <span className={this.state.show ? 'open' : ''} />
                                </div>
                              </div>
                              { this.state.show
                                ? (
                                  <div id="KatexQuestionItem">
                                    <div className="analysis-content" dangerouslySetInnerHTML={{ __html: addImgSrc(questionEsDto.Analyse || '暂无解析  /(ㄒoㄒ)/~~') }} />
                                    <div className="analysis-content" dangerouslySetInnerHTML={{ __html: addImgSrc(questionEsDto.Answer || questionEsDto.Method || '') }} />
                                  </div>
                                )
                                : ''
                            }
                            </div>
                          ) : ''
                        }
                        {!editMode
                          ? (
                            <div id="KatexQuestionItem" className="answer part">
                              <div className="answer-tag">我的答案</div>
                              <div onClick={e => this.delegationClick(e, answerCompletedImg)} className="my-answer">
                              答案：
                                <span
                                  className={`answer-with-correct ${isChoice || !dataJS.stuAnswer ? 'addpadding' : 'nopadding'} choice${dataJS.correctResult} ${!dataJS.stuAnswer ? 'no-answer' : 'has-answer'}`}
                                  dangerouslySetInnerHTML={{ __html: answerCompletedImg || '未作答' }}
                                />
                              </div>
                              {!isAutoCorrectPage ? (
                                <div className="my-answer">
                                得分：
                                  <div>
                                    {dataJS.stuGetScore}
分/共
                                    {dataJS.score}
分
                                  </div>
                                </div>
                              ) : ''}
                            </div>
                          ) : ''
                        }
                        {editMode
                          ? <EditBox isChoice={isChoice} value={value} single={source_type === 2 && questionEsDto.typeId === 1} receiveAnswer={this.receiveAnswer} /> : ''}
                      </div>
                    )
                    : (
                      <div className="view">
                        {this.renderQuestion(params)}
                        {/* {questionEsDto.templateType === 1 ?
                      (editMode ? <KidComplexQuestion answerList={this.state.childrenAnswer} questionData={questionEsDto || {}} changeQuestion={this.changeQuestion} showEditor={this.state.showEditor}></KidComplexQuestion>
                      :
                      <QuestionItemContent isWrongQuestion={isWrongQuestion} questionData={questionEsDto || {}}></QuestionItemContent>)
                    :
                    <KatexQuestionItem subjectId={subject} className="title part KatexQuestionItem">
                      <div className="content" dangerouslySetInnerHTML={{__html: questionEsDto.title}}></div>
                      {optionList}
                    </KatexQuestionItem>} */}
                        {((!editMode && leftSide) || isAutoCorrectPage) && ![1, 5, 6, 7].includes(questionEsDto.templateType)
                          ? (
                            <div className={`analysis part ${this.state.show ? 'opended' : ''}`}>
                              <div className="answer-tag">
                          答案和解析
                                <div className="open-btn" onClick={this.toggleShow}>
                                  {this.state.show ? '收起' : '展开'}
                                  <i className={this.state.show ? 'open' : ''} />
                                </div>
                              </div>
                              { this.state.show
                                ? (
                                  <div id="KatexQuestionItem">
                                    <div className="analysis-content" dangerouslySetInnerHTML={{ __html: addImgSrc(questionEsDto.analysis || '暂无解析  /(ㄒoㄒ)/~~') }} />
                                    <div className="analysis-content" dangerouslySetInnerHTML={{ __html: addImgSrc((questionEsDto.answerList || []).join(' ')) }} />
                                  </div>
                                )
                                : ''
                        }
                            </div>
                          ) : ''
                    }
                        {!editMode && ![1, 5, 6, 7].includes(questionEsDto.templateType)
                          ? (
                            <div id="KatexQuestionItem" className="answer part">
                              {console.log('我的答案！')}
                              <div className="answer-tag">我的答案</div>
                              <div className="my-answer" onClick={e => this.delegationClick(e, answerCompletedImg)}>
                          答案：
                                <span
                                  className={`answer-with-correct ${isChoice || !dataJS.stuAnswer ? 'addpadding' : 'nopadding'} choice${dataJS.correctResult} ${!dataJS.stuAnswer ? 'no-answer' : 'has-answer'}`}
                                  dangerouslySetInnerHTML={{ __html: answerCompletedImg || '未作答' }}
                                />
                              </div>
                              {!isAutoCorrectPage ? (
                                <div className="my-answer">
                            得分：
                                  <div>
                                    {dataJS.stuGetScore}
分/共
                                    {dataJS.score}
分
                                  </div>
                                </div>
                              ) : ''}
                            </div>
                          ) : ''
                    }
                        {editMode && ![1, 5, 6, 7].includes(questionEsDto.templateType)
                          ? (
                            <EditBox
                              isChoice={isChoice}
                              value={value}
                              single={source_type === 2 && questionEsDto.typeId === 1}
                              receiveAnswer={(str) => {
                                receiveAnswer(str);
                              }}
                            />
                          )
                          : ''}
                        {/* 复合题 */}
                        {!editMode && questionEsDto.templateType === 1 ? <div className="QuestionAnswerScrollBox"><QuestionItemAnswer questionData={questionEsDto || {}} type="answer" /></div> : ''}
                      </div>
                    )
                }
                <div className="board-footer">
                  <div className="left-footer">
                    第
                    {index}
题
                    <span>
/共
                      {total}
题
                    </span>
                  </div>
                  <div className="right-footer">
                    { index == 1 ? '' : <a className="pre" onClick={() => { this.handlePre(); preOne(); }} />}
                    {noteBook
                      ? <a data-accAction="点击事件" data-clickId="03_learned" data-accFunctions="['作业管理', '错题本', '已掌握']" className="yzw" onClick={() => { hasDone(dataJS.questionId); }} /> : ''}
                    {
                      index == total && !editMode ? ''
                        : <a className="next" onClick={() => { this.syncAnswer(); nextOne(false); }} />
                    }
                    {editMode ? (
                      <a
                        className="submit"
                        onClick={
                        () => { this.syncAnswer(); nextOne(true); }
                    }
                      />
                    ) : ''}
                  </div>
                </div>
              </div>

            }
          </div>
        </div>
        <div>
          {this.state.showPreview
            ? (
              <div className="ImgPreview" onClick={this.togglePreviewBox}>
                <div className="img-preview " dangerouslySetInnerHTML={{ __html: this.state.imgList[this.state.imgIndex] }} />
                <div className="btn-group">
                  <a href="javascript:void(0)" className="pre-btn btns" onClick={this.changePreImg} />
                  { parseInt(this.state.imgIndex || 0) + 1 }
                  {' '}
/
                  {this.state.imgList && this.state.imgList.length}
                  <a href="javascript:void(0)" className="next-btn btns" onClick={this.changeNextImg} />
                </div>
              </div>
            ) : ''}
        </div>
      </div>
    );
  }
}

KidQuestion.propTypes = {
  // leftSide:React.PropTypes.bool,
  // data:PropTypes.instanceOf(Immutable.Map).isRequired,
  // reportInfo:PropTypes.instanceOf(Immutable.Map),
  // info:PropTypes.instanceOf(Immutable.Map),
  // editMode:PropTypes.bool,
  // nextOne:PropTypes.func.isRequired,
  // preOne:PropTypes.func.isRequired,
  // index:PropTypes.number,
  // total:PropTypes.number,
  // receiveAnswer:PropTypes.func,
  // hasDone:PropTypes.func,
  // noteBook:PropTypes.bool,
  // isWrongQuestion: PropTypes.bool,
};

export default KidQuestion;

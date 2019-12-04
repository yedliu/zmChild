import React from 'react';
import { fromJS } from 'immutable';
import ZmExamda from 'components/ZmExamda';
import './question.scss';
import { QuestionContent, QuestionFooter, QuestionAnswer, QuestionSwitch } from './comp';

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true, // 控制切换答案的选项卡
      showRightAnswer: false,
      current: this.props.current,
    };
    this.handleCutClick = this.handleCutClick.bind(this);
    this.handleSureClick = this.handleSureClick.bind(this);
    this.handlePre = this.handlePre.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  handleCutClick() {
    this.setState({
      active: true,
      showRightAnswer: false,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current !== this.state.current) {
      this.setState({ current: nextProps.current });
    }
  }

  handleSureClick() {
    this.setState({
      active: false,
      showRightAnswer: true,
    });
  }

  handlePre() {
    const { current } = this.state;
    const { handleChangeCurrent } = this.props;
    if (current === 0) {
      return;
    }
    this.setState({ current: current - 1, showRightAnswer: false, active: true }, () => {
      handleChangeCurrent && handleChangeCurrent(current - 1);
    });
  }

  handleNext() {
    const { current } = this.state;
    const { handleChangeCurrent } = this.props;
    const { totalLength } = this.props;
    if (current === totalLength - 1) {
      return;
    }
    this.setState({ current: current + 1, showRightAnswer: false, active: true }, () => {
      handleChangeCurrent && handleChangeCurrent(current + 1);
    });
  }

  render() {
    // question 每道题目
    // index 当前题号, number || string(如：'一、')；number 时传入 1 得到结果 1. ,string 时则以传入 '一、' 得到结果 一、
    // showCorrection  是否显示批改结果
    // interactive   是否可交互（即学生是否可以作答）
    // handleChange  每一次交互是触发的方法（stuAnswer, id）
    // indexType     序号类型 默认number, number | chinese | rome | icon | 模板替换[__$$__] 例如：(__$$__)在index 为 1 时会变成 (1)
    // optionListLayout  选择题选项排列方式 默认不需要传， wrap 横排自动换行，oneline 横排不自动换行（这里横排使用 flex 实现）
    // options 题目内容显示配置
    const {
      options,
      indexType,
      optionListLayout,
      handleChange,
      handleSubmit,
      data,
      showCorrection,
      interactive,
    } = this.props;
    const { current, active } = this.state;
    const { state, homeworkLessonQuestionDTOList } = data || {};
    const question = homeworkLessonQuestionDTOList && homeworkLessonQuestionDTOList[current];
    const templateType = question && question.questionOutputDTO.templateType;
    const totalLength = homeworkLessonQuestionDTOList && homeworkLessonQuestionDTOList.length;
    return (
      <QuestionContent>
        { state === 2 && templateType !== 2
          ? (
            <QuestionSwitch
              cutMyClick={() => this.handleCutClick()}
              cutSureClick={() => this.handleSureClick()}
              active={active}
            />
          ) : '' }
        <div id="questionContainer">
          <ZmExamda
            question={fromJS(question || {})}
            index={current + 1}
            showCorrection={showCorrection}
            interactive={interactive}
            options={options}
            handleChange={handleChange}
            // indexType={indexType}
            optionListLayout={optionListLayout}
            showRightAnswer={this.state.showRightAnswer}
          />
          {state === 2 && <QuestionAnswer data={fromJS(question || {})} />}
        </div>
        <QuestionFooter
          index={current + 1}
          editable={!!(state === 0 || state === 3)}
          total={totalLength}
          handlePre={() => this.handlePre(current)}
          handleNext={() => this.handleNext(current)}
          handleSubmit={handleSubmit}
        />
      </QuestionContent>
    );
  }
}

export default Question;

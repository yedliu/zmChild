import React from 'react';
import './question.scss';

export class QuestionContent extends React.PureComponent {
  render() {
    return (
      <div id="questionContent">{this.props.children}</div>
    );
  }
}


export class QuestionFooter extends React.PureComponent {
  render() {
    const { index, total, handlePre, handleNext, handleSubmit, editable } = this.props;
    return (
      <div id="questionFooter">
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
          {index == 1 ? '' : <a className="pre" onClick={handlePre} />}
          {index == total ? '' : <a className="next" onClick={handleNext} />}
          {editable && index == total ? <a className="submit" onClick={handleSubmit} /> : ''}
        </div>
      </div>
    );
  }
}

export class QuestionAnswer extends React.PureComponent {
  render() {
    const { data, role } = this.props;
    const newQuestion = data.get('questionOutputDTO') ? data.get('questionOutputDTO').merge(data.delete('questionOutputDTO')) : data;
    const templateType = newQuestion.get('templateType');
    return (
      <div id="questionAnswer">
        <div className="question-answer">
          {templateType == 1 || templateType == 2 ? (
            <span>
              <span>{role == 'teacher' ? '学生答案：' : '我的答案：'}</span>
              {data.get('stuAnswer')}
            </span>
          ) : ''}
          <div>
            得分：
            <span style={{ fontSize: 18 }}>
              {data.get('stuGetScore')}
              /
              {data.get('score')}
            </span>
          </div>
        </div>
        <div className="result">
          <span>回答结果：</span>
          <span className={`show-result color${data.get('correctResult')}`}>
            {data.get('correctResult') === 1 ? '正确' : data.get('correctResult') === 2 ? '错误' : '部分正确'}
          </span>
          <span>
            得分：
            {data.get('stuGetScore')}
            /
            {data.get('score')}
          </span>
        </div>
      </div>
    );
  }
}

export class QuestionSwitch extends React.PureComponent {
  render() {
    const { active, cutMyClick, cutSureClick, role } = this.props;
    return (
      <div id="questionSwitch">
        <span className={`my-answer ${active ? 'active' : ''}`} onClick={cutMyClick}>
          {role == 'teacher' ? '学生答案' : '我的答案'}
        </span>
        <span className={`sure-answer ${active ? '' : 'active'}`} onClick={cutSureClick}>
          正确答案
        </span>
      </div>
    );
  }
}

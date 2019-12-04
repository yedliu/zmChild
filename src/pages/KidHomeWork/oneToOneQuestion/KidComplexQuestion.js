import React from 'react';
import PropTypes from 'prop-types';
import immutable from 'immutable';

import WangEditor from 'components/WangEditor';
import { letterOptions, renderToKatex, filterHtmlForm, ifLessThan, addImgSrc } from './common';

class KidComplexQuestion extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.clickChildRadioItem = this.clickChildRadioItem.bind(this);
    this.changeTextContent = this.changeTextContent.bind(this);
    this.changeQuestion = this.changeQuestion.bind(this);
    this.state = {
      showEditor: true,
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.questionData.id !== this.props.questionData.id) {
      this.setState({ showEditor: false });
      this.timer = setTimeout(() => {
        this.setState({ showEditor: true });
      }, 20);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  clickChildRadioItem(index, i) {
    const { answerList } = this.props;
    const value = letterOptions[i];
    // const newData = questionData;
    // const oldStuAnswer = questionData.children[index].stuAnswer || '';
    // const newAnswer = oldStuAnswer.includes(value) ? oldStuAnswer.split('|').filter((it) => it.replace(/<br\s?\/?>/g, '').replace(/<[^>]+>[^</]*<\/[^>]+>/g, '').replace(/<[^>]+>/g, '')) : value;
    // newData.children[index].stuAnswer = newAnswer;
    // this.changeQuestion(newData);
    const oldStuAnswer = answerList.getIn([index, 'stuAnswer']) || '';
    const oldAnswerList = oldStuAnswer.replace(/^\||\|$/g, '').split('|').filter(it => it.replace(/<br\s?\/?>/g, '').replace(/<[^>]+>[^</]*<\/[^>]+>/g, '').replace(/<[^>]+>/g, '') !== value);
    let newAnswer = '';
    if (oldStuAnswer.includes(value)) {
      newAnswer = oldAnswerList.join('|');
    } else {
      oldAnswerList.push(value);
      newAnswer = oldAnswerList.join('|');
    }
    this.changeQuestion(newAnswer.replace(/^\||\|$/g, ''), index);
  }

  changeTextContent(index, value) {
    this.changeQuestion(value, index);
  }

  changeQuestion(value, i) {
    const { changeQuestion } = this.props;
    if (changeQuestion) {
      changeQuestion(value, i);
    }
  }

  render() {
    const { questionData, answerList } = this.props;
    const { showEditor } = this.state;
    const children = questionData.children || [];
    return (
      <div className="ScrollBox">
        <div className="content" dangerouslySetInnerHTML={{ __html: questionData.title || '' }} />
        <div>
          {children.map((item, index) => {
            let res = '';
            const title = item.title || '';
            const optionList = item.optionList || [];
            const childAnswer = answerList.getIn([index, 'stuAnswer']) || '';
            // console.log(answerList.toJS(), answerList.get(index).toJS(), 'childAnswer');
            // console.log(childAnswer, index, childAnswer.includes(letterOptions[index]), 'index');
            switch (item.typeId) {
              case 2:
                res = (
                  <div className="ChildItemWrpper" key={index}>
                    <div className="ChildTitleWrapper">
                      <p>{`(${index + 1})`}</p>
                      <div style={{ width: 5 }} />
                      {filterHtmlForm(title)
                        ? <div dangerouslySetInnerHTML={{ __html: renderToKatex(title) }} /> : ''}
                    </div>
                    {optionList.length > 0
                      ? optionList.map((it, i) => {
                        const checked = childAnswer.includes(letterOptions[i]);
                        return (
                          <div className="ChildAnswerOptionWrapper" key={i} onClick={() => this.clickChildRadioItem(index, i)}>
                            <div className={`ChildAnswerOption ${checked ? 'own-checked' : 'other-checked'}`}>{letterOptions[i]}</div>
                            <div checked={checked} dangerouslySetInnerHTML={{ __html: renderToKatex(it) }} />
                          </div>
                        );
                      }) : ''}
                  </div>
                );
                break;
              default:
                res = (
                  <div className="ChildItemWrpper" key={index}>
                    <div className="ChildTitleWrapper">
                      <p>{`(${index + 1})`}</p>
                      <div style={{ width: 5 }} />
                      {filterHtmlForm(title)
                        ? <div dangerouslySetInnerHTML={{ __html: renderToKatex(title) }} /> : ''}
                    </div>
                    {showEditor ? (
                      <WangEditor
                        data={{ index, content: addImgSrc(childAnswer, 'stuAnswer') }}
                        editorId={`editor${ifLessThan(index)}`}
                        changeContent={this.changeTextContent}
                        dataType="text"
                        header="customize1"
                        styleType={1}
                      />
                    ) : ''}
                  </div>
                );
                break;
            }
            return res;
          })}
        </div>
      </div>
    );
  }
}

KidComplexQuestion.propTypes = {
  questionData: PropTypes.object.isRequired,
  changeQuestion: PropTypes.func.isRequired,
  // showEditor: PropTypes.bool,
  answerList: PropTypes.instanceOf(immutable.List),
};

export default KidComplexQuestion;

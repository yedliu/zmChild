import React from 'react'
import PropTypes from 'prop-types'
import { letterOptions, renderToKatex, filterHtmlForm, makeAwnserStr } from './common'

class QuestionItemContent extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { questionData, isWrongQuestion } = this.props
    const children = questionData.children || []
    return (
      <div className="ContentScrollBox">
        <div className="content" dangerouslySetInnerHTML={{ __html: questionData.title || '' }} />
        <div>
          {children.map((item, index) => {
            let res = ''
            const title = item.title || ''
            const optionList = item.optionList || []
            const stuAnswer = item.stuAnswer || ''
            // console.log(isWrongQuestion, Number(item.correctResult), 'item - isWrongQuestion');
            const correctResult = item.correctResult || 0
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
                      ? optionList.map((it, i) => (
                        <div className="ChildAnswerOptionWrapper" key={i} onClick={() => this.clickChildRadioItem(index, i)}>
                          <div className="ChildAnswerOption">{letterOptions[i]}</div>
                          <div className="QuestionOptions" dangerouslySetInnerHTML={{ __html: renderToKatex(it) }} />
                        </div>
                      )) : ''}
                    <div className="ContentAnswer">
                      <p style={{ color: '#333', minWidth: 70, fontFamily: '思源黑体 CN Normal,Microsoft YaHei' }}>我的答案：</p>
                      <p dangerouslySetInnerHTML={{ __html: stuAnswer.split('|').join('、') }} />
                      <div className="CorrectResult" prompt={correctResult}>{makeAwnserStr(correctResult)}</div>
                    </div>
                    {/* <ContentAnswer style={{ color: '#666' }}>
                  <p style={{ marginRight: 10 }}>得分</p>
                  <p>{`${stuGetScore}分/共${itemScore}分`}</p>
                </ContentAnswer> */}
                  </div>
                )
                break
              default:
                res = (
                  <div className="ChildItemWrpper" key={index}>
                    <div className="ChildTitleWrapper">
                      <p>{`(${index + 1})`}</p>
                      <div style={{ width: 5 }} />
                      {filterHtmlForm(title)
                        ? <div dangerouslySetInnerHTML={{ __html: renderToKatex(title) }} /> : ''}
                    </div>
                    <div className="ContentAnswer">
                      <p style={{ color: '#333', minWidth: 70 }}>我的答案：</p>
                      <p dangerouslySetInnerHTML={{ __html: stuAnswer }} />
                      <div className={`CorrectResult correctResult${correctResult}`}>{makeAwnserStr(correctResult)}</div>
                    </div>
                  </div>
                )
                break
            }
            return res
          })}
        </div>
      </div>
    )
  }
}

QuestionItemContent.propTypes = {
  questionData: PropTypes.object.isRequired,
  isWrongQuestion: PropTypes.bool,
}

export default QuestionItemContent

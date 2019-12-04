import React from 'react'
import PropTypes from 'prop-types'
import { renderToKatex } from './common'

const formatAnswerList = (list, isChoice) => {
  let res = ''
  if (isChoice) {
    res = list.join('') || ''
  } else {
    res = list.length > 1 ? (list.map((answer, i) => answer.replace('<p>', `<p>${i + 1}、`)).join('') || '') : list[0]
  }
  return res
}

class QuestionItemTitle extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { questionData } = this.props
    const children = questionData.children || []
    return (
      <div className="MyAnswerBox">
        <div className="AnswerTitle">答案和解析</div>
        {children.map((item, index) => {
          const isChoice = item.typeId === 2
          const answer = formatAnswerList(item.answerList || [], isChoice)
          const analysis = item.analysis || ''
          return (
            <div key={index}>
              <div className="ContentAnswer">
                <p className={`text-right ${isChoice ? 'font-family-select' : ''}`} style={{ minWidth: 78 }}>{`（${index + 1}）答案：`}</p>
                <p dangerouslySetInnerHTML={{ __html: renderToKatex(isChoice ? answer.split('|').join('、') : answer) }} />
              </div>
              <div className="ContentAnswer">
                <p className="text-right" style={{ minWidth: 78 }}>解析：</p>
                <p dangerouslySetInnerHTML={{ __html: renderToKatex(analysis) }} />
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

QuestionItemTitle.propTypes = {
  questionData: PropTypes.object.isRequired,
}

export default QuestionItemTitle

/**
 * 答案
 */
import React from 'react'
import { renderToKatex } from '../common'

const AnswerList = (props) => {
  const { label = '答案：', answerList } = props
  return (
    <div className="answerList-wrapper">
      <div className="answerList-item-label">{label}</div>
      <div className="answerList-item-content">
        {answerList.map((it, i) => {
          return (<div key={i} className="answerList-item" dangerouslySetInnerHTML={{ __html: renderToKatex(it) }} />)
        })}
      </div>
    </div>
  )
}

export default AnswerList

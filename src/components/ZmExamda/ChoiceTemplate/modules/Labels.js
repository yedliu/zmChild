/**
 * labels
 */
import React from 'react'

const Labels = (props) => {
  const { question, inlineList, split } = props
  return (
    <div className="labels-wrapper">
      {inlineList.map((item, index) => (
        <div key={index} className="labels-item-wrapper">
          <div className="labels-item">
            {item.label}
            {question.get(item.key) || ''}
          </div>
          {(index < inlineList.length - 1 && split) ? split : ''}
        </div>
      ))}
    </div>
  )
}

export default Labels

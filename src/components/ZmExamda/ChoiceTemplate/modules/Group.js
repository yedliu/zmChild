/**
 * 组合显示
 */
import React from 'react'
import { isString, isObject, renderToKatex } from '../common'
import { stringLabelList } from '../questionConfig'
import AnswerList from './AnswerList'
import KnowledgeNameList from './KnowledgeNameList'

const ChoiceShowWay = (props) => {
  const { type, label, content, index } = props
  let res = ''
  if (type === 'answerList') {
    res = <AnswerList type={index} label={label} answerList={content} />
  } else if (type === 'knowledgeNameList') {
    res = <KnowledgeNameList type={index} label={label} knowledgeNameList={content} />
  } else {
    res = (
      <div type={index} className={`group-item group-item-${type}`}>
        <div className={`group-item-label group-item-${type}-label`}>{stringLabelList[type]}</div>
        <div className={`group-item-content group-item-${type}-content`} dangerouslySetInnerHTML={{ __html: renderToKatex(content) }} />
      </div>
    )
  }
  return res
}

const GroupItem = (props) => {
  const { options, question } = props; // eslint-disable-line
  return (
    <div className="group-wrapper">
      {options.map((item, index) => {
        let res = ''
        if (isString(item)) {
          const content = question.get(item) || ''
          res = <ChoiceShowWay key={index} type={item} content={content} index={index} />
        } else if (isObject(item)) {
          const content = question.get(item.key) || ''
          res = <ChoiceShowWay key={index} type={item.key} label={item.label} content={content} index={index} />
        }
        return res
      })}
    </div>
  )
}

export default GroupItem

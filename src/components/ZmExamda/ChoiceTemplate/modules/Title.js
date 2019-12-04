/**
 * 题目题干
 */
import React from 'react'
import {
  renderToKatex,
  isNumber,
  changeIndex,
} from '../common'

import OptionList from '../MultipleChoice/OptionList'

const Title = (props) => {
  const { index, indexType, content, optionList, interactive, changeSelected, stuAnswer, showCorrection, answerList } = props; // eslint-disable-line
  const indexShowString = !isNumber(index)
  return (
    <div className="title-wrapper">
      {index ? <div className="question-index">{indexShowString ? index : changeIndex(index, indexType)}</div> : ''}
      {/* {content ? <div className="title-content" dangerouslySetInnerHTML={{ __html: renderToKatex(content) }}></div> : ''} */}
      <div className="title-content" dangerouslySetInnerHTML={{ __html: renderToKatex(content) }} />
      {optionList && optionList.count() > 0 ? (
        <OptionList
          changeSelected={changeSelected} // 选中内容时回调
          interactive={interactive} // 是否可交互
          optionList={optionList} // 选项内容
          stuAnswer={stuAnswer}
          answerList={answerList}
          showCorrection={showCorrection}
        />
      ) : ''}
    </div>
  )
}

export default Title

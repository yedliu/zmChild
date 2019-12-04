import React from 'react'

const KnowledgeNameList = (props) => {
  const { knowledgeNameList, label = '知识点：', split = '、' } = props
  return (
    <div className="knowledgeNameList-wrapper">
      <div className="knowledgeNameList-label">{label}</div>
      <div className="knowledgeNameList-content">{knowledgeNameList.join(split)}</div>
    </div>
  )
}

export default KnowledgeNameList

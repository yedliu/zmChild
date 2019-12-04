/**
 * 题目分配
 */
import React from 'react'
import ComplexQuestion from './ComplexQuestion'
import MultipleChoice from './MultipleChoice'
import FillBlank from './FillBlank'
import ShortAnswer from './ShortAnswer'
import './ChoiceTemplate.css'

class ChoiceTemplate extends React.PureComponent { // eslint-disable-line
  constructor() {
    super()
    this.choiceTemplate = this.choiceTemplate.bind(this)
  }

  choiceTemplate() {
    const { question } = this.props; // eslint-disable-line
    switch (question.get('templateType')) {
      case 1:
        return <ComplexQuestion {...this.props} />
      case 2:
        return <MultipleChoice {...this.props} />
      case 3:
        return <FillBlank {...this.props} />
      case 4:
        return <ShortAnswer {...this.props} />
      default:
        return (<div className="noTemplate">未找到对应模板</div>)
    }
  }

  render() {
    return (
      <div className="choice-template-wrapper">
        {this.choiceTemplate()}
      </div>
    )
  }
}

export default ChoiceTemplate

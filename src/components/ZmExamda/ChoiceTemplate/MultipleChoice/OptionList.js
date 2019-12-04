/**
 * 选项
 */
import React from 'react'
import OptionItem from './OptionItem'
import { numberToLetter } from '../common'

class OptionList extends React.PureComponent {
  constructor() {
    super()
    this.changesort = this.changesort.bind(this)
    this.getRect = this.getRect.bind(this)
    this.changeSelected = this.changeSelected.bind(this)
    this.state = {
      rectList: [],
    }
  }
  getRect(rect) { // eslint-disable-line
    // console.log(rect, 'in OptionList');
  }
  changesort(rect) { // eslint-disable-line

  }

  changeSelected(index) {
    const { changeSelected } = this.props; // eslint-disable-line
    changeSelected(index)
  }

  render() {
    const { optionList, interactive, stuAnswer, answerList, showCorrection } = this.props; // eslint-disable-line
    return (
      <div className="optionList-wrapper">
        {optionList.map((item, i) => {
          const index = numberToLetter(i)
          const stuSelected = stuAnswer.indexOf(index) > -1
          const answerRight = answerList.includes(index)
          let answerType = null
          if (!showCorrection) {
            answerType = stuSelected ? 'active' : null
          } else if (answerRight && stuSelected) {
            answerType = 'answerRight'
          } else if (!answerRight && stuSelected) {
            answerType = 'answerError'
          } else if (stuSelected) {
            answerType = 'active'
          }
          return (
            <OptionItem
              key={i}
              index={index}
              content={item}
              getRect={this.getRect}
              interactive={interactive}
              changeSelected={this.changeSelected}
          // active={active}
              answerType={answerType}
            />
          )
        })}
      </div>
    )
  }
}

export default OptionList

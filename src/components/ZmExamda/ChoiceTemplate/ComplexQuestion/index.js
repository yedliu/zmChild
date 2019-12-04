/**
 * ComplexQuestion
 */

import React from 'react'
import Children from 'components/ZmExamda/ChoiceTemplate/modules/Children'
// import MultipleChoice from '../MultipleChoice';
import Title from '../modules/Title'
import { isObject, fromJS } from '../common'

class ComplexQuestion extends React.PureComponent { // eslint-disable-line
  constructor(props) {
    super(props)
    this.changeSelected = this.changeSelected.bind(this)
  }

  changeSelected(index, value, childrenItem) {
    // console.log('changeSelected', index, value, childrenItem);
    const { question, interactive, handleChange } = this.props; // eslint-disable-line
    const children = question.get('children') || fromJS([])
    if (interactive && handleChange) {
      const isChoice = childrenItem.get('typeId') === 2
      let stuItemAnswer = childrenItem.get('stuAnswer') || ''
      console.log(stuItemAnswer.includes(value), 'stuItemAnswer.includes(value)')
      if (isChoice) {
        if (stuItemAnswer.includes(value)) {
          stuItemAnswer = stuItemAnswer.replace(new RegExp(value, 'g'), '').replace(/^\||\|$/, '')
        } else {
          stuItemAnswer = stuItemAnswer.replace(/[^A-Z|]/, '').split('|')
          stuItemAnswer.push(value)
          stuItemAnswer = Array.from(new Set(stuItemAnswer)).join('|').replace(/^\||\|$/, '')
        }
      } else {
        stuItemAnswer = value
      }
      const stuAnswer = children.toJS().map((it, i) => {
        const res = { id: it.id, stuAnswer: it.stuAnswer || '' }
        if (i === index) {
          res.stuAnswer = stuItemAnswer
        }
        return res
      })
      console.log(stuItemAnswer, stuAnswer, value)
      handleChange({ id: question.get('id'), stuAnswer })
    }
  }

  render() {
    const { index, question, options, interactive, showCorrection } = this.props; // eslint-disable-line
    const children = question.get('children') || fromJS([])
    const childrenShow = options.find(item => (item === 'children') || (item.key === 'children'))
    // const textArea = options.find((item) => item === 'answerArea' || item.key === 'answerArea');
    // const templateType = question.get('templateType');
    // console.log(children.toJS(), childrenShow, 'children');
    return (
      <div className="complex-wrapper">
        <Title
          index={index}
          content={question.get('title')}
          interactive={interactive}
        />
        {childrenShow ? (
          <Children
            indexType={childrenShow.indexType || 'number'}
            dataList={children}
            interactive={interactive}
            changeSelected={(i, value, childrenItem) => this.changeSelected(i, value, childrenItem)}
          />
        ) : ''}
        {/* {childrenShow ? <div className="children-wrapper">
        {children.map((item, i) => {
          // const childrenTitle = item.get('title') || '';
          const childrenOptions = ['title'];
          if (textArea) {
            childrenOptions.push(textArea);
          }
          return (<div key={i} className="children-item-wrapper">
            <Title
              index={i + 1}
              content={childrenTitle}
              indexType={childrenShow.indexType || 'number'}
              interactive={interactive}
              changeSelected={(value) => this.changeSelected(i, value, (item || fromJS({})).toJS())}
              optionList={item.get('typeId') === 2 ? item.get('optionList') : fromJS([])}
            />
            <MultipleChoice index={i + 1} handleChange={handleChange} interactive={interactive} options={childrenOptions} question={item}></MultipleChoice>
          </div>);
        })}
      </div> : ''} */}
      </div>
    )
  }
}

export default ComplexQuestion

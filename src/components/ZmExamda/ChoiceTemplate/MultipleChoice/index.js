/**
 * 选择题
 */
import React from 'react'
import Labels from 'components/ZmExamda/ChoiceTemplate/modules/Labels'
import Title from 'components/ZmExamda/ChoiceTemplate/modules/Title'
import Group from 'components/ZmExamda/ChoiceTemplate/modules/Group'
// import Children from 'components/ZmExamda/ChoiceTemplate/modules/Children';
import RichEditor from 'components/ZmExamda/ChoiceTemplate/modules/RichEditor'
import KnowledgeNameList from 'components/ZmExamda/ChoiceTemplate/modules/KnowledgeNameList'
import {
  isString,
  isObject,
  isArray,
  reSortOption,
  fromJS,
} from '../common'

class MultipleChoice extends React.PureComponent {
  constructor() {
    super()
    this.changeSelected = this.changeSelected.bind(this)
  }

  changeSelected(value) {
    const { question, interactive, handleChange } = this.props; // eslint-disable-line
    console.log('question', question.toJS())
    if (interactive && handleChange) {
      const isSingle = question.get('typeId') === 1
      let stuAnswer = question.get('stuAnswer') || ''
      // console.log(stuAnswer.includes(value), 'stuAnswer.includes(value)');
      if (isSingle) {
        stuAnswer = value
      } else if (stuAnswer.includes(value)) {
        stuAnswer = stuAnswer.replace(new RegExp(value, 'g'), '').replace(/^\||\|$/, '').replace(/\|\|/g, '|')
      } else {
        stuAnswer = stuAnswer.replace(/[^A-Z|]/, '').split('|')
        stuAnswer.push(value)
        stuAnswer = Array.from(new Set(stuAnswer)).join('|').replace(/^\||\|$/, '')
      }
      // console.log(isSingle, stuAnswer, value);
      handleChange({ id: question.get('id'), stuAnswer })
    }
  }

  render() {
    const { index, question, options, interactive, showCorrection } = this.props; // eslint-disable-line
    const newOptionList = reSortOption(options)
    const answerList = question.get('answerList') || fromJS([])
    const templateType = question.get('templateType')
    return (
      <div className="multiple-choice-wrapper active active-primary" style={{ position: 'relative' }}>
        {newOptionList.map((item, i) => {
          let res = ''
          if (isString(item)) {
            if (item === 'title') {
              res = (
                <Title
                  key={i}
                  index={index}
                  content={question.get('title')}
                  stuAnswer={question.get('stuAnswer') || ''}
                  interactive={interactive}
                  changeSelected={this.changeSelected}
                  optionList={templateType === 2 ? question.get('optionList') : fromJS([])}
                  answerList={answerList}
                  showCorrection={showCorrection}
                />
              )
            } else if (item === 'answerArea') {
              res = interactive ? <RichEditor /> : ''
            } else if (item === 'knowledgeNameList') {
              res = (
                <KnowledgeNameList
                  key={i}
                  label="知识点："
                  knowledgeNameList={question.get(item)}
                  split="、"
                />
              )
            // } else if (item === 'children') {
            //   const dataList = question.get(item) || fromJS([]);
            //   // console.log(question.toJS(), dataList.toJS(), 'children');
            //   res = dataList.count() > 0 ? (<Children
            //     key={i}
            //     dataList={dataList}
            //     interactive={interactive}
            //   />) : '';
            }
          } else if (isArray(item)) {
            res = (
              <Group
                key={i}
                question={question}
                options={item}
              />
            )
          } else if (isObject(item)) {
            const type = item.key
            if (type === 'title') {
              res = (
                <Title
                  key={i}
                  index={index}
                  content={question.get('title')}
                  stuAnswer={question.get('stuAnswer') || ''}
                  interactive={interactive}
                  changeSelected={this.changeSelected}
                  optionList={templateType === 2 ? question.get('optionList') : fromJS([])}
                  answerList={answerList}
                  showCorrection={showCorrection}
                />
              )
            } else if (type === 'answerArea') {
              res = interactive ? <RichEditor /> : ''
            } else if (item.inlineList) {
              res = <Labels key={i} question={question} inlineList={item.inlineList} split={item.split} />
            // } else if (type === 'answerList') {
            //   res = <AnswerList key={i} label={item.label || ''} answerList={question.get(type)} />;
            // } else if (type === 'answerList') {
            //   res = <AnswerList key={i} label={item.label || ''} answerList={question.get(type)} />;
            } else if (type === 'knowledgeNameList') {
              res = <KnowledgeNameList key={i} label={item.label} knowledgeNameList={question.get(type)} split={item.split} />
            } else {
              res = ''
            }
          }
          return res
        })}
      </div>
    )
  }
}

export default MultipleChoice

import React from 'react'
import PropTypes from 'prop-types'
import { Map } from 'immutable'
import MatchFragment from './cartoonExamda/matchFragment'
import FillFragment from './cartoonExamda/fillFragment'
import SortFragment from './cartoonExamda/sortFragment'
import ChoiceTemplate from './ChoiceTemplate'
import Title from './ChoiceTemplate/modules/Title'
// import { matchData } from './cartoonExamda/data';
class ZmExamda extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      scale: 1,
    }
    this.resizeListener = null
    this.matchWith = 800
    this.renderExamda = this.renderExamda.bind(this)
    this.bindResize = this.bindResize.bind(this)
  }

  bindResize() {
    const { question } = this.props
    const newQuestion = question.get('questionOutputDTO') ? question.get('questionOutputDTO').merge(question.delete('questionOutputDTO')) : question
    const templateType = newQuestion.get('templateType')
    const stuAnswer = newQuestion.get('stuAnswer')
    if (templateType === 6) {
      const editBox = document.getElementById('matchBox')
      window.addEventListener('resize', this.resizeListener = () => {
        if (!editBox) return
        const parent = editBox.parentNode
        if (parent) {
          const parentWidth = parent.offsetWidth
          this.setState({
            scale: parentWidth / this.matchWith - 0.05,
          })
        }
      })
      this.resizeListener()
    }
  }

  componentDidMount() {
    this.bindResize()
  }

  componentDidUpdate() {
    this.bindResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener)
  }

  renderExamda() {
    const { question, showCorrection, showRightAnswer, ...otherProps } = this.props
    console.log('question111', question.toJS())
    const newQuestion = question.get('questionOutputDTO') ? question.get('questionOutputDTO').merge(question.delete('questionOutputDTO')) : question
    const templateType = newQuestion.get('templateType')
    // console.log(newQuestion.toJS(), 'newQuestion');
    if ([1, 2, 3, 4].includes(templateType)) {
      return <ChoiceTemplate {...otherProps} question={newQuestion} showCorrection={showCorrection} />
    }
    const title = newQuestion.get('title')
    switch (templateType) {
      case 5: // 分类
        return (
          <div key={question.get('id')}>
            <Title {...otherProps} content={title} />
            <SortFragment {...otherProps} question={newQuestion} showCorrection={showCorrection} showRightAnswer={showRightAnswer} stuAnswer={newQuestion.get('stuAnswer')} />
          </div>
        )
      case 6: // 配对
        console.log('showCorrection+showRightAnswer', showCorrection, showRightAnswer)
        // + (showCorrection ? 1 : 0) + (showRightAnswer ? 1 : 0)
        return (
          <div key={question.get('id')} id="matchBox" style={{ transform: `scale(${this.state.scale})`, width: this.matchWith, height: 'auto', transformOrigin: '0 0' }}>
            {/* <button onClick={() => this.setState({show: !this.state.show})}>点我</button> */}
            <Title {...otherProps} content={title} />
            {/* <MatchFragment
            {...otherProps}
            interactive
            showRightAnswer={this.state.show}
            question={newQuestion}
            stuAnswer={matchData} /> */}
            <MatchFragment key={question.get('id')} {...otherProps} showCorrection={showCorrection} showRightAnswer={showRightAnswer} question={newQuestion} stuAnswer={newQuestion.get('stuAnswer')} />
          </div>
        )
      case 7: // 选词填空
        return (
          <div key={question.get('id')}>
            <Title {...otherProps} content={title} />
            <FillFragment {...otherProps} showCorrection={showCorrection} showRightAnswer={showRightAnswer} question={newQuestion} stuAnswer={newQuestion.get('stuAnswer')} />
          </div>
        )
      default:
        return <span style={{ color: 'red', fontSize: '16px' }}> 未找到该题对应的模板</span>
    }
  }

  render() {
    return this.renderExamda()
  }
}

ZmExamda.defaultProps = {
  handleChange: () => { },
  stuAnswer: '',
}

ZmExamda.propTypes = {
  // question: PropTypes.instanceOf(Map).isRequired,
}

export default ZmExamda

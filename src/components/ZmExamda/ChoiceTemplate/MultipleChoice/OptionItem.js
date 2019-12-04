/**
 * 单个选项
 */
import React from 'react'
import { renderToKatex } from '../common'

const classInit = (classStart, type) => `${classStart}${type ? ` ${type}` : ''}`

class OptionItem extends React.PureComponent {
  // constructor() {
  //   super();
  // }
  componentDidMount() {
    // console.log(this.optionItemWrapper);
    const { getRect } = this.props; // eslint-disable-line
    const optionItemWidth = this.optionItem ? this.optionItem.offsetWidth : 0
    const optionItemIndexWidth = this.optionItemIndex ? this.optionItemIndex.offsetWidth : 0
    const optionItemContentWidth = this.optionItemContent ? this.optionItemContent.offsetWidth : 0
    getRect(optionItemIndexWidth + optionItemContentWidth, optionItemWidth)
  }

  render() {
    const { index, content, interactive, changeSelected, answerType } = this.props; // eslint-disable-line
    return (<div // eslint-disable-line
      className={classInit('optionList-item-wrapper', answerType)}
      ref={x => this.optionItem = x} // eslint-disable-line
      onClick={(e) => {
        if (!interactive) return
        e.stopPropagation()
        changeSelected(index)
      }}
    >
      {index ? (
        <div
          className={classInit('optionList-item-index', answerType)}
        // className={`optionList-item-index${active && interactive ? ' active' : ''}`}
          ref={x => this.optionItemIndex = x}
        >
          {index}
          {!interactive ? '.' : ''}
        </div>
      ) : ''}
      <div
        // className={`optionList-item-content${active && interactive ? ' active' : ''}`}
        className={classInit('optionList-item-content', answerType)}
        ref={x => this.optionItemContent = x}  // eslint-disable-line
        dangerouslySetInnerHTML={{ __html: renderToKatex(content) }}
      />
    </div>)
  }
}

export default OptionItem

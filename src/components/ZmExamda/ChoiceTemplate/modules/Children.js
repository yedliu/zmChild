/**
 * 子题
 */

import React from 'react'
import Title from './Title'
import RichEditor from './RichEditor'
import { fromJS } from '../common'

class Children extends React.PureComponent { // eslint-disable-line
  constructor() {
    super()
    this.changeSelected = this.changeSelected.bind(this)
    this.richEditChangeContent = this.richEditChangeContent.bind(this)
  }

  changeSelected(index, value, item) {
    const { changeSelected } = this.props; // eslint-disable-line
    // console.log(index, value, item, 'changeSelected - Children');
    changeSelected(index, value, item)
  }

  richEditChangeContent(index, value, item) {
    const { changeSelected } = this.props; // eslint-disable-line
    // console.log(index, value, item, 'richEditChangeContent');
    changeSelected(index, value, item)
  }

  render() {
    const { indexType, dataList, interactive } = this.props; // eslint-disable-line
    return (
      <div className="complex-children-wrapper">
        {dataList.map((item, i) => {
          const title = item.get('title') || ''
          const typeId = item.get('typeId')
          const childOptionList = typeId === 2 ? item.get('optionList') : fromJS([])
          return (
            <div key={i} className="complex-children-item-wrapper">
              {(title || childOptionList.count() > 0) ? (
                <Title
                  index={i + 1}
                  interactive={interactive}
                  content={title}
                  optionList={childOptionList}
                  indexType={indexType}
                  changeSelected={value => this.changeSelected(i, value, item)}
                />
              ) : ''}
              {interactive && typeId !== 2 ? <RichEditor onChange={(e, value) => this.richEditChangeContent(i, value, item)} /> : ''}
            </div>
          )
        })}
      </div>
    )
  }
}

export default Children

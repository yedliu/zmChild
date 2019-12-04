/**
 * 1.showCorrection 批改
 * 2.showRightAnswer 正确展示结果
 * 3.interactive 是否交互
 * 4.handleChange 每次改变答案触发的方法
 * 5.question 题目
 * 6.stuAnswer 学生答案
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Draggable, { DraggableCore } from 'react-draggable';
import Immutable, { fromJS } from 'immutable';
import AbstractFragment from './index';

import './fill.scss';

const noop = () => { };

let dragging = false;
let dragNodeIndex = null;
let dragNodeStartX = 0;
let dragNodeStartY = 0;
let dragNodeOffsetX = 0;
let dragNodeOffsetY = 0;

class FillFragment extends AbstractFragment {
  constructor(props) {
    super(props);
    const { question, stuAnswer } = this.props;
    this.state = {
      dragIndex: null, // 当前被拖拽的元素索引
      activeHoverElement: null, // 当前需高亮的空格
    };

    const content = question.get('content');
    const total = content.match(eval('/answerstring/ig')).length;
    this.state.answerListSelf = total ? new Array(total).fill('') : [];

    // 初始化答案
    try {
      if (stuAnswer) {
        const _answer = JSON.parse(stuAnswer);
        const optionList = question.get('optionList').toJS();
        const nameMap = {};
        optionList.map((item, index) => {
          nameMap[item] = index;
        });
        for (let i = 0; i < this.state.answerListSelf.length; i++) {
          this.state.answerListSelf[i] = nameMap[_answer[i]];
        }
      }
    } catch (e) {
      console.error('此题学生答案有误,id', question.get('id'));
    }

    console.log('answerListSelf', this.state.answerListSelf);

    this.dragStart = this.dragStart.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.drop = this.drop.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  // 可重写
  onChange(answer) {
    const { question, handleChange } = this.props;
    // 把id转成name
    const optionList = question.get('optionList').toJS();
    const nameAnswer = answer.map(id => optionList[id] || '');
    handleChange({
      id: question.get('id'),
      stuAnswer: JSON.stringify(nameAnswer),
    });
    console.log('最终答案', nameAnswer);
    // 重新渲染
    this.setState({
      answerListSelf: answer,
      forceUpdate: !this.state.forceUpdate,
    });
  }

  dragStart(dragIndex, event, detail) {
    dragging = true;
    if (!this.isInteractive()) return;
    const { answerListSelf } = this.state;
    dragNodeIndex = null;
    if (answerListSelf.indexOf(dragIndex) != -1) return;
    this.setState({ dragIndex });
    const { clientX, clientY } = event.touches && event.touches[0] || event;
    dragNodeIndex = dragIndex;
    dragNodeStartX = clientX;
    dragNodeStartY = clientY;
    dragNodeOffsetX = dragNodeOffsetY = 0;
  }

  dragOver(event, detail) {
    if (!this.isInteractive()) return;
    const { clientX, clientY } = event.touches && event.touches[0] || event;
    const target = document.elementFromPoint(clientX, clientY, this.fillBox);
    const activeHoverElement = target && target.tagName.toUpperCase() == 'ZMFILL' ? target : null;
    this.setState({ activeHoverElement, _time: +new Date() });
    if (dragNodeIndex == null) return;
    dragNodeOffsetX = (clientX - dragNodeStartX);
    dragNodeOffsetY = (clientY - dragNodeStartY);
  }

  drop(event, detail) {
    dragging = false;
    if (!this.isInteractive()) return;
    const { clientX, clientY } = event.changedTouches && event.changedTouches[0] || event;
    const target = document.elementFromPoint(clientX, clientY, this.fillBox);
    const { dragIndex } = this.state;
    const { answerListSelf } = this.state;
    dragNodeIndex = null;
    this.setState({ dragIndex: null, activeHoverElement: null });
    if (dragIndex == null) return;
    if (!target || target.tagName.toUpperCase() != 'ZMFILL') return;
    [...this.fillBox.getElementsByTagName('zmFill')].forEach((ele, index) => {
      if (ele != target) return;
      if (typeof answerListSelf[index] === 'number') return;
      answerListSelf[index] = dragIndex;
      this.onChange(answerListSelf);
    });
    dragNodeOffsetX = dragNodeOffsetY = 0;
  }

  render() {
    const { showCorrection, question, interactive } = this.props;
    const { dragIndex, activeHoverElement, answerListSelf } = this.state;
    const optionList = (question.get('optionList') || fromJS([])).toJS();
    const answerList = (question.get('answerList') || fromJS([])).toJS();
    const content = question.get('content') || '';
    const { showRightAnswer } = this.props;

    // 查找空格，填充样式
    setTimeout(() => {
      if (!this.fillBox) return;
      [...(this.fillBox.getElementsByTagName('zmFill') || [])].forEach((ele, index) => {
        // 获取对应空格内已经选择的内容
        let innerText = typeof answerListSelf[index] === 'number' ? optionList[answerListSelf[index]] : '';
        if (showRightAnswer) {
          innerText = answerList[index];
        }
        ele.innerText = innerText;
        // 可编辑时，增加删除按钮
        if (innerText) {
          const closeBtn = document.createElement('span');
          closeBtn.onclick = () => {
            if (!this.isInteractive()) return;
            answerListSelf[index] = '';
            this.onChange(answerListSelf);
          };
          closeBtn.innerHTML = '&times;';
          ele.appendChild(closeBtn);
        }
        // 增加是否填充标示
        innerText ? ele.classList.add('filled') : ele.classList.remove('filled');
        // 增加是否正确标示
        if (showCorrection) {
          const correct = showRightAnswer || optionList[answerListSelf[index]] == answerList[index];
          ele.classList.add(correct ? 'right' : 'wrong');
          ele.classList.remove(correct ? 'wrong' : 'right');
        } else {
          ele.classList.remove('right');
          ele.classList.remove('wrong');
        }
        if (ele == activeHoverElement) {
          !innerText && ele.classList.add('hover');
        } else {
          ele.classList.remove('hover');
        }
      });
    }, 0);

    const boxProps = {
      ref: dom => this.boxContainer = dom,
    };

    const contentProps = {
      ref: dom => this.fillBox = dom,
      className: 'fillContainer',
      dangerouslySetInnerHTML: { __html: content },
    };

    return (
      <div {...boxProps} className="fill-box-wrapper">
        <div className="content">
          <div className="corner_top_left">
            <span className="block1" />
            <span className="block2" />
          </div>
          <div className="corner_top_right">
            <span className="block1" />
            <span className="block2" />
          </div>
          <div className="corner_bottom_left">
            <span className="block1" />
            <span className="block2" />
          </div>
          <div className="corner_bottom_right">
            <span className="block1" />
            <span className="block2" />
          </div>
          <div {...contentProps} />
        </div>
        <div className="optionPoll">
          {optionList.map((option, index) => {
            const optionProps = {
              key: index,
              onStart: (event, detail) => this.dragStart(index, event, detail),
              onDrag: (event, detail) => this.dragOver(event, detail),
              onStop: (event, detail) => this.drop(event, detail),
            };
            const mockDragStyle = { position: 'relative', left: `${dragNodeOffsetX}px`, top: `${dragNodeOffsetY}px`, pointerEvents: 'none' };
            const childOption = {
              className: [answerListSelf.indexOf(index) == -1 ? '' : 'picked', dragNodeIndex == index ? 'active' : ''].join(' '),
              dangerouslySetInnerHTML: { __html: option },
              style: dragNodeIndex == index ? mockDragStyle : {},
            };
            return <DraggableCore {...optionProps}><span {...childOption} /></DraggableCore>;
          })}
        </div>
      </div>
    );
  }
}

FillFragment.defaultProps = {
};

FillFragment.propTypes = {
  question: PropTypes.object.isRequired,
  showCorrection: PropTypes.bool,
  showRightAnswer: PropTypes.bool,
  handleChange: PropTypes.func,
  interactive: PropTypes.bool,
  stuAnswer: PropTypes.string,
};

export default FillFragment;

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
import Immutable, { fromJS } from 'immutable';
import AbstractFragment from './index';
import './match.scss';

const noop = () => { };

class MatchFragment extends AbstractFragment {
  constructor(props) {
    super(props);
    this.state = {
      matchItem: [], // 两个配对的暂存数组
      matchList: [], // 配对列表
      layoutStyle: this.props.question.get('layoutStyle') || 1, // 配对方式 1文字 2文图 3图图
      children: (this.props.question.get('children') || fromJS([])).toJS(), // 配对题项目数据
    };

    this.initStuAnswer(this.props.stuAnswer);
  }

  initStuAnswer(stuAnswer) {
    // 把配对题分成两队
    const top = [];
    const bottom = [];
    // debugger
    this.state.children.map((item, index) => {
      if (!item.subQuestionMemberList) {
        item.subQuestionMemberList = [{}, {}];
      }
      top.push(item.subQuestionMemberList[0]);
      bottom.push(item.subQuestionMemberList[1]);
    });

    // 按展示先后排序
    const compare = (a, b) => a.showOrder > b.showOrder;

    top.sort(compare);
    bottom.sort(compare);
    // 初始化答题结果
    let myAnswer = {};
    if (stuAnswer && stuAnswer.length > 0 && JSON.parse(stuAnswer).top) {
      // 展示之前答过的信息
      try {
        myAnswer = JSON.parse(stuAnswer);
      } catch (err) {
        console.warn('答案格式不正确');
      }

      top.map((item, index) => { Object.assign(item, myAnswer.top[index]); });
      bottom.map((item, index) => { Object.assign(item, myAnswer.bottom[index]); });
    }
    this.state.top = top;
    this.state.bottom = bottom;
    this.state.checkRightAnswer = false;
    this.state.showRightAnswer = false;
    this.state.matchList = myAnswer.matchList || [];
  }

  checkRightAnswer() {
    const { top, bottom, children, matchList } = this.state;
    const compareMatchList = (obj1, obj2) => obj1[0].showOrder - obj2[0].showOrder;
    top.map((item, index) => { Object.assign(item, { isRight: false }); });
    bottom.map((item, index) => { Object.assign(item, { isRight: false }); });
    matchList.sort(compareMatchList);
    try {
      matchList.map((item, index) => {
        const isRightAnswer = item[1].id == children[item[0].showOrder].subQuestionMemberList[1].id;
        item.map((innerItem, innerIndex) => {
          Object.assign(innerIndex == 0 ? top[innerItem.showOrder] : bottom[innerItem.showOrder], { isRight: !!isRightAnswer });
          Object.assign(innerItem, { isRight: !!isRightAnswer });
        });
      });
    } catch (error) {
      matchList.map((item, index) => {
        item.map((innerItem, innerIndex) => {
          Object.assign(innerItem, { isRight: true });
        });
      });
      console.error('数据有误');
    }
    this.setState({
      checkRightAnswer: true,
      matchList,
    });
  }

  showRightAnswer() {
    const { top, bottom, children, matchList } = this.state;
    const tmpMatchList = [];
    const addActive = (item, bool) => {
      item.active = bool;
      return item;
    };
    children.map((a, index) => {
      const sub = a.subQuestionMemberList;
      sub.map(b => addActive(b));
      tmpMatchList.push(sub);
    });
    top.map(item => addActive(item, true));
    bottom.map(item => addActive(item, true));
    this.setState({
      showRightAnswer: true,
      matchList: tmpMatchList,
    });
  }

  onChange() {
    const { matchList, top, bottom } = this.state;
    const { question, handleChange } = this.props;
    const compareMatchList = (a, b) => a[0].showOrder - b[0].showOrder;
    const tmpMatchList = matchList.slice();
    tmpMatchList.sort(compareMatchList);
    const stuAnswer = JSON.stringify({ top, bottom, matchList: tmpMatchList });
    handleChange({
      id: question.get('id'),
      stuAnswer,
    });
    this.setState({
      forceUpdate: !this.state.forceUpdate,
    });
  }

  componentWillReceiveProps(nextProps) {
    // const { stuAnswer = '' } = this.props;
    // if (nextProps.showRightAnswer) {
    //   this.showRightAnswer();
    // } else if (nextProps.showCorrection) {
    //   this.initStuAnswer(nextProps.stuAnswer);
    //   this.checkRightAnswer();
    // } else if (nextProps.stuAnswer != stuAnswer) {
    //   this.initStuAnswer(nextProps.stuAnswer);
    // }

    const { stuAnswer = '', showCorrection, showRightAnswer } = this.props;
    if (nextProps.showRightAnswer) {
      this.showRightAnswer();
    } else if (nextProps.showCorrection) {
      this.initStuAnswer(nextProps.stuAnswer);
      this.checkRightAnswer();
    } else if (nextProps.stuAnswer != stuAnswer) {
      this.initStuAnswer(nextProps.stuAnswer);
    } else if (nextProps.showCorrection != showCorrection || nextProps.showRightAnswer != showRightAnswer) {
      this.initStuAnswer(nextProps.stuAnswer);
    }
  }

  componentDidMount() {
    const { showRightAnswer, showCorrection } = this.props;
    if (showRightAnswer) {
      this.showRightAnswer();
    } else if (showCorrection) {
      this.checkRightAnswer();
    }
  }

  render() {
    const { showCorrection, interactive = false,
      showRightAnswer } = this.props;
    const { layoutStyle, children, top, bottom,
      matchItem, matchList } = this.state;
    let topWidthNum = 0;
    top.map((item, index) => {
      const { type, content } = item;
      type == 'text' && content.length > 20 && (topWidthNum += 2);
      type == 'text' && content.length <= 20 && (topWidthNum += 1);
      type == 'text' || (topWidthNum += 1);
    });
    // 除数+1以留出一个单位的margin空间， 上面用topWidthNum下面不用是因为只有top上面才有文字的适配
    const topWidth = 95 / (topWidthNum + 1) > 16 ? 16 : (95 / (topWidthNum + 1));
    const bottomWidth = 95 / (top.length + 1) > 16 ? 16 : (95 / (top.length + 1));

    // setMatchItem 和 removeLine是关键函数， 一切的状态数据改动以上面定义的top 和bottom数组为准， 对top和bottom数组进行改动后，再将值重新赋值给this.state的两个状态值，切勿直接修改this.state,除非保证修改了与top bottom数组保持一致
    const setMatchItem = (item) => {
      // 当待选项目只有一个的时候，判断是否同一个位置，如果是，就去除原来子项的选定状态
      const { matchItem } = this.state;
      if (matchItem.length == 1 && matchItem[0].pos == item.pos) {
        const originIndex = matchItem[0].showOrder;
        Object.assign(item.pos == 'top' ? top[originIndex] : bottom[originIndex], { active: false });
        this.setState({ matchItem: [], update: !this.state.update }, () => { matchItem.push(item); });
        return;
      }

      matchItem.push(item);
      if (matchItem.length >= 2) {
        const curLinePos = matchList.length;
        matchItem.map((item, index) => { Object.assign(item, { curLinePos }); });
        // 这一步 将matchItem里top项排前
        if (matchItem[0].pos == 'bottom') {
          const tmpMatchItem = matchItem.splice(1, 1);
          matchItem.splice(0, 0, tmpMatchItem[0]);
        }
        matchList.push(matchItem);
        this.onChange();
        this.setState({ matchItem: [], update: !this.state.update });
      }
    };
    const removeLine = (item, index) => {
      const { matchItem } = this.state;
      // 当待选项目只有一个的时候，反选项目
      if (matchItem.length == 1 && item.showOrder == matchItem[0].showOrder && item.pos == matchItem[0].pos) {
        const originIndex = matchItem[0].showOrder;
        Object.assign(matchItem[0].pos == 'top' ? top[originIndex] : bottom[originIndex], { active: false });
        this.setState({ matchItem: [], update: !this.state.update });
        return;
      }

      // 将配对项目的两个子项的active置为false，并且删除配对项
      if (this.state.matchList[index]) {
        this.state.matchList[index].map((item, index) => {
          const originIndex = item.showOrder;
          Object.assign(item.pos == 'top' ? top[originIndex] : bottom[originIndex], { active: false });
        });
      }

      const thisMatchList = JSON.parse(JSON.stringify(this.state.matchList));
      thisMatchList.splice(index, 1);

      // 这一步将删除数组其中一项后的后面所有项目的 curLinePos - 1 处理
      thisMatchList.map((item, thisIndex) => {
        if (thisIndex >= index) {
          item.map((innerItem, innerIndex) => {
            const originIndex = innerItem.showOrder;
            Object.assign(innerItem.pos == 'top' ? top[originIndex] : bottom[originIndex], { curLinePos: (innerItem.curLinePos -= 1) });
            Object.assign(innerItem, innerItem.pos == 'top' ? top[originIndex] : bottom[originIndex]);
          });
        }
      });
      this.onChange();
      this.setState({ matchList: thisMatchList, update: !this.state.update });
    };

    const flexLayout = layoutStyle == 1 ? 'horizonLayout' : '';
    const isShowRightAnswer = showRightAnswer;
    const isCheckRightAnswer = showCorrection && this.state.checkRightAnswer;
    return (
      <div className="OuterDiv">
        <div id="boxWrapper" className={`${flexLayout}Wrapper`}>
          {matchList.map((item, index) => {
            return (
              <MatchLine
                children={children}
                coordinates={item}
                itemWidth={topWidth}
                key={index}
                layoutStyle={layoutStyle}
                showRightAnswer={isShowRightAnswer}
                isCheckRightAnswer={isCheckRightAnswer}
              />
            );
          })}
          <div className={`TopRow ${flexLayout}`}>
            {top.map((item, index) => {
              const matchItemConfig = {
                pos: 'top',
                width: topWidth,
                key: index,
                setMatchItem,
                item,
                removeLine,
                layoutStyle,
                showRightAnswer: isShowRightAnswer,
                isCheckRightAnswer,
                interactive,
              };

              return <MatchItem {...matchItemConfig} />;
            })}
          </div>
          <div className={`BottomRow ${flexLayout}`}>
            {bottom.map((item, index) => {
              const matchItemConfig = {
                pos: 'bottom',
                width: bottomWidth,
                key: index,
                setMatchItem,
                item,
                removeLine,
                layoutStyle,
                showRightAnswer: isShowRightAnswer,
                isCheckRightAnswer,
                interactive,
              };
              return <MatchItem {...matchItemConfig} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

const MatchLine = (props) => {
  const { coordinates, layoutStyle = 1, showRightAnswer, isCheckRightAnswer, itemWidth, children } = props;
  const offsetData = layoutStyle == 1 ? 400 * 0.05 : 1205 * itemWidth * 5 / 10000;
  let topItem;
  let bottomItem;
  let isRight;
  const getDomCoordinate = (id, pos, layoutStyle) => {
    try {
      const $dom = document.getElementById(`box${id}`);
      const element = $dom.getBoundingClientRect();
      const parent = $dom.offsetParent;
      let x;
      let y;
      if (layoutStyle == 1) {
        x = pos == 'top' ? (parent.offsetLeft + $dom.offsetLeft + $dom.offsetWidth) : (parent.offsetLeft + $dom.offsetLeft);
        y = $dom.offsetTop + $dom.offsetHeight / 2 + parent.offsetTop;
      } else {
        x = parent.offsetLeft + $dom.offsetLeft + $dom.offsetWidth / 2;
        y = pos == 'top' ? ($dom.offsetTop + $dom.offsetHeight + parent.offsetTop) : ($dom.offsetTop + parent.offsetTop);
      }
      return { x, y };
    } catch (e) {
      return {};
    }
  };
  coordinates.map((item, index) => {
    isRight = item.isRight;
    item.pos == 'top' && (topItem = item);
    item.pos == 'bottom' && (bottomItem = item);
  });
  let tx;
  let ty;
  let bx;
  let by;
  if (layoutStyle == 1) {
    tx = (getDomCoordinate(topItem.id, 'top', layoutStyle).x || topItem.x) - offsetData - 3;
    ty = topItem.y;
    bx = (getDomCoordinate(bottomItem.id, 'bottom', layoutStyle).x || bottomItem.x) + offsetData - 1;
    by = bottomItem.y;
  } else {
    tx = topItem.x;
    ty = topItem.y - offsetData - 1;
    bx = bottomItem.x;
    by = bottomItem.y + offsetData + 1;
  }

  const makeLine = () => {
    const a = bx - tx;
    const b = by - ty;
    const height = Math.sqrt(a * a + b * b);
    let radina;
    if (layoutStyle == 1) radina = (Math.asin(b / height)) - Math.PI / 2; else { radina = Math.asin(-a / height); }
    const angle = 180 / (Math.PI / radina);
    return { a, b, height, radina, angle };
  };
  const lineClass = showRightAnswer || (isCheckRightAnswer && isRight) ? ' rightLine'
    : (isCheckRightAnswer && !isRight) ? ' falseLine' : '';

  return (
    <div
      className="Line styleMatchLine"
      style={{
        left: `${tx || 0}px`,
        top: `${ty || 0}px`,
        height: `${makeLine().height}px`,
        transform: `rotate(${makeLine().angle}deg)`,
      }}
    >
      <div className={`insideLine ${lineClass}`} />
    </div>
  );
};

export class MatchItem extends AbstractFragment {
  constructor(props) {
    super(props);
    this.toggleActive = this.toggleActive.bind(this);
    this.getDomCoordinate = this.getDomCoordinate.bind(this);
  }

  getDomCoordinate() {
    const { layoutStyle = 1, item, pos } = this.props;
    const { showOrder, id } = item;
    const $dom = document.getElementById(`box${id}`);
    const element = $dom.getBoundingClientRect();
    const parent = $dom.offsetParent;
    let x;
    let y;
    if (layoutStyle == 1) {
      x = pos == 'top' ? (parent.offsetLeft + $dom.offsetLeft + $dom.offsetWidth) : (parent.offsetLeft + $dom.offsetLeft);
      y = $dom.offsetTop + $dom.offsetHeight / 2 + parent.offsetTop;
    } else {
      x = parent.offsetLeft + $dom.offsetLeft + $dom.offsetWidth / 2;
      y = pos == 'top' ? ($dom.offsetTop + $dom.offsetHeight + parent.offsetTop) : ($dom.offsetTop + parent.offsetTop);
    }
    return Object.assign(item, { pos, showOrder, x, y });
  }

  toggleActive() {
    const { setMatchItem = noop, removeLine, item,
      showRightAnswer, isCheckRightAnswer } = this.props;
    const { active } = item;
    if (!this.isInteractive()) {
      return;
    }
    const thisDom = this.dom;

    const itemInfo = this.getDomCoordinate();
    itemInfo.active = !active;
    const index = itemInfo.curLinePos || 0;
    // active ? removeLine(itemInfo, index) : setMatchItem(itemInfo);
    // this.setState({});
    this.setState({
      update: !this.state.update,
    }, () => {
      active ? removeLine(itemInfo, index) : setMatchItem(itemInfo);
    });
  }

  render() {
    const { setMatchItem = noop, removeLine = noop, pos,
      width, layoutStyle = 1, showRightAnswer,
      isCheckRightAnswer, interactive } = this.props;
    const { item } = this.props;
    const isActive = this.props.item.active;
    const { showOrder, type, content, id, isRight = false } = item;
    const widthNum = type == 'text' ? (content.length > 20 ? 2 : 1) : 1;
    const isShowLargeText = type == 'text' ? (content.length <= 7) : false;
    const itemId = showOrder;
    let boxClassName = isActive ? 'active' : isActive == false ? 'inactive' : '';
    boxClassName = layoutStyle == 1 ? (`horizonBox match-box-wrapper ${boxClassName}`) : (`match-box-wrapper ${boxClassName}`);
    boxClassName = showRightAnswer || (isCheckRightAnswer && isRight) ? (`rightBox ${boxClassName}`)
      : (isCheckRightAnswer && !isRight) ? (`falseBox ${boxClassName}`) : boxClassName;
    const boxConfig = {
      id: `box${id}`,
      // width,
      // widthNum,
      // showRightAnswer,
      // isCheckRightAnswer,
      // isRight,
      // className: boxClassName,
      ref: (dom) => {
        this.dom = dom;
        this.getDomCoordinate();
      },
      onClick: e => this.toggleActive(),
    };

    const thisImg = new Image();
    let thisImgWidth;
    let thisImgHeight;
    if (type == 'img') {
      thisImg.src = content;
      if (thisImg.width >= thisImg.height) {
        thisImgWidth = width * 12;
        thisImgHeight = width * 12 * thisImg.height / thisImg.width;
      } else {
        thisImgWidth = (width * 12 - 20) * thisImg.width / thisImg.height;
        thisImgHeight = width * 12 - 20;
      }
    }
    return (
      <div
        className={`boxContent ${boxClassName}`}
        style={{
          width: `${width * widthNum}%`,
          paddingBottom: `${width}%`,
        }}
        {...boxConfig}
      >
        {type == 'text'
          ? <div className="BoxContentWrapper horizonBoxTextWrapper"><div className="BoxTextContent" style={{ fontSize: isShowLargeText ? '28px' : '17px' }} className={layoutStyle == 1 ? 'horizonBoxTextContent boxTextContent' : 'boxTextContent'}>{content}</div></div>
          : <div className="BoxContentWrapper"><img draggable="false" width={thisImgWidth} height={thisImgHeight} src={content} /></div>}
        {/* {(!showRightAnswer && isCheckRightAnswer && !isRight) && <div  className={'FalseMask falseMask'} />} */}
      </div>
    );
  }
}


MatchFragment.propTypes = {
  question: PropTypes.object.isRequired,
  showCorrection: PropTypes.bool,
  interactive: PropTypes.bool,
  showRightAnswer: PropTypes.bool,
  handleChange: PropTypes.func,
  stuAnswer: PropTypes.string,
};

export default MatchFragment;

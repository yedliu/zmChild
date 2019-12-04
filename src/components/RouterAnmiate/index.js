import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Switch, withRouter } from 'dva/router';
import PropTypes from 'prop-types';

let lastLocation = { isPush: true };
const REACT_HISTORIES_KEY = 'REACT_HISTORIES_KEY';
const histories = (sessionStorage.getItem(REACT_HISTORIES_KEY) || '').split(',').filter(Boolean);
let timer = null;
const isHistoryPush = (location) => {
  // const key = location.key || location.pathname + location.search;
  // const key = location.pathname;
  const index = histories.lastIndexOf(location.pathname);
  clearTimeout(timer);
  timer = setTimeout(function() {
    if (index > -1) {
    histories.splice(index + 1);
    } else {
    histories.push(location.pathname);
    }
    sessionStorage.setItem(REACT_HISTORIES_KEY, histories.join(','));
  }, 50);

  return index < 0;

  // if (update && key !== lastLocation.key) {
  //   const index = histories.lastIndexOf(key);
  //   console.log('index', index)
  //   if (index > -1) {
  //     histories.splice(index + 1);
  //   } else {
  //     histories.push(key);
  //   }

  //   sessionStorage.setItem(REACT_HISTORIES_KEY, histories.join(','));

  //   lastLocation = {
  //     isPush: index < 0,
  //     key,
  //   };
  // }

  // return lastLocation.isPush;
};

class AnimatedRouter extends Component {
    static propTypes = {
      className: PropTypes.string,
      transitionKey: PropTypes.any,
      timeout: PropTypes.number,
      prefix: PropTypes.string,
      appear: PropTypes.bool,
      enter: PropTypes.bool,
      exit: PropTypes.bool,
      component: PropTypes.any,
      isShowWin: PropTypes.bool, // 如果是客户端，显示topbar时修改容器的高度
    };

    static defaultProps = {
      prefix: 'animated-router',
    };
  
    componentDidMount() {
      this.rootNode = findDOMNode(this);
    }

    inTransition = false;

    setInTransition = (isAdd) => {
      if (this.rootNode) {
        const inName = `${this.props.prefix}-in-transition`;

        this.rootNode.className = this.rootNode.className
          .split(/\s+/)
          .filter(name => name !== inName)
          .concat(isAdd ? inName : [])
          .join(' ');
      }
    }

    onEnter = (node) => {
      this.inTransition || this.setInTransition((this.inTransition = true));
      this.lastTransitionNode = node;
    };

    onEntering = (node) => {
      const { timeout } = this.props;
      if (node && typeof timeout === 'number') {
        node.style.transitionDuration = node.style.WebkitTransitionDuration = node.style.MozTransitionDuration = `${this.props.timeout}ms`;
      }
    };

    onEntered = (node) => {
      if (this.lastTransitionNode === node) {
        this.inTransition && this.setInTransition((this.inTransition = false));
      }

      if (node) {
        const { timeout } = this.props;

        // remove all transition classNames
        node.className = node.className
          .split(/\s+/)
          .filter(name => !/-(?:forward|backward)-(?:enter|exit)(?:-active)?$/.test(name))
          .join(' ');

        if (typeof timeout === 'number') {
          node.style.transitionDuration = node.style.WebkitTransitionDuration = node.style.MozTransitionDuration = '';
        }
      }
    };

    render() {
      const { className, location, children, timeout, prefix, appear, enter, exit, component, isShowWin } = this.props;
      const groupProps = {
        appear,
        enter,
        exit,
        component,
      };
      const cssProps = {
        onExit: this.onEnter,
        onExiting: this.onEntering,
        onExited: this.onEntered,
        onEnter: this.onEnter,
        onEntering: this.onEntering,
        onEntered: this.onEntered,
      };
      const cls = [`${prefix}-container`, 'react-animated-router', isShowWin ? 'kid-router-container' : '', className];

      return (
        <TransitionGroup
          className={cls.filter(Boolean).join(' ')}
          childFactory={(child) => {
            const classNames = `${prefix}-${isHistoryPush(location) ? 'forward' : 'backward'}`;

            return React.cloneElement(child, {
              classNames,
            });
          }}
          {...groupProps}
        >
          <CSSTransition
            key={this.props.transitionKey || location.pathname}
            addEndListener={(node, done) => {
              node.addEventListener(
                'transitionend',
                (e) => {
                  // 确保动画来自于目标节点
                  if (e.target === node) {
                    done();
                  }
                },
                false,
              );
            }}
            unmountOnExit
            timeout={timeout}
            {...cssProps}
          >
            <Switch location={location}>{children}</Switch>
          </CSSTransition>
        </TransitionGroup>
      );
    }
}

export default withRouter(AnimatedRouter);

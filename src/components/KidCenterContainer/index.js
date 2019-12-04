import './kidCenterConatiner.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import KidHeader from 'components/kidHeader';
import { routerRedux } from 'dva/router';

class KidCenterConatiner extends Component {
  static defaultProps = {
    menuList: [],
    title: '',
    currentMenu: '',
  }

  static propTypes = {
    title: PropTypes.string,
    currentMenuChange: PropTypes.func,
    menuList: PropTypes.array,
    currentMenuId: PropTypes.string,
  }

  changeMenu = (menuId) => {
    const { currentMenuChange } = this.props;
    currentMenuChange(menuId);
  }

  getScale = () => {
    // 按照设计稿尺寸 1170*660 等比缩放
    const { clientWidth, clientHeight } = document.body;
    const scaleX = clientWidth / 1170;
    const scaleY = clientHeight / 660;
    const scale = scaleX > scaleY ? scaleY : scaleX;
    const scaleStyle = {
      transform: `scale(${scale})`,
    };
    return scaleStyle;
  }

  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/kid',
    }));
  }

  render() {
    const { menuList, currentMenuId, history, title } = this.props;
    const scaleStyle = this.getScale();
    return (
      <div id="centerContainer">
        <KidHeader history={history} center={title} goBack={() => this.goBack()} />
        <div className="body">
          <div className="container">
            <div className="bg-line wire1 left item1" />
            <div className="bg-line wire2 left item2" />
            <div className="bg-line wire1 left item3" />
            <div className="bg-line wire1 left item4" />
            <div className="bg-line wire2 right item1" />
            <div className="bg-line wire1 right item2" />
            <div className="bg-line wire1 right item3" />
            <div className="bg-line wire1 right item4" />
            <div className="menu-bar">
              {
                menuList.map((item, index) => {
                  return (
                    <div className={currentMenuId === item.menuId ? 'menu active' : 'menu'} key={item.menuId} onClick={() => this.changeMenu(item.menuId)}>{item.title}</div>
                  );
                })
              }
            </div>
            <div className="main">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { KidCenterConatiner };

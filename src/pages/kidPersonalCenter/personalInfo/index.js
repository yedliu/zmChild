import './personalInfo.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import avatar_boy from './image/photo_boy_110@2x.png';
import avatar_girl from './image/photo_girl_110@2x.png';

class PersonalInfo extends Component {
  static defaultProps = {
    userInfo: {},
  }

  static propTypes = {
    userInfo: PropTypes.object,
  }

  render() {
    const { userInfo } = this.props;
    const noInfo = userInfo && (!userInfo.name || !userInfo.stuGrade || userInfo.sex === -1);
    const defaultAvatar = {
      backgroundImage: `url(${userInfo.sex == 0 ? avatar_girl : avatar_boy})`
    }
    return (
      <div id="personalInfo">
        <div className="photo-area">
          <div style={defaultAvatar} className="photo-bg">
            <img src={userInfo.avatar} alt="" />
          </div>
        </div>
        {
          userInfo.name
            ? (
              <div className="name-area">
                {' '}
                {userInfo.name}
                {' '}
              </div>
            )
            : ''
        }
        <div className={noInfo ? 'info-area empty' : 'info-area'}>
          {
            userInfo.sex === 1 ? (<div className="sex boy">男孩</div>)
              : userInfo.sex === 0 ? (<div className="sex girl">女孩</div>) : ''
          }
          {
            userInfo.stuGrade ? (
              <div className="grade">
                {userInfo.stuGrade}
              </div>
            ) : ''
          }
        </div>
        {
          noInfo
            ? (
              <div className="no-info">
              宝贝信息如果未设置请前往（掌门少儿）手机App进行设置
              </div>
            ) : ''
        }

      </div>
    );
  }
}

export { PersonalInfo };

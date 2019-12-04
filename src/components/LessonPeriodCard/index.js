import './lessonPeriodCard.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LessonPeriodCard extends Component {
  static defaultProps = {
    course: {},
    freezeInfoId: '',
    showingFreezeInfoId: '',
  }

  static propTypes = {
    changeShowingFreezeInfo: PropTypes.func,
    course: PropTypes.object,
    freezeInfoId: PropTypes.string,
    showingFreezeInfoId: PropTypes.string,
  }

  showFreezeInfo = (freezeInfoId) => {
    const { changeShowingFreezeInfo } = this.props;
    changeShowingFreezeInfo(freezeInfoId);
  }

  getCardClass = (courseName) => {
    let className = 'lesson-item';
    if (!courseName) return className;
    if (courseName.includes('特殊')) {
      className += ' special';
    }
    if (courseName.includes('vip') || courseName.includes('VIP')) {
      className += ' vip';
    }
    if (courseName.includes('名师')) {
      className += ' famous';
    }
    console.log(className);
    return className;
  }

  getReason = (reason) => {
    console.log(reason);
    const reasonArr = [];
    let reasonStr = '';
    reason.indexOf('0') !== -1 ? reasonArr.push('退费') : '';
    reason.indexOf('1') !== -1 ? reasonArr.push('上超') : '';
    reason.indexOf('2') !== -1 ? reasonArr.push('逾期') : '';
    const reasonLength = reason.length;
    reasonArr.forEach((item, index) => {
      reasonStr += item;
      index !== reasonLength ? reasonStr += '、' : '';
    });
    return `${reasonArr}冻结`;
  }

  render() {
    const { course, freezeInfoId, showingFreezeInfoId } = this.props;
    return (
      <div className={this.getCardClass(course.courseName)}>
        <div className="course-title">
          {course.courseName}
        </div>
        <div className="course-info">
          <div className="content">剩余</div>
          <div className="total">
            {course.totalRemainClass}
节
          </div>
          <div className="desc">
通用课时剩余
            {course.buyRemainCanUseClass}
节
          </div>
          {
            !course.giftRemainCanUseClass ? ''
              : (
                <div className="desc">
赠送课时剩余
                  {course.giftRemainCanUseClass}
节
                </div>
              )
          }
          {
            !course.buyRemainFreezeClass && !course.giftRemainFreezeClass ? ''
              : (
                <div className="freeze" onClick={() => this.showFreezeInfo(freezeInfoId)}>
                查看冻结课时
                  <div className={showingFreezeInfoId === freezeInfoId ? 'freeze-alert' : 'freeze-alert hidden'}>
                    <div className="freeze-alert-title">冻结详情如下：</div>
                    {
                    course.freezeCost && course.freezeCost.counts
                      ? (
                        <div className="freeze-alert-list">
通用课时冻结：
                          {course.freezeCost.counts}
节（
                          {this.getReason(course.freezeCost.reason)}
）
                        </div>
                      ) : ''
                  }
                    {
                    course.freezeGiftCost && course.freezeGiftCost.counts
                      ? (
                        <div className="freeze-alert-list">
赠送课时冻结：
                          {course.freezeGiftCost.counts}
节（
                          {this.getReason(course.freezeGiftCost.reason)}
）
                        </div>
                      ) : ''
                  }
                  </div>
                </div>
              )
          }
        </div>
      </div>
    );
  }
}

export { LessonPeriodCard };

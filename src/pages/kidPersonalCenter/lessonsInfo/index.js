import './lessonsInfo.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LessonPeriodCard } from 'components/LessonPeriodCard';
import { clickVoice } from 'utils/helpfunc';

class LessonsInfo extends Component {
  static defaultProps = {
    lessonsInfo: [],
    freeLessonsInfo: -1,
  }

  static propTypes = {
    showDetailAction: PropTypes.func,
    lessonsInfo: PropTypes.array,
    freeLessonsInfo: PropTypes.number,
  }

  state = {
    showingFreezeId: '',
    currentLessonIndex: 0, // 当前bu分类下标
  }

  onBuChange = (buIndex) => {
    clickVoice();
    this.setState({
      currentLessonIndex: buIndex,
      showingFreezeId: '',
    });
  }

  checkEmpty = (currentBu) => {
    if (!currentBu) {
      return true;
    }
    const { courseTypeInfoList } = currentBu;
    let isEmpty = true;
    if (!courseTypeInfoList || !(courseTypeInfoList.length > 0)) {
      isEmpty = true;
    } else {
      courseTypeInfoList.forEach((item) => {
        if (item.remainCourseInfoList && item.remainCourseInfoList.length > 0) {
          isEmpty = false;
        }
      });
    }
    return isEmpty;
  }

  showDetail = () => {
    clickVoice();
    const { showDetailAction } = this.props;
    showDetailAction();
  }

  showFreezeInfo = (showFreezeId) => {
    const { showingFreezeId } = this.state;
    if (showingFreezeId === showFreezeId) {
      showFreezeId = '';
    }
    this.setState({
      showingFreezeId: showFreezeId,
    });
  }

  componentWillUnmount() {
    this.setState({
      showingFreezeId: '',
    });
  }

  render() {
    const { lessonsInfo, freeLessonsInfo, showDetail } = this.props;
    const { currentLessonIndex, showingFreezeId } = this.state;
    const currentBu = lessonsInfo[currentLessonIndex];
    const isEmpty = this.checkEmpty(currentBu);
    return (
      <div id="lessonsInfo">
        <div className="bu-list">
          {
            lessonsInfo && (lessonsInfo.length > 0) && lessonsInfo.map((buItem, buIndex) => {
              return (
                <div key={buItem.buName} className={currentLessonIndex === buIndex ? 'bu-item active' : 'bu-item'} onClick={() => this.onBuChange(buIndex)}>{buItem.buName}</div>
              );
            })
          }
          {
            freeLessonsInfo === -1 ? ''
              : <div className={currentLessonIndex === lessonsInfo.length ? 'bu-item active' : 'bu-item'} onClick={() => this.onBuChange(lessonsInfo.length)}>精品课</div>
          }
          <div className="lesson-detail" onClick={() => { this.showDetail(); }}>查看课时明细</div>
        </div>
        <div className="lessons-main">
          <div className="bu-container">
            {
              !isEmpty && currentBu && currentBu.courseTypeInfoList && currentBu.courseTypeInfoList.map((courseTypeItem, courseTypeIndex) => {
                return courseTypeItem.remainCourseInfoList && (courseTypeItem.remainCourseInfoList.length > 0) ? (
                  <div className="course-type" key={courseTypeIndex}>
                    <div className="title">
                      {courseTypeItem.courseType}
（节）
                    </div>
                    <div className="lessons">
                      {
                        courseTypeItem.remainCourseInfoList && courseTypeItem.remainCourseInfoList.map((course, courseIndex) => {
                          return (
                            <LessonPeriodCard key={courseIndex} course={course} freezeInfoId={`${courseTypeIndex}-${courseIndex}`} showingFreezeInfoId={showingFreezeId} changeShowingFreezeInfo={showFreezeId => this.showFreezeInfo(showFreezeId)} />
                          );
                        })
                      }
                    </div>
                  </div>
                ) : '';
              })
            }
            {
              currentLessonIndex === lessonsInfo.length && (freeLessonsInfo > 0)
                ? (
                  <div className="free-lesson-item">
                    <div className="course-title">
                    精品课
                    </div>
                    <div className="course-info">
                      <div className="content">剩余</div>
                      <div className="total">
                        {freeLessonsInfo}
节
                      </div>
                    </div>
                  </div>
                )
                : (isEmpty
                  ? (
                    <div className="course-type-empty">
                      <div className="no-bg" />
                      <div className="no-tip">
抱歉，暂无
                        {currentBu ? currentBu.buName : '精品课'}
课时信息
                      </div>
                    </div>
                  )
                  : '')
            }
          </div>
        </div>
      </div>
    );
  }
}

export { LessonsInfo };

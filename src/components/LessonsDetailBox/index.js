import './lessonsDetailBox.scss';
import dayjs from 'dayjs';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { clickVoice } from 'utils/helpfunc';

class LessonsDetailBox extends Component {
  static defaultProps = {
    gainLessonsDetail: { total: 0 },
    consumeLessonsDetail: { total: 0 },
  }

  static propTypes = {
    closeDetailsBox: PropTypes.func,
    getMore: PropTypes.func,
    gainLessonsDetail: PropTypes.object,
    consumeLessonsDetail: PropTypes.object,
  }

  state = {
    activeType: 1,
    scrollTopNow: 0,
    scrollTopLarge: 0,
    onGetMore: false,
  }

  changeActiveType = (type) => {
    clickVoice();
    this.setState({
      activeType: type,
    });
  }

  getTime = (time) => {
    return dayjs(time).format('YYYY.MM.DD HH:mm');
  }

  getDescription = (type, detail) => {
    if (type === 1) {
      const buName = detail.buName || '掌门少儿';
      const courseTypeNum = detail.courseTypeNum === 0 ? '1对1' : '小班课';
      const courseName = detail.courseName === '普通课时' ? '普通' : '特殊';
      const counts = `${detail.counts}节`;
      const description = `${buName}，${courseTypeNum}，${courseName}${counts}`;
      return description;
    } if (type === 2) {
      return detail.name;
    }
  }

  detailsScroll = (e) => {
    const { getMore, gainLessonsDetail, consumeLessonsDetail } = this.props;
    const { scrollTopNow, onGetMore, activeType } = this.state;
    const currentDetailsType = activeType === 1 ? gainLessonsDetail : consumeLessonsDetail;
    const targetDom = e.target;
    if (!onGetMore && (e.target.scrollTop > scrollTopNow) && (targetDom.scrollHeight - targetDom.clientHeight - e.target.scrollTop) < 20 && currentDetailsType.list.length < currentDetailsType.total) {
      this.setState({
        onGetMore: true,
      }, () => {
        setTimeout(() => {
          getMore(activeType);
          this.setState({
            onGetMore: false,
          });
        }, 500);
      });
    }
    this.setState({
      scrollTopNow: e.target.scrollTop,
    });
  }

  render() {
    const { gainLessonsDetail, consumeLessonsDetail, closeDetailsBox } = this.props;
    const { activeType } = this.state;
    return (
      <div className="detail-container">
        <div className="detail-box">
          <div className="close-btn" onClick={closeDetailsBox} />
          <div className="title">课时明细</div>
          <div className="detail-type">
            <div className={activeType === 1 ? 'active type-item' : 'type-item'} onClick={() => this.changeActiveType(1)}>充值记录</div>
            <div className={activeType === 2 ? 'active type-item' : 'type-item'} onClick={() => this.changeActiveType(2)}>消耗记录</div>
          </div>
          <div className="details-main" onScroll={e => this.detailsScroll(e)}>
            <div className="details-main-list">
              {
                (activeType === 1) && gainLessonsDetail.list && gainLessonsDetail.list.map((detail, index) => {
                  return (
                    <div key={index} className="detail-item">
                      <div className="description">
                        {this.getDescription(1, detail)}
                        <span className="counts">
+
                          {detail.counts}
节
                        </span>
                      </div>
                      <div className="time">
                        {this.getTime(detail.time)}
                        <span className="content">{detail.name}</span>
                      </div>
                    </div>
                  );
                })
              }
              {
                (activeType === 2) && consumeLessonsDetail.list && consumeLessonsDetail.list.map((detail, index) => {
                  return (
                    <div key={index} className="detail-item">
                      <div className="description consume">
                        {this.getDescription(2, detail)}
                        <span className="counts">
                          {detail.counts}
节
                        </span>
                      </div>
                      <div className="time">
                        {this.getTime(detail.time)}
                        <span className="content">{detail.courseName}</span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
            <div className="detail-main-bg" />
          </div>
        </div>
      </div>
    );
  }
}

export { LessonsDetailBox };

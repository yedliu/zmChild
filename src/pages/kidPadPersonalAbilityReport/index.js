import './kidPadAbilityReport.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { LearningAbilityReport } from 'components/LearningAbilityReport';
import { routerRedux } from 'dva/router';

class KidPadPersonalAbilityReport extends Component {
  static defaultProps = {
    KidPadPersonalAbilityReportModel: {},
  }

  static propTypes = {
    KidPadPersonalAbilityReportModel: PropTypes.object,
  }

  componentWillMount() {
    this.getLearningAbilityResult();
  }

  getLearningAbilityResult = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'KidPadPersonalAbilityReportModel/getLearningAbilityResult',
    });
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

  goRetry = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/kid/ability/test',
      state: {
        from: '/kid',
      },
    }));
  }

  render() {
    const { KidPadPersonalAbilityReportModel } = this.props;
    const { learningAbilityResult } = KidPadPersonalAbilityReportModel;
    const scaleStyle = this.getScale();
    return (
      <div id="pad-ability-report">
        <LearningAbilityReport platform="KidsPad" learningAbilityInfo={learningAbilityResult} header />
      </div>
    );
  }
}

const mapStateToProps = (state) => { // 见名知意，把state转换为props
  // 可以打印state看看数据结构，然后放到data里
  const { KidPadPersonalAbilityReportModel } = state;
  return { KidPadPersonalAbilityReportModel };
};

export default connect(mapStateToProps)(KidPadPersonalAbilityReport);

import './kidPersonalCenter.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { KidCenterConatiner } from 'components/KidCenterContainer';
import { LessonsDetailBox } from 'components/LessonsDetailBox';
import { clickVoice } from 'utils/helpfunc';
import { PersonalInfo } from './personalInfo';
import { LessonsInfo } from './lessonsInfo';
import { TestInfo } from './testInfo';

class KidPersonalCenter extends Component {
  static defaultProps = {
    KidPersonalCenterModel: {},
  }

  static propTypes = {
    KidPersonalCenterModel: PropTypes.object,
  }

  state = {
    currentMenuId: 'personal',
    agreement: '',
    detailShow: false,
    gainLessonsDetailPageNo: 1,
    consumeLessonsDetailPageNo: 1,
    menuList: [
      {
        menuId: 'personal',
        title: '个人资料',
      }, 
      {
        menuId: 'lessons',
        title: '课时信息',
      }, 
      // { // 去掉我的测评
      //   menuId: 'test',
      //   title: '我的测评',
      // }
    ],
  }

  componentDidMount() {
    this.getUserInfo();
    this.getLessonsInfo();
    this.getFreeLessonsInfo();
    this.getGainLessonsDetailFirst();
    this.getConsumeLessonsDetailFirst();
    this.getDoneLearningAbilityTest();
  }

  getUserInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'KidPersonalCenterModel/getPersonalInfo',
    });
  }

  getLessonsInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'KidPersonalCenterModel/getLessonsInfo',
    });
  }

  getFreeLessonsInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'KidPersonalCenterModel/getFreeLessonsInfo',
    });
  }

  getGainLessonsDetailFirst = () => {
    const { dispatch } = this.props;
    const { gainLessonsDetailPageNo } = this.state;
    const payload = {
      inputType: 2,
      page: gainLessonsDetailPageNo,
      size: 50,
      oldLessonsDetail: [],
    };
    dispatch({
      type: 'KidPersonalCenterModel/getLessonsDetail',
      payload,
    });
  }

  getGainLessonsDetail = () => {
    const { dispatch, KidPersonalCenterModel } = this.props;
    const { gainLessonsDetailPageNo } = this.state;
    const { gainLessonsDetail } = KidPersonalCenterModel;
    const payload = {
      inputType: 2,
      page: gainLessonsDetailPageNo,
      size: 50,
      oldLessonsDetail: gainLessonsDetail.list || [],
    };
    dispatch({
      type: 'KidPersonalCenterModel/getLessonsDetail',
      payload,
    });
  }

  getConsumeLessonsDetailFirst = () => {
    const { dispatch } = this.props;
    const { consumeLessonsDetailPageNo } = this.state;
    const payload = {
      inputType: 1,
      page: consumeLessonsDetailPageNo,
      size: 50,
      oldLessonsDetail: [],
    };
    dispatch({
      type: 'KidPersonalCenterModel/getLessonsDetail',
      payload,
    });
  }

  getConsumeLessonsDetail = () => {
    const { dispatch, KidPersonalCenterModel } = this.props;
    const { consumeLessonsDetailPageNo } = this.state;
    const { consumeLessonsDetail } = KidPersonalCenterModel;
    const payload = {
      inputType: 1,
      page: consumeLessonsDetailPageNo,
      size: 50,
      oldLessonsDetail: consumeLessonsDetail.list || [],
    };
    dispatch({
      type: 'KidPersonalCenterModel/getLessonsDetail',
      payload,
    });
  }

  getDoneLearningAbilityTest = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'KidPersonalCenterModel/getDoneLearningAbilityTest',
    });
  }

  onGetLearningAbilityResult = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'KidPersonalCenterModel/getLearningAbilityResult',
    });
  }

  onCurrentMenuChange = (menuId) => {
    clickVoice();
    this.setState({
      currentMenuId: menuId,
    });
  }

  onDetailShow = () => {
    this.setState({
      detailShow: true,
    });
  }

  onDetailClose = () => {
    clickVoice();
    this.setState({
      detailShow: false,
    });
  }

  onGetMore = (activeType) => {
    if (activeType === 1) {
      const { gainLessonsDetailPageNo } = this.state;
      this.setState({
        gainLessonsDetailPageNo: gainLessonsDetailPageNo + 1,
      }, () => {
        this.getGainLessonsDetail();
      });
    } else {
      const { consumeLessonsDetailPageNo } = this.state;
      this.setState({
        consumeLessonsDetailPageNo: consumeLessonsDetailPageNo + 1,
      }, () => {
        this.getConsumeLessonsDetail();
      });
    }
  }

  render() {
    const { KidPersonalCenterModel, history, dispatch } = this.props;
    const { menuList, currentMenuId, detailShow } = this.state;
    const { userInfo, lessonsInfo, freeLessonsInfo, gainLessonsDetail, consumeLessonsDetail, doneLearningAbilityTest, learningAbilityResult, phaseTestUrl } = KidPersonalCenterModel;
    return (
      <KidCenterConatiner title="我的" history={history} dispatch={dispatch} menuList={menuList} currentMenuId={currentMenuId} currentMenuChange={menuId => this.onCurrentMenuChange(menuId)}>
        {
          currentMenuId === 'personal' ? <PersonalInfo userInfo={userInfo} />
            : currentMenuId === 'lessons' ? <LessonsInfo lessonsInfo={lessonsInfo} showDetailAction={() => this.onDetailShow()} freeLessonsInfo={freeLessonsInfo} />
              : currentMenuId === 'test' ? <TestInfo phaseTestUrl={phaseTestUrl} dispatch={dispatch} doneLearningAbilityTest={doneLearningAbilityTest} learningAbilityResult={learningAbilityResult} getLearningAbilityResult={() => this.onGetLearningAbilityResult()} />
                : null
        }
        {
          !detailShow ? ''
            : <LessonsDetailBox gainLessonsDetail={gainLessonsDetail} consumeLessonsDetail={consumeLessonsDetail} getMore={activeType => this.onGetMore(activeType)} closeDetailsBox={() => this.onDetailClose()} />
        }
      </KidCenterConatiner>
    );
  }
}

const mapStateToProps = (state) => { // 见名知意，把state转换为props
  // 可以打印state看看数据结构，然后放到data里
  const { KidPersonalCenterModel } = state;
  return { KidPersonalCenterModel };
};

export default connect(mapStateToProps)(KidPersonalCenter);

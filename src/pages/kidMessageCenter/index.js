import './kidMessageCenter.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { KidCenterConatiner } from 'components/KidCenterContainer';
import { clickVoice } from 'utils/helpfunc';
import { CourseMessages } from './courseMessages';
import { HomeworkMessages } from './homeworkMessages';

class KidMessageCenter extends Component {
  static defaultProps = {
    KidMessageCenterModel: {},
  }

  static propTypes = {
    KidMessageCenterModel: PropTypes.object,
  }

  state = {
    currentMenuId: 'lessons',
    courseMessagePage: 1,
  }

  componentDidMount() {
    const { location } = this.props;
    const fromMessage = (location.state && location.state.fromMessage) || '';
    this.getCourseMessagesInfoFirst();
    this.getHomeworkMessagesInfo();
    this.getUnreadMessageCount();
    if (fromMessage === 'homework') {
      this.setState({
        currentMenuId: 'homework',
      });
    }
  }

  getUnreadMessageCount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'KidMessageCenterModel/getUnreadMessagesCount',
    });
  }

  getCourseMessagesInfo = (courseMessagePage) => {
    const { dispatch, KidMessageCenterModel } = this.props;
    const { courseMessagesInfo } = KidMessageCenterModel;
    const oldList = courseMessagesInfo.list || [];
    const payload = {
      page: courseMessagePage,
      size: 10,
      oldList,
    };
    dispatch({
      type: 'KidMessageCenterModel/getCourseMessagesInfo',
      payload,
    });
  }

  getCourseMessagesInfoFirst = () => {
    const { dispatch } = this.props;
    const oldList = [];
    const payload = {
      page: 1,
      size: 10,
      oldList,
    };
    dispatch({
      type: 'KidMessageCenterModel/getCourseMessagesInfo',
      payload,
    });
  }

  getHomeworkMessagesInfo = () => {
    const { dispatch } = this.props;
    const payload = {
      clazzType: 0,
      pageIndex: 1,
      source: 0,
      statusCodes: [2, 3], // 0:未读 1:已读
      pageSize: 1000,
    };
    dispatch({
      type: 'KidMessageCenterModel/getHomeworkMessagesInfo',
      payload,
    });
  }

  onCurrentMenuChange = (menuId) => {
    clickVoice();
    this.setState({
      currentMenuId: menuId,
    });
  }

  onGetMore = () => {
    const { courseMessagePage } = this.state;
    this.getCourseMessagesInfo(courseMessagePage + 1);
    this.setState({
      courseMessagePage: courseMessagePage + 1,
    });
  }

  onSetCourseMessagesRead = (messageId, messageIndex) => {
    const { dispatch } = this.props;
    const payload = {
      ids: [messageId],
      messageIndex,
    };
    setTimeout(() => {
      dispatch({
        type: 'KidMessageCenterModel/setCourseMessagesRead',
        payload,
      });
    }, 2000);
  }

  render() {
    const { KidMessageCenterModel, history, dispatch } = this.props;
    const { unreadMessagesCount, homeworkMessagesInfo, courseMessagesInfo } = KidMessageCenterModel;
    const menuList = [{
      menuId: 'lessons',
      title: `课程(${unreadMessagesCount.courseCount || 0})`,
    }, {
      menuId: 'homework',
      title: `练习(${unreadMessagesCount.homeworkCount || 0})`,
    }];
    const { currentMenuId } = this.state;
    // const {  } = KidMessageCenterModel
    return (
      <KidCenterConatiner title="消息中心" dispatch={dispatch} history={history} menuList={menuList} currentMenuId={currentMenuId} currentMenuChange={menuId => this.onCurrentMenuChange(menuId)}>
        {
          currentMenuId === 'lessons'
            ? (
              <CourseMessages
                setCourseMessagesRead={(messageId, messageIndex) => this.onSetCourseMessagesRead(messageId, messageIndex)}
                messageCount={courseMessagesInfo.total}
                messageList={courseMessagesInfo.list}
                getMore={() => this.onGetMore()}
              />
            ) : currentMenuId === 'homework'
              ? (
                <HomeworkMessages
                  dispatch={dispatch}
                  messageList={homeworkMessagesInfo.list}
                />
              )
              : null
        }
      </KidCenterConatiner>
    );
  }
}

const mapStateToProps = (state) => { // 见名知意，把state转换为props
  // 可以打印state看看数据结构，然后放到data里
  const { KidMessageCenterModel } = state;
  return { KidMessageCenterModel };
};

export default connect(mapStateToProps)(KidMessageCenter);

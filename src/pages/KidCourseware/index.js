import React from 'react';
import KidHeader from 'components/kidHeader';
import KidDropDown from 'components/KidDropDown';
import KidPPT from 'components/KidPPT';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { clickVoice } from 'utils/helpfunc';
import zmTip from 'components/zmTip';
import './style.scss';

const iszmg = [1000503, 1000504];

class KidCourseware extends React.Component {
  state = {
    pptIndex: 0,
    courseType: this.props.location.state.courseType,
    coursePage: {
      currentPage: 0,
      totalPage: 0,
    },
    courseState: 0, // 课程状态 0 未开始 1已结束  //无正在上课状态
    showSelectBox: false,
    zmgPageInfo: {},
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { data, courseType, courseState } = location.state;
    this.setState({ courseType, courseState });
    // 上课课件
    if (data.courseware) {
      // courseMode 课程类型1、小班课 2、一对一
      const { courseMode } = data;
      const modelType = courseMode == 1 ? 'kidcoursewareModel/getBUClassCourseware' : 'kidcoursewareModel/getClassCourseware';
      dispatch({
        type: modelType,
        payload: data,
      });
    }
    // 预习课件
    if (data.preparatoryCourseware) {
      dispatch({
        type: 'kidcoursewareModel/getPreviewCourseware',
        payload: data,
      });
    }
  }

  changePPTIndex = (i) => {
    this.setState({ pptIndex: i });
  }

  // 初始化toast info
  initToastInfo = (totalPage) => {
    const { location } = this.props;
    let { pageInfo } = this.props.kidcoursewareModel;
    const { coursePreviewData } = this.props.kidcoursewareModel;
    const { data } = location.state;
    let toastText = pageInfo.currentPage === 0 ? '' : `你上次学习到第${pageInfo.currentPage + 1}页`;
    const { isModified } = coursePreviewData;
    if (data.previewed === 1) {
      toastText = '你已经学习完了课件';
    } else if (isModified) {
      toastText = '课件已更新，请重新预习';
    }
    if (pageInfo.currentPage === -1) {
      toastText = null;
      pageInfo = { ...pageInfo, ...{ currentPage: 0 } };
    }

    if (pageInfo.currentPage >= totalPage - 1 || isModified) {
      pageInfo = { ...pageInfo, ...{ currentPage: 0, maxPage: 0 } };
    }
    pageInfo = { ...pageInfo, ...{ totalPage } };
    this.props.dispatch({
      type: 'kidcoursewareModel/setPageInfo',
      pageInfo,
    });
    this.props.dispatch({
      type: 'kidcoursewareModel/setToastText',
      toastText,
    });
  }

  // zmg, zml课件切页相关操作
  initPage = (total) => {
    const { coursePage, courseState, courseType } = this.state;
    const { pageInfo } = this.props.kidcoursewareModel;
    if (courseType == 'class') {
      this.setState({
        coursePage: Object.assign({}, coursePage, {
          totalPage: total,
        }),
      });
    } else if (courseType == 'preview') {
      if (courseState === 0) {
        this.initToastInfo(total);
      } else {
        const Info = Object.assign({}, pageInfo, { currentPage: 0, maxPage: 0, totalPage: total });
        this.props.dispatch({
          type: 'kidcoursewareModel/setPageInfo',
          pageInfo: Info,
        });
      }
    }
  }

  // 上课课件名称
  renderCourseName = () => {
    const { kidcoursewareModel } = this.props;
    const { courseClassData } = kidcoursewareModel;
    const list = courseClassData.map((item, index) => {
      const label = item.name ? item.name : item.coursewareName;
      item.value = index;
      item.label = label;
      return item;
    });
    const { pptIndex } = this.state;
    return (
      <div className="dropdown-box">
        <KidDropDown value={pptIndex.toString()} option={list} cb={this.changePPTIndex} />
      </div>
    );
  }

  // 预习课件
  renderPreviewName = () => {
    const { kidcoursewareModel } = this.props;
    const { coursePreviewData } = kidcoursewareModel;
    return (
      <div className="preview-name">{coursePreviewData.name}</div>
    );
  }

  changePage = (num) => {
    const { dispatch, location } = this.props;
    const { data } = location.state;
    const { coursePage, courseType } = this.state;
    const { pageInfo } = this.props.kidcoursewareModel;
    if (courseType === 'class') {
      this.setState({
        coursePage: Object.assign({}, coursePage, { currentPage: num }),
      });
    } else if (courseType === 'preview') {
      const maxPage = num > pageInfo.maxPage ? num : pageInfo.maxPage;
      const Info = { ...pageInfo, ...{ currentPage: num, maxPage } };
      dispatch({
        type: 'kidcoursewareModel/setPageInfo',
        pageInfo: Info,
      });
    }
  }

  handleCheckCourse = () => {
    clickVoice();
    const { courseType } = this.state;
    if (courseType == 'preview') {
      this.setState({ courseType: 'class', showSelectBox: false });
    } else {
      this.setState({ courseType: 'preview', showSelectBox: false });
    }
  }

  handleSelectBox = () => {
    clickVoice();
    this.setState({ showSelectBox: !this.state.showSelectBox });
  }

  renderRight = () => {
    const { courseType, showSelectBox } = this.state;
    return (
      <div className="right-box">
        <div className="check-btn" onClick={this.handleSelectBox} />
        {
          showSelectBox && (
          <div className="slect-list">
            <div className={`class-item ${courseType == 'preview' ? 'active' : ''}`} onClick={this.handleCheckCourse}>
              预习课件
              {courseType == 'preview' && <div className="select-gou" />}
            </div>
            <div className={`class-item ${courseType == 'class' ? 'active' : ''}`} onClick={this.handleCheckCourse}>
              上课课件
              {courseType == 'class' && <div className="select-gou" />}
            </div>
          </div>
          )
        }
      </div>
    );
  }

  renderTip = () => {
    const { fruit } = this.props.kidcoursewareModel;
    return (
      <div>
        <div className="fruite-img">
          +
          {fruit.obtainValue}
        </div>
        <div>已预习，这些能量果赠送给你</div>
      </div>
    );
  }

  handleGoBack = async () => {
    const { dispatch, location, kidcoursewareModel } = this.props;
    const { from, data } = location.state;
    const { pageInfo, coursePreviewData  } = kidcoursewareModel;
    const { courseType, zmgPageInfo } = this.state;
    let lessonType = '';
    if (courseType === 'preview') {
      lessonType = data.type ? data.type : data.courseMode;
    } else {
      lessonType = data.courseMode;
    }

    // let path = '/';
    // if (from == '/kid') {
    //   path = '/kid';
    // } else if(from == '/kid/kidcarddetails') {
    //   path = '/kid/kidcarddetails'
    // } else {
    //   path = '/kid/kidhistory';
    // }
    // 预习课件时，添加能量果
    if (courseType === 'preview') {
      await dispatch({
        type: 'kidcoursewareModel/getAddFruit',
        payload: {
          lessonId: data.lessonId,
          lessonType,
          page: iszmg.includes(coursePreviewData.type) ? zmgPageInfo.pageNum : pageInfo.currentPage + 1,
          totalPage: iszmg.includes(coursePreviewData.type) ? zmgPageInfo.totalPages : pageInfo.totalPage,
        },
      });

      const { fruit } = this.props.kidcoursewareModel;
      if (fruit.obtainValue > 0) {
        const tip = {
          title: this.renderTip(),
          time: 2500,
        };
        zmTip(tip);
      }
    }

   dispatch(routerRedux.push(
      {
        pathname: from,
        state: {
          from: '/kid/kidcourseware',
        },
      },
    ));
   
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'kidcoursewareModel/setCoursewareData',
      courseClassData: [],
    });
    dispatch({
      type: 'kidcoursewareModel/setCoursePreviewData',
      coursePreviewData: {},
    });
  }

  initZmgPage = (data) => {
    this.setState({zmgPageInfo: data});
  }

  renderCourse = () => {
    const { location, kidcoursewareModel } = this.props;
    const { coursePreviewData, courseClassData, toastText, pageInfo, addFruit } = kidcoursewareModel;
    const { courseType, pptIndex, coursePage, courseState } = this.state;
    const { data } = location.state;
    if (courseType === 'class') {
      return (
        <div className={`courseWrapper ${(courseClassData.length > 0) ? '' : 'courseWrapper-center'}`}>
          {(courseClassData.length > 0) ? (
            <KidPPT
              data={courseClassData[pptIndex]}
              index={pptIndex}
              initPage={this.initPage}
              changePage={this.changePage}
              page={coursePage}
              courseType={courseType}
              courseState={courseState}
              text={toastText}
              startTime={
              new Date(data.lessonStartTime).getTime() / 1000
              }
            />
          ) : (
            <div className="no-data">
              <div className="pic-miss" />
              <div className="no-text">啊哦~暂时没有课件</div>
            </div>
          )}
        </div>
      );
    }
    if (courseType === 'preview') {
      return (
        <div className={`courseWrapper ${(Object.keys(coursePreviewData).length > 0) ? '' : 'courseWrapper-center'}`}>
          {(Object.keys(coursePreviewData).length > 0) ? (
            <KidPPT
              data={coursePreviewData}
              index={pptIndex}
              initPage={this.initPage}
              initZmgPage={this.initZmgPage}
              changePage={this.changePage}
              page={pageInfo}
              courseType={courseType}
              courseState={courseState}
              text={toastText}
              startTime={
              new Date(data.lessonStartTime).getTime() / 1000
            }
            />
          ) : (
            <div className="no-data">
              <div className="pic-miss" />
              <div className="no-text">啊哦~暂时没有课件</div>
            </div>
          )}
        </div>
      );
    }
  }

  render() {
    const { location, kidcoursewareModel } = this.props;
    const { coursePreviewData, courseClassData } = kidcoursewareModel;
    const { courseType } = this.state;
    const { data } = location.state;
    return (
      <div id="kidcourseware">
        <KidHeader
          goBack={this.handleGoBack}
          center={(Object.keys(coursePreviewData).length > 0 || courseClassData.length > 0) ? (courseType == 'class' ? this.renderCourseName() : this.renderPreviewName()) : ''}
          right={data.courseware && data.preparatoryCourseware && this.renderRight()}
        />
        {this.renderCourse()}
      </div>
    );
  }
}

function mapStateToProps({ kidcoursewareModel }) {
  return { kidcoursewareModel };
}

export default connect(mapStateToProps)(KidCourseware);

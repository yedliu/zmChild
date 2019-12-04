import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ZmModal from 'components/zmModal';
import KidButton from 'components/KidButton';
import { clickVoice } from 'utils/helpfunc';
import './index.scss';

class KidAppointment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getCourse = this.getCourse.bind(this);
    this.chooseSubject = this.chooseSubject.bind(this);
    this.state = {
      showDropDown: false,
      defaultSelect: 0,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'kidAppointment/getUserAppointmentInfo' });
    dispatch({ type: 'kidAppointment/setAppointCourse', payload: { appointSuccessful: false } });
  }

  chooseSubject(item, index) {
    // console.log(item);
    const { dispatch } = this.props;
    // console.log(item)
    this.setState({ defaultSelect: index });
    dispatch({ type: 'kidAppointment/setDefaultSubject', payload: { defaultSubject: Object.assign({}, { channelName: 'zhangmenkid' }, item) } });
  }

  getCourse() {
    clickVoice();
    const { dispatch, defaultSubject } = this.props;

    dispatch({ type: 'kidAppointment/getAppointment', payload: { defaultSubject: { channelName: 'zhangmenkid', subjectCode: defaultSubject.code } } });
    // console.log('defaultSubject======>', this.props.defaultSubject)
  }

  render() {
    const { data, defaultSubject, appointSuccessful, switchModelStat } = this.props;
    return (
      <div>
        <ZmModal visible>
          <div className="modal">
            <header>
宝贝年级：
              {data.label}
            </header>
            <div className={`select ${this.state.showDropDown ? 'show' : 'hide'}`} onClick={() => this.setState({ showDropDown: !this.state.showDropDown })}>
              <label>学习科目</label>
              <span>{defaultSubject.label}</span>
              <div className={`pop ${this.state.showDropDown ? 'show' : 'hide'}`}>
                {
                      data.subjectList.length > 0 && data.subjectList.map((item, index) => {
                        return <div className={`select-item ${this.state.defaultSelect === index ? 'defaultSelect' : ''}`} key={index} onClick={() => this.chooseSubject(item, index)}>{item.label}</div>;
                      })
                    }
              </div>
            </div>
            <KidButton size="xlarge" handleClick={() => this.getCourse()}>立即领取</KidButton>
            <div className="footer">
              <div className="step-1">
                <span>免费领取体验课程</span>
              </div>
              <div className="step-2">
                <span>专业顾问致电排课</span>
              </div>
              <div className="step-3">
                <span>打开电脑免费体验</span>
              </div>
            </div>
            <span className="close" onClick={() => switchModelStat()} />
          </div>
          {
                appointSuccessful && (
                <div>
                  <div className="appointSuccessful">
                    <div className="content">
                      <p className="title">课程领取成功啦</p>
                      <p className="info">课程顾问将尽快与你联系，并安排试听时间，请耐心等待</p>
                      <KidButton handleClick={() => {
                        switchModelStat();
                      }}
                      >
                        知道啦
                      </KidButton>
                    </div>
                  </div>
                </div>
                )
              }
        </ZmModal>
      </div>
    );
  }
}
const mapStateToProps = ({ kidAppointment: { data, defaultSubject, appointSuccessful }, loading }) => { // 见名知意，把state转换为props
  // 可以打印state看看数据结构，然后放到data里
  return { data, defaultSubject, appointSuccessful, loading };
};

export default connect(mapStateToProps)(KidAppointment);

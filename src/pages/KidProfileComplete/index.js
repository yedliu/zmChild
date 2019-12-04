import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { KidSelector } from 'components/KidSelector';
import KidMessage from 'components/KidMessage';

import './kidprofilecomplete.scss';

class KidProfileComplete extends React.Component {
  constructor(props) {
    super(props);
    ['handleSelectorChange', 'canSubmitListen', 'handleCloseMask'].forEach(f => this[f] = this[f].bind(this));

    this.state = {
      canSubmit: false,
      kidName: '',
      kidGrade: '',
      kiGradeItem: {},
      messagetype: '',
      messagecontent: '',
      initialKidName: '',
      initialKidGrade: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'profileCompleteModel/getGradeList' });
    this.fillinLastKidInfo();
  }

  async fillinLastKidInfo() {
    const { dispatch } = this.props;
    const personInfo = await dispatch({ type: 'profileCompleteModel/getPersonalInfo' });
    this.setState({
      initialKidName: personInfo && personInfo.name,
      initialKidGrade: personInfo.stuGrade,
    });
    console.log('get personInfo:', personInfo);
  }

  handleSelectorChange(item) {
    this.canSubmitListen(this.state.kidName, item.label);
    this.setState({
      kidGrade: item.label,
      kiGradeItem: item,
    });
  }

  handleInput(e) {
    this.setState({
      kidName: e.target.value.trim(),
    });

    this.canSubmitListen(e.target.value, this.state.kidGrade || this.state.initialKidGrade);
  }

  canSubmitListen(kidName, kidGrade) {
    this.setState({
      canSubmit: !!kidName && this.checkKidNameValidate(kidName) && !!kidGrade,
    });
  }

  checkKidNameValidate(kidName) {
    return kidName.length >= 2 && kidName.length <= 14;
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (!this.state.kidName) {
      this.setState({
        messagetype: 'error',
        messagecontent: '请输入宝贝姓名',
      });
      return;
    }
    if (!this.checkKidNameValidate(this.state.kidName)) {
      this.setState({
        messagetype: 'error',
        messagecontent: '宝贝姓名为2 ~ 14位',
      });
      return;
    }
    if (!this.state.kidGrade && !this.state.initialKidGrade) {
      return;
    }

    // 请求接口
    const payload = { name: this.state.kidName };
    const search = location.search.split('?')[1] || '';
    const defaultGradeCode = search.split('=')[1];
    if (!this.initialKidGrade) {
      payload.gradeCode = defaultGradeCode || this.state.kiGradeItem.code;
    }
    const res = await this.props.dispatch({ type: 'profileCompleteModel/modifyStudent', payload });
    if (res && res.code === '0') {
      this.setState({
        messagetype: 'success',
        messagecontent: '提交成功啦',
      });

      setTimeout(() => {
        this.props.dispatch(routerRedux.push('/kid'));
      }, 500);
    } else {
      this.setState({
        messagetype: 'error',
        messagecontent: res.message,
      });
    }
  }

  handleCloseMask() {
    this.setState({
      messagetype: '',
      messagecontent: '',
    });
  }

  render() {
    const { gradeList } = this.props;
    const { kidName } = this.state;
    const profileForm = () => (
      <div className="profile-form">
        <p className="intro">
你好，我是掌小萌，在开始掌门的学习
          <br />
旅程前，请先告诉我你的姓名和年级吧～
        </p>
        <form onSubmit={e => this.handleSubmit(e)}>
          <div className="form-item">
            <label>姓名</label>
            <input type="text" placeholder="请输入宝贝姓名" maxLength="30" onChange={e => this.handleInput(e)} />
          </div>
          <div className={`form-item ${!!this.state.initialKidGrade && 'disabled'}`}>
            <KidSelector data={gradeList} defaultLabel={this.state.initialKidGrade} preLabel="年级" placeholder="请选择宝贝现在的年级" onChange={this.handleSelectorChange} />
          </div>
          <div className="form-item custom">
            <button className={`submit-btn ${this.state.canSubmit ? '' : 'disabled'}`}>确定</button>
          </div>
        </form>
        <KidMessage messagecontent={this.state.messagecontent} messagetype={this.state.messagetype} maskClick={() => this.handleCloseMask()} />
      </div>
    );

    return (
      <div id="profileComplete">
        <div className="profile-box">
          { profileForm() }
        </div>
        <div className="star star1" />
        <div className="star star2" />
        <div className="star star3" />
        <div className="star star4" />
        <div className="star star5" />
      </div>
    );
  }
}

function mapStateToProps({ profileCompleteModel: { gradeList } }) {
  return { gradeList };
}

export default connect(mapStateToProps)(KidProfileComplete);

import './messageCard.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { routerRedux } from 'dva/router';
import { clickVoice } from 'utils/helpfunc';
import { AppLocalStorage } from '../../utils/localStorage';

class MessageCard extends Component {
  static defaultProps = {
    messageInfo: {},
    type: '',
  }

  static propTypes = {
    messageInfo: PropTypes.object,
    type: PropTypes.string,
    setMessagePosition: PropTypes.func,
  }

  state = {
    userName: '',
    domRef: React.createRef(),
  }

  componentDidMount() {
    const { type } = this.props;
    const userName = AppLocalStorage.getUserName();
    this.setState({
      userName,
    });
    if (type === 'course') this.messagePositionInit();
  }

  messagePositionInit = () => {
    const { messageInfo, setMessagePosition } = this.props;
    if (messageInfo.isChecked) return;
    const dom = this.state.domRef.current;
    const messagePosition = {
      id: messageInfo.id,
      position: dom.offsetTop,
    };
    setMessagePosition(messagePosition);
  }

  messageFormat = (messageInfo, type) => {
    const messageInfoFormat = messageInfo;
    if (type === 'course') {
      return messageInfoFormat;
    }
    const { userName } = this.state;
    messageInfo.startedAt = messageInfo.dateTime;
    switch (messageInfo.statusCode) {
      case 2:
        messageInfoFormat.title = '新练习';
        messageInfoFormat.btnText = '做练习';
        messageInfoFormat.remarks = `${userName}同学，你的${messageInfo.subject}老师${messageInfo.teaName}给你布置了练习"${messageInfo.hlName}"，赶快去完成它吧！`;
        break;
      case 3:
        messageInfoFormat.title = '提交练习';
        messageInfoFormat.btnText = '去提交';
        messageInfoFormat.remarks = `${userName}同学，你的练习"${messageInfo.hlName}"距离截止时间只有4个小时了，赶快去完成它吧！`;
        break;
      case 4:
        messageInfoFormat.title = '练习自动提交';
        messageInfoFormat.btnText = '去查看';
        messageInfoFormat.remarks = `${userName}同学，你的练习"${messageInfo.hlName}"截止时间已到，系统已自动将该练习提交给老师，请耐心等待批改结果。`;
        break;
      case 5:
        messageInfoFormat.title = '练习已批改';
        messageInfoFormat.btnText = '去查看';
        messageInfoFormat.remarks = `${userName}同学，你的练习"${messageInfo.hlName}"老师已批改，赶快去查看批改结果吧！`;
        break;
      default:
        break;
    }
    return messageInfoFormat;
  }

  goHomework = (info) => {
    clickVoice();
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/kid/kidhomework',
      state: {
        type: info.clazzType == 0 ? 2 : 1,
        editable: true,
        leftSide: false,
        homeworkstate: 33,
        id: info.hlId,
        from: '/kid/message',
      },
    }));
  }

  render() {
    const { messageInfo, type } = this.props;
    const { domRef } = this.state;
    const messageFormat = this.messageFormat(messageInfo, type);
    return (
      <div ref={domRef} className={messageInfo.isChecked ? 'message-card read' : 'message-card'}>
        <div className="title">
          {messageFormat.title}
          {
            messageFormat.btnText
              ? <div className="link-btn" onClick={() => this.goHomework(messageInfo)}>{messageFormat.btnText}</div> : ''
          }
        </div>
        <div className="time">
          {dayjs(messageFormat.startedAt).format('YYYY-MM-DD HH:mm')}
        </div>
        <div className="content">
          {messageFormat.remarks}
        </div>
      </div>
    );
  }
}

export { MessageCard };

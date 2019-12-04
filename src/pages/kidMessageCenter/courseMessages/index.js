import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MessageCard } from 'components/MessageCard';

class CourseMessages extends Component {
  static defaultProps = {
    messageList: [],
    messageCount: 0,
  }

  static propTypes = {
    getMore: PropTypes.func,
    messageList: PropTypes.array,
    messageCount: PropTypes.number,
  }

  state = {
    scrollTopNow: 0,
    scrollTopLarge: 0,
    onGetMore: false,
    messagePositionList: [],
  }

  componentDidMount() {
    setTimeout(() => {
      this.onReadInit(500);
    }, 500);
  }

  messagesScroll = (e) => {
    const { messageCount, getMore, messageList } = this.props;
    const { scrollTopNow, onGetMore } = this.state;
    const targetDom = e.target;
    if (!onGetMore && (e.target.scrollTop > scrollTopNow) && (targetDom.scrollHeight - targetDom.clientHeight - e.target.scrollTop) < 20 && messageList.length < messageCount && messageList.length < 200) {
      this.setState({
        onGetMore: true,
      }, () => {
        setTimeout(() => {
          getMore();
          this.setState({
            onGetMore: false,
          });
        }, 1500);
      });
    }
    this.setState({
      scrollTopNow: e.target.scrollTop,
    });
    this.onRead(e.target.scrollTop + e.target.clientHeight);
  }

  onReadInit = (scrollTopNow) => {
    const { scrollTopLarge, messagePositionList } = this.state;
    if (scrollTopNow < scrollTopLarge) return;
    this.setState({
      scrollTopLarge: scrollTopNow,
    });
    const { setCourseMessagesRead } = this.props;
    messagePositionList && messagePositionList.length > 0 && messagePositionList.map((item, index) => {
      if (item.position < (scrollTopNow - 150)) {
        setCourseMessagesRead(item.id, item.index);
        // messagePositionList.splice(index, 1)
      }
    });
  }

  onRead = (scrollTopNow) => {
    const { scrollTopLarge, messagePositionList } = this.state;
    if (scrollTopNow < scrollTopLarge) return;
    this.setState({
      scrollTopLarge: scrollTopNow,
    });
    const { setCourseMessagesRead } = this.props;
    messagePositionList && messagePositionList.length > 0 && messagePositionList.map((item, index) => {
      if (item.position < (scrollTopNow - 150)) {
        setCourseMessagesRead(item.id, item.index);
        messagePositionList.splice(index, 1);
      }
    });
  }

  onSetMessagePosition = (messagePosition) => {
    const { messagePositionList } = this.state;
    messagePositionList.push(messagePosition);
    this.setState({
      messagePositionList: [...messagePositionList],
    });
  }

  render() {
    const { messageList } = this.props;
    return (
      <div id="course-messages" className="message-box" onScroll={e => this.messagesScroll(e)}>
        {
          messageList.map((message, index) => {
            return (
              <MessageCard type="course" setMessagePosition={messagePosition => this.onSetMessagePosition({ ...messagePosition, index })} messageInfo={message} key={index} />
            );
          })
        }
      </div>
    );
  }
}

export { CourseMessages };

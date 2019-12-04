import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LessonPeriodCard } from 'components/LessonPeriodCard';
import { MessageCard } from 'components/MessageCard';
import { AppLocalStorage } from '../../../utils/localStorage';

class HomeworkMessages extends Component {
  static defaultProps = {
    messageList: [],
  }

  static propTypes = {
    messageList: PropTypes.array,
  }

  state = {}

  componentWillUnmount() {

  }

  render() {
    const { messageList, dispatch } = this.props;
    const { userName } = this.state;
    console.log(messageList);
    return (
      <div id="homework-messages" className="message-box">
        {
          messageList.map((message, index) => {
            return (
              <MessageCard type="homework" dispatch={dispatch} messageInfo={message} key={index} />
            );
          })
        }
      </div>
    );
  }
}

export { HomeworkMessages };

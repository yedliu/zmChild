import React from 'react';
import PropTypes from 'prop-types';
// import Modal from 'react-modal';
import { fadeIn } from 'components/Div';
import { CloseDiv } from 'containers/OrderTestLessonForm/index';

export const FullModalStyles = {
  content: {
    width: '100%',
    height: '100%',
    top: '0px',
    left: '0px',
    // top: '50%',
    // left: '50%',
    right: 'auto',
    bottom: 'auto',
    padding: '0px',
    animation: `${fadeIn} .3s linear`,
    // marginRight: '-50%',
    // transform: 'translate(-50%, -50%)',
  },
};

export class H5replyrecord extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = { isopen: false };
    this.lessonuid = props.uid;
    this.closecb = props.cb;
    this.isnomodal = props.isnomodal;
    this.setUid = this.setUid.bind(this);
  }

  setUid(id) {
    this.lessonuid = id;
  }

  render() {
    if (this.isnomodal) {
      return (
        <iframe
          name="recordframe"
          key={this.lessonuid}
          style={{ height: '100vh' }}
          onLoad={() => {
          }}
          src={`/react/amazingclassroom?replayCourseId=${this.lessonuid}`}
          width="100%"
          height="100%"
          frameBorder="no"
          marginWidth="0"
          marginHeight="0"
          scrolling="no"
          allowtransparency="yes"
          allowFullScreen={true}
        />
      );
    }
    return (
      <Modal
        isOpen={this.state.isopen}
        style={FullModalStyles}
        contentLabel="录像播放"
      >

        <CloseDiv
          onClick={(e) => {
            this.setState({ isopen: false });
            if (this.closecb) this.closecb();
          }}
        />
        <iframe
          name="recordframe"
          style={{ height: '100vh' }}
          onLoad={() => {
          }}
          src={`/react/amazingclassroom?replayCourseId=${this.lessonuid}`}
          width="100%"
          height="100%"
          frameBorder="no"
          marginWidth="0"
          marginHeight="0"
          scrolling="no"
          allowTransparency="yes"
          allowFullScreen="true"
        />

      </Modal>
    );
  }
}

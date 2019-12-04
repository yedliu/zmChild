import React, { useEffect } from 'react';
import './index.scss';

const TeacherDetails = (props) => {
  const { visible, setVisible, url } = props;

  useEffect(() => {
    window.addEventListener('message', iframeListener, false);
    return () => {
      window.removeEventListener('message', iframeListener, false);
    }
  }, [visible])

  const iframeListener = (e) => {
    const { action } = e.data;
    if (action === 'back') {
      setVisible();
    }
  }

  return (
    visible ? <div id="teacherdetails">
      <iframe
        onLoad={() => {
          window.addEventListener('message', iframeListener, false);
        }}
        // src="https://kids-active.zmaxis.com/pad/teacherIntroduction.html"
        src={`${url}`}
        width="100%"
        height="100%"
        frameBorder="no"
        marginWidth="0"
        marginHeight="0"
        scrolling="yes"
        allowtransparency="yes"
        allowFullScreen={true}
      />
    </div> : null
  )
}

export default TeacherDetails;
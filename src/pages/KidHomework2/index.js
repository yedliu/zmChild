import React, { useEffect } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import './style.scss';

function KidHomework2(props) {
  const { homeworkLink, from } = props.location.state;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const iframeListener = (e) => {
    if (e.data.action === 'back') {
      const targetPath = from;
      props.dispatch(routerRedux.push(
        {
          pathname: targetPath,
          state: {
            from: '/kid/kidhomework2',
          },
        },
      ));
    }
  };

  useEffect(() => {
    window.addEventListener('message', iframeListener, false);
  }, [iframeListener]);

  return (
    <div id="kidhomework2">
      <iframe
        onLoad={() => {
          window.addEventListener('message', iframeListener, false);
        }}
        src={`${homeworkLink}`}
        width="100%"
        height="100%"
        frameBorder="no"
        marginWidth="0"
        marginHeight="0"
        scrolling="yes"
        allowtransparency="yes"
        allowFullScreen={true}
      />
    </div>
  );
}

export default connect()(KidHomework2);

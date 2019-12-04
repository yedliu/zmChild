import React, { useEffect } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { AppLocalStorage } from 'utils/localStorage';
import './index.scss';

function KidPracticeCenter(props) {
  const { url } = props.location.state;
  const { dispatch } = props;

  useEffect(() => {
    window.addEventListener('message', IframeListener, false);
    return () => {
      window.removeEventListener('message', IframeListener, false);
    }
  }, [IframeListener])

  const IframeListener = (e) => {
    if (e.data.action === 'back') {
      const { from } = props.location.state;
      dispatch(routerRedux.push(
        {
          pathname: from,
          state: {
            from: '/kid/kidpracticecenter',
          },
        },
      ));
    }
  };

  return (
    <div id="kidpracticecenter">
      <iframe
        onLoad={() => {
          window.addEventListener('message', IframeListener, false);
        }}
        src={`${url}?token=${AppLocalStorage.getOauthToken()}&device=PC`}
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
  )
}

function mapStateToProps({ kidpracticecenter }) {
  return { kidpracticecenter };
}


export default connect(mapStateToProps)(KidPracticeCenter);
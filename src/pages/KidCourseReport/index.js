import React, { useEffect } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import './style.scss';


function KidCourseReport(props) {
  const { linkUrl } = props.location.state;

  const IframeListener = (e) => {
    if (e.data.action === 'back') {
      const { dispatch } = props;
      const { from } = props.location.state;
      dispatch(routerRedux.push(
        {
          pathname: from,
          state: {
            from: '/kid/kidcoursereport',
          },
        },
      ));
    }
  };

  useEffect(() => {
    window.addEventListener('message', IframeListener, false);
  }, [IframeListener]);

  return (
    <div id="kidcoursereport">
      <iframe
        onLoad={() => {
          window.addEventListener('message', IframeListener, false);
        }}
        src={`${linkUrl}&device=PC`}
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


function mapStateToProps({ KidCourseReportModal }) {
  return { KidCourseReportModal };
}


export default connect(mapStateToProps)(KidCourseReport);

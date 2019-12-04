import React from 'react';
import KidHeader from 'components/kidHeader';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import KidVideo from 'components/KidVideo';
import './style.scss';

class KidHistoryVideo extends React.Component {
  componentDidMount() {
    const { dispatch, location } = this.props;
    if (location.state) {
      const { data } = location.state;
      if (data) {
        dispatch({
          type: 'kidvideoModel/getVideoTypeData',
          payload: data,
        });
      }
    }
  }

  setVideoIndex = (index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'kidvideoModel/setVideoIndex',
      selectVideoIndex: index,
    });
  }

  handleGoBack = () => {
    const { dispatch } = this.props;
    // clickVoice()
    const { from } = this.props.location.state;
    dispatch(routerRedux.push(
      {
        pathname: from,
        state: {
          from: '/kid/kidhistoryvideo',
        },
      },
    ));
  }

  render() {
    const { history, kidvideoModel } = this.props;
    const { videoData, selectVideoIndex } = kidvideoModel;
    console.log('videoData', videoData);
    return (
      <div id="kidhistoryvideo">
        <KidHeader goBack={this.handleGoBack} history={history} center="课程回放" />
        <div className="VideoWrapper">
          <KidVideo
            curVideo={videoData}
            selectedvideoindex={selectVideoIndex}
            setVideoIndex={() => this.setVideoIndex(index)}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ kidvideoModel }) {
  return { kidvideoModel };
}

export default connect(mapStateToProps)(KidHistoryVideo);

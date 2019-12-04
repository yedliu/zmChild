import React from 'react';
import { connect } from 'dva';
import KidLoading from 'components/KidLoading';

const TIMER = 250;
let timeoutId = null;
const filterRoute = ['/kid/message', '/kid/kidmindlesson', '/kid/kiddownpage']

class App extends React.Component {
  state = {
    show: false,
  }

  componentWillMount() {
    const pathName = window.location.pathname;
    const delayTime = pathName == '/kid' ? TIMER : 0;
    const { loading } = this.props;
    if (loading) {
      timeoutId = setTimeout(() => {
        this.setState({
          show: true,
        });
      }, delayTime);
    }
  }

  componentWillReceiveProps(nextProps) {
    const pathName = window.location.pathname;
    const delayTime = pathName == '/kid' ? TIMER : 0;
    const { loading } = nextProps;
    this.setState({
      show: false,
    });
    if (loading) {
      timeoutId = setTimeout(() => {
        this.setState({
          show: true,
        });
      }, delayTime);
    }
  }

  componentWillUnmount() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  render() {
    const { loading } = this.props;
    const { show } = this.state;
    const pathName = window.location.pathname;
    const noLoading = filterRoute.includes(pathName);
    return (
      <div id="all-router">
        { this.props.children }
        {loading && show && !noLoading && <KidLoading loading={loading && show && !noLoading} />}
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    loading: state.loading.global && !state.loading.models.Verify,
  };
};

export default connect(mapStateToProps)(App);

import React from 'react';
// import KidHeader from 'components/kidHeader';
import { connect } from 'dva';

class Test extends React.Component {
  render() {
    return (
      <div>123</div>
    );
  }
}

function mapStateToProps({ test }) {
  return { test };
}

export default connect(mapStateToProps)(Test);

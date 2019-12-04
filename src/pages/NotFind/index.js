import React from 'react';
import { connect } from 'dva';
import KidHeader from 'components/kidHeader';
import './style.scss';

class NotFind extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <div id="not-find">
        <KidHeader history={history} />
        <div className="notfind">
          <div className="notpic" />
          <div className="not-text">哎呀，页面找不到了</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ NotFindModel }) {
  return { NotFindModel };
}

export default connect(mapStateToProps)(NotFind);

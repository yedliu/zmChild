import React, { Component } from 'react';
import { clickVoice } from 'utils/helpfunc';
import './style.scss';

class KidHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scale: false,
    };
  }

  defaultBack = () => {
    const { goBack, history } = this.props;
    clickVoice();
    goBack ? goBack() : history.goBack();
  }

  render() {
    const { children, center, right } = this.props;
    return (
      <div id="kid-header">
        <div className="header-left header">
          <span className="back" onClick={this.defaultBack} />
        </div>
        <div className="header-center header"><div className="center-box">{center || children}</div></div>
        <div className="header-right header">{right}</div>
      </div>
    );
  }
}

export default KidHeader;

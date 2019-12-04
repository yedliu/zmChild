import React from 'react';

class AbstractFragment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.isInteractive = this.isInteractive.bind(this);
  }

  // 可重写
  isInteractive() {
    const { interactive, showRightAnswer, showCorrection } = this.props;
    if (!interactive || showRightAnswer || showCorrection) {
      return false;
    }
    return true;
  }
}

AbstractFragment.defaultProps = {
  stuAnswer: '',
};

export default AbstractFragment;

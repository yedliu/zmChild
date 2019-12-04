import React, { Component } from 'react';
import NewProtal from './newProtal';
import './style.scss';

class ZmModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    this.setState({ visible: this.props.visible });
  }

  componentWillReceiveProps(props) {
    this.setState({ visible: props.visible });
  }

  closeMask = () => {
    const { maskClick } = this.props;
    maskClick && maskClick();
  }

  // 由于少儿的弹窗样式多变，所以弹窗内容不做固定，使用者自己传入弹窗
  render() {
    const { children, visible, style } = this.props;
    return (
      <NewProtal visible={visible}>
        <div id="zm-tab">
          {children}
          <div className="mask" onClick={this.closeMask} style={style} />
        </div>
      </NewProtal>
    );
  }
}

export default ZmModal;

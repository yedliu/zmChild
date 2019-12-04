import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class NewProtal extends Component {
  constructor(props) {
    super(props);
    if (!this.node) {
      this.node = document.createElement('div');
      document.body.appendChild(this.node);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      document.body.appendChild(this.node);
    }
  }

  componentWillUnmount() {
    if (this.node) {
      // ReactDOM.unmountComponentAtNode(this.node);
      this.node.remove();
      this.node = null;
    }
  }

  render() {
    const { visible, children } = this.props;
    return (
      visible && ReactDOM.createPortal(
        children,
        this.node,
      )
    );
  }
}

export default NewProtal;

/**
*
* KidDropDown
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

class KidDropDown extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
    this.checked = this.checked.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
    this.show = this.show.bind(this);
  }

  checked(v) {
    if (v == this.props.value) {
      this.toggleShow();
      return false;
    }
    this.props.cb(v);
    this.toggleShow();
  }

  toggleShow(e) {
    this.setState({
      show: !this.state.show,
    });
    // 在react回调函数定义的stopPropagation只能阻止合成事件的冒泡
    e && e.nativeEvent.stopImmediatePropagation();
  }

  show() {
    this.setState({
      show: false,
    });
  }

  componentDidMount() {
    document.addEventListener('click', this.show);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.show);
  }

  render() {
    const { value, option, cb } = this.props;
    console.log('option', option)
    let cur = '';
    const _optionList = option.map((e, i) => {
      const bool = e.value == value;
      if (bool) {
        cur = e.label;
      }
      return (
        <div key={i} className={`item ${bool ? 'active' : ''}`} onClick={() => { this.checked(e.value); }}>
          <div className="item-list">{e.label}</div>
          <div className={`${bool ? 'gou' : ''}`} />
        </div>
      );
    });
    if (!value) {
      _optionList.push(<div key="default" className="item active">请选择</div>);
    }
    return (
      <div className="PickerWrapper">
        <div className="BtnPreview" onClick={this.toggleShow}>
          <a className="left-arr arrs" href="javascript:void(0)" />
          <span className="cur-label">{cur}</span>
          <span className={`drop-btn ${this.state.show ? 'open' : ''}`}>
            {option.length > 1 && <a className="right-arr arrs" href="javascript:void(0)" />}
          </span>
        </div>
        <div className="DownList">
          <div>
            {option && option.length > 1 && this.state.show
              ? (
                <div className="content">
                  <div className="ellipse" />
                  <div className="list-view">
                    {_optionList}
                  </div>
                </div>
              ) : ''}
          </div>
        </div>
      </div>
    );
  }
}

KidDropDown.propTypes = {
  option: PropTypes.array.isRequired,
  cb: PropTypes.func.isRequired,
};

export default KidDropDown;

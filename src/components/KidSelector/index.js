import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

/**
 * data 格式 [{label: '', value: ''}...]
 */
export class KidSelector extends React.Component {
  static defaultProps = {
    data: [],
    placeholder: '',
    preLabel: '',
    preLabelClass: '',
    onChange: () => {},
  }

  static propTypes = {
    data: PropTypes.array,
    placeholder: PropTypes.string,
    preLabel: PropTypes.string,
    preLabelClass: PropTypes.string,
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showDropdown: false,
      selectedItem: {
        label: '',
        value: '',
      },
    };
  }

  handleClick(e) {
    e.stopPropagation();
    this.setState({
      showDropdown: !this.state.showDropdown,
    });
  }

  handleSlect(item) {
    const preSlectItem = this.state.selectedItem;

    if ((item.label && (!preSlectItem.label || preSlectItem.label !== item.label)) || (item.value && (!preSlectItem.value || preSlectItem.value !== item.value))) {
      this.props.onChange(item);
    }
    this.setState({
      selectedItem: item,
      showDropdown: false,
    });
  }

  componentDidMount() {
    window.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!this.refs.myKidSelector.contains(e.target)) {
        this.setState({
          showDropdown: false,
        });
      }
    });
  }

  render() {
    const { data, placeholder, preLabel, preLabelClass, defaultLabel } = this.props;
    return (
      <div ref="myKidSelector" className="kid-selector" data-arrow={this.state.showDropdown ? 'up' : 'down'}>
        <div className="kid-selector-content" onClick={((e) => { !defaultLabel && this.handleClick(e); })}>
          { preLabel && <span className={`pre-label ${preLabelClass}`}>{preLabel}</span>}
          <div className={`selected ${this.state.selectedItem.label && 'had-selected'}`}>{this.state.selectedItem.label ? this.state.selectedItem.label : defaultLabel || placeholder}</div>
        </div>
        <div className="kid-selector-popwrapper" className={`kid-selector-popwrapper ${this.state.showDropdown ? 'show' : 'hide'}`}>
          <ul>
            {
                data.length && data.map((item, index) => <li key={index} onClick={() => this.handleSlect(item)}>{item.label}</li>)
            }
          </ul>
        </div>
      </div>
    );
  }
}

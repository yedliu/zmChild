/**
*
* EditBox
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { addImgSrc, AjaxUpload } from './common';
import './edit.scss';

import a_n from '../images/a_n.png';
import a_s from '../images/a_s.png';
import b_n from '../images/b_n.png';
import b_s from '../images/b_s.png';
import c_n from '../images/c_n.png';
import c_s from '../images/c_s.png';
import d_n from '../images/d_n.png';
import d_s from '../images/d_s.png';

class EditBox extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.uploagChange = this.uploagChange.bind(this);
    this.syncAnswer = this.syncAnswer.bind(this);
  }

  componentDidMount() {
    const { isChoice, value } = this.props;
    // console.log(value, 'value - com');
    if (!isChoice) {
      this.refs.textArea.innerHTML = value;
    }
    if (!isChoice && this.refs.textArea) {
      this.refs.textArea.focus();
    }
  }

  handleChange() {
    const str = this.refs.textArea.innerHTML;
    console.log(str);
    this.props.receiveAnswer(str);
  }

  uploagChange(event, props) {
    const e = event || window.event;
    const { files } = e.target;
    if (!files.length) {
      return;
    }
    const me = this;
    AjaxUpload('/api/homeworkLesson/uploadImg', files, (data) => {
      document.execCommand('insertImage', false, addImgSrc(`src="${data.data}"`, 'stuAnswer').replace(/(src=\")|(\")/g, ''));
      document.querySelector('.txt-area').focus();
      this.refs.img_input.value = '';
      return false;
    });
  }

  syncAnswer(str) {
    const { value, single } = this.props;
    console.log('str', value, single);
    const _str = str.toUpperCase();
    if (single) {
      this.props.receiveAnswer(_str);
    } else {
      const _value = value || '';
      const _arr = _value ? _value.split('|') : [];
      _arr.forEach((e, i) => {
        _arr[i] = e.toUpperCase();
      });
      const _index = _arr.indexOf(_str);
      if (_index >= 0) {
        _arr.splice(_index, 1);
      } else {
        _arr.push(str);
      }
      this.props.receiveAnswer(_arr.join('|'));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isChoice, value } = this.props;
    //   console.log('editor did update')
    // console.log(value, 'value - com');
    if (!isChoice) {
      this.refs.textArea.innerHTML = value;
    }
  }

  render() {
    const { isChoice, value } = this.props;
    const _value = value || '';
    return (
      <div id="EditWrapper">
        {isChoice
          ? (
            <div className="ChoiceWrapper">
              <div className="label">答题卡</div>
              <div className="OptionWrapper">
                <div>请选择正确的选项：</div>
                <div className="options">
                  {_value.indexOf('a') >= 0 || _value.indexOf('A') >= 0
                    ? <img src={a_s} alt="" onClick={() => this.syncAnswer('A')} />
                    : <img src={a_n} className="hover" onClick={() => this.syncAnswer('A')} alt="" />
                            }
                  {_value.indexOf('b') >= 0 || _value.indexOf('B') >= 0
                    ? <img src={b_s} alt="" onClick={() => this.syncAnswer('B')} />
                    : <img src={b_n} className="hover" onClick={() => this.syncAnswer('B')} alt="" />
                            }
                  {_value.indexOf('c') >= 0 || _value.indexOf('C') >= 0
                    ? <img src={c_s} alt="" onClick={() => this.syncAnswer('C')} />
                    : <img src={c_n} className="hover" onClick={() => this.syncAnswer('C')} alt="" />
                            }
                  {_value.indexOf('d') >= 0 || _value.indexOf('D') >= 0
                    ? <img src={d_s} alt="" onClick={() => this.syncAnswer('D')} />
                    : <img src={d_n} className="hover" onClick={() => this.syncAnswer('D')} alt="" />
                            }
                </div>
              </div>
            </div>
          ) : (
            <div className="OtherQuestion">
              <div className="upload-box">
                <input ref="img_input" className="upload" onChange={this.uploagChange} type="file" accept="image/bmp,image/gif,image/jpeg,image/x-png" />
              </div>
              <div
                ref="textArea"
                className="txt txt-area"
                contentEditable
                onBlur={this.handleChange}
              />
            </div>
          )

                }
      </div>
    );
  }
}

EditBox.propTypes = {
  isChoice: PropTypes.bool,
  value: PropTypes.string,
};

export default EditBox;

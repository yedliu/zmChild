/**
*
* WangEditor
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Editor from 'wangeditor';
import { uploadFiles } from './func';
import './editorStyle.scss';

class WangEditor extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.changeText = this.changeText.bind(this);
    this.removeDefaultText = this.removeDefaultText.bind(this);
    this.initHasToolHeader = this.initHasToolHeader.bind(this);
    this.initNoToolHeader = this.initNoToolHeader.bind(this);
    this.uploadChange = this.uploadChange.bind(this);
    this.renderHear = this.renderHear.bind(this);
  }

  componentWillMount() {
    this.editor = null;
  }

  componentDidMount() {
    if (this.props.dataType === 'text') {
      this.initNoToolHeader();
    } else {
      this.initHasToolHeader();
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   this.editor.txt.html(this.props.data.content);
  // }
  componentWillUnmount() {
    this.editor = null;
  }

  initHasToolHeader() {
    const { editorId, data } = this.props;
    const editor = new Editor(`#${editorId}-bar`, `#${editorId}-edit`);
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = (html) => {
      // console.log(html, 'html');
      this.changeText(html);
    };
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'list', // 列表
      'quote', // 引用
      'justify', // 对齐方式
      // 'emoticon',  // 表情
      'code', // 插入代码
      'table', // 表格
      'link', // 插入链接
      'image', // 插入图片
      // 'video',  // 插入视频
      // 'undo',  // 撤销
      // 'redo'  // 重复
    ];
    editor.customConfig.zIndex = 100; // 设置编辑区域的 z-index.

    // Set the network image to hide the tab bar. 设置隐藏tab栏的网络图片。 false：只保留本地上传功能；true：本地上传和网络图片
    editor.customConfig.showLinkImg = false;

    editor.customConfig.fontNames = [
      '宋体',
      '微软雅黑',
      'Arial',
      'Tahoma',
      'Verdana',
    ];
    // 禁用 base64 上传
    editor.customConfig.uploadImgShowBase64 = false;
    // 设置最大上传为 10m
    editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024;
    // 设置只允许上传一张图片
    editor.customConfig.uploadImgMaxLength = 1;

    // 配置 debug 模式.
    editor.customConfig.debug = true;

    editor.customConfig.customUploadImg = (files, insert) => {
      uploadFiles(files, (json) => {
        if (json && json.code.toString() === '1') {
          insert(`//oss-cn-hangzhou.aliyuncs.com/zm-chat-interview${json.data}`);
        } else {
          alert(json.message || '图片上传失败！');
        }
      });
    };
    editor.create(); // 生成编辑器
    this.editor = editor;
    this.editor.txt.html(data.content);

    const imgBtn = document.querySelector('.w-e-icon-image').parentElement;
    imgBtn.onclick = () => {
      setTimeout(() => {
        document.querySelector('[type="file"]').multiple = false;
      }, 30);
    };
  }

  initNoToolHeader() {
    const { editorId, data, dataType } = this.props;
    // console.log('235');
    const editor = new Editor(`#${editorId}-edit`);
    editor.customConfig.onchange = (html) => {
      // 将 html 转换为文本形式
      this.changeText(html.replace(/<p>/g, '').replace(/<\/p>/g, '\n').replace(/\n$/, '').replace(/style="[^"]+"/g, '')
        .replace(/<br[\s]?\/?>/, ''));
    };
    editor.customConfig.menus = [];
    editor.customConfig.zIndex = 100; // 设置编辑区域的 z-index.

    // Set the network image to hide the tab bar. 设置隐藏tab栏的网络图片。 false：只保留本地上传功能；true：本地上传和网络图片
    editor.customConfig.showLinkImg = false;

    editor.customConfig.fontNames = [
      '宋体',
      '微软雅黑',
      'Arial',
      'Tahoma',
      'Verdana',
    ];
    // 禁用 base64 上传
    editor.customConfig.uploadImgShowBase64 = false;
    // 设置最大上传为 10m
    editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024;
    // 设置只允许上传一张图片
    editor.customConfig.uploadImgMaxLength = 1;

    // 配置 debug 模式.
    editor.customConfig.debug = true;

    editor.customConfig.customUploadImg = (files, insert) => {
      uploadFiles(files, (json) => {
        if (json && json.code.toString(json.code) === '1') {
          insert(`//oss-cn-hangzhou.aliyuncs.com/zm-chat-interview${json.data}`);
        } else {
          alert(json.message || '图片上传失败！');
        }
      });
    };
    editor.create(); // 生成编辑器
    this.editor = editor;
    this.editor.txt.html(data.content.split('\n').map(it => `<p>${it.replace(/<p[.*]>|\n/g, '')}</p>`).join(''));
  }

  changeText(html) {
    const { changeContent, data } = this.props;
    // console.log(data, html, 'html');
    changeContent(data.index, html);
  }

  removeDefaultText() {
    // get the default dom. 获取到默认的提示文字的dom。
    const dom = this.defaultText || undefined;
    const parentEle = (dom && dom.parentNode);
    !parentEle || parentEle.removeChild(dom);
  }

  uploadChange(e) {
    const { files } = e.target;
    if (files && files.length > 0) {
      this.editor.uploadImg.uploadImg(files);
    }
  }

  renderHear() {
    const { styleType = 0, editorId, header } = this.props;
    let res = '';
    switch (header) {
      case 'customize1':
        res = (
          <div className="InputWrapper">
            <input onChange={this.uploadChange} type="file" accept="image/bmp,image/gif,image/jpeg,image/x-png" title="支持多种图片格式哦！" />
          </div>
        );
        break;
      default:
        res = <div className={`${styleType === 0 ? 'BarStyle1' : 'BarStyle2'}`} id={`${editorId}-bar`} />;
        break;
    }
    return res;
  }

  render() {
    const { defaultText, editorId, contentStyle, styleType = 0 } = this.props;
    return (
      <div className={`EditorWrapper ${styleType === 0 ? 'WrapperStyle1' : 'WrapperStyle2'}`}>
        {this.renderHear()}
        <div className={`EditorContentWrapper ${styleType === 1 ? 'ContentWrapperStyle' : ''}`}>
          <div className={`EditorBox ${styleType === 0 ? 'BoxStyle1' : 'BoxStyle2'}`} style={contentStyle || {}} id={`${editorId}-edit`} innerRef={x => this.editorBox = x} onClick={this.removeThisDom}>
            {defaultText ? <p innerRef={x => this.defaultText = x} className="rmoveMe">{defaultText}</p> : ''}
          </div>
        </div>
      </div>
    );
  }
}

WangEditor.propTypes = {
  // defaultText: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.undefined,
  // ]),
  changeContent: PropTypes.func.isRequired,
  editorId: PropTypes.string.isRequired,
  contentStyle: PropTypes.object, // 编辑框的样式，当前编辑器编辑框的样式
  data: PropTypes.object.isRequired, // 编辑器内要显示的内容
  styleType: PropTypes.number, // 编辑器样式方案
  dataType: PropTypes.string, // 获取到的内容类型 "html" 或 "text"
  header: PropTypes.string, // 菜单工具栏的类型
};

export default WangEditor;

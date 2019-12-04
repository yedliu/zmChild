import React from 'react';
import PropTypes from 'prop-types';
import { AppLocalStorage } from 'utils/localStorage';
import { Config } from 'utils/config';
export class ZmlDocIframe extends React.PureComponent {
  constructor(props) {
    super(props);
    this.zmldocIframeListener = this.zmldocIframeListener.bind(this);
    this.dom = null;
    this.state = {
      Url: '',
    }
  }
  componentDidMount() {
    window.addEventListener('message', this.zmldocIframeListener);
    const { data, role, preview, isZmg } = this.props;
    const hidePreviewNav = this.props.hidePreviewNav || false;
    if (isZmg) {
      if (preview == 'class') {
        if (data.coursewareType === 1000503) {
          this.setState({
            Url: `${data.ossUrl || data.docContent}?role=${role || AppLocalStorage.getRole()}&device=PC&usage=preview&hidePreviewNav=${hidePreviewNav}`
          });
        } else if (data.coursewareType === 1000504) {
          this.setState({
            Url: `${Config.zmg}?role=${role || AppLocalStorage.getRole()}&device=PC&usage=preview&hidePreviewNav=${hidePreviewNav}&coursewareId=${data.editorGameUid}&versionCode=${data.versionCode}`
          });
        }
      } else {
        this.setState({
          Url: `${data.content}&msgSendModle=post&pagenum=${data.currentPage < 0 ? data.currentPage + 1 : data.currentPage}&isPreview=true`,
        });
      }
    } else {

      let tempUrl = `${Config.zmlDocContentUrl}?role=${role || AppLocalStorage.getRole()}&device=PC&usage=${preview}&hidePreviewNav=${hidePreviewNav}`

      if (preview === 'preview') {
        tempUrl = `${Config.zmlDocContentUrl}?role=${role || AppLocalStorage.getRole()}&device=PC&usage=${preview}&hidePreviewNav=${hidePreviewNav}&hideSidebar=${preview === 'preview'}`
      } 

      this.setState({
        Url: tempUrl
      });

    }
  }
  componentWillUnmount() {
    window.removeEventListener('message', this.zmldocIframeListener);
  }
  zmldocIframeListener(e) {
    if (e.data.action === 'ready') {
      this.props.zmlDocIframeInit(this.dom);
    }
    this.props.zmlDocIframeCb(e.data);
  }
  render() {
    const { Url } = this.state;
    return (
      <iframe
        ref={(dom) => {
          if (dom) {
            // console.log('zmldocIframe', dom);
            this.dom = dom;
          }
        }}
        src={Url}
        // src={`${isZmg ? zmg : zmlDocContentUrl}?role=${role || AppLocalStorage.getRole()}&device=PC&usage=${this.props.preview ? 'preview' : 'class'}&hidePreviewNav=${hidePreviewNav}`}
        width="100%"
        height="100%"
        frameBorder="no"
        marginWidth="0"
        marginHeight="0"
        scrolling="no"
        allowtransparency="yes"
        allowFullScreen={true}
      />
    );
  }
}
ZmlDocIframe.propTypes = {
  zmlDocIframeInit: PropTypes.func.isRequired,
  zmlDocIframeCb: PropTypes.func.isRequired,
};
export default ZmlDocIframe;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NewProtal from 'components/zmModal/newProtal';
import { AppLocalStorage } from 'utils/localStorage';
import './style.scss';

class TchFestival extends Component {
  constructor(props) {
    super(props);
    const visible = !window[props.festivalName] && this.initVisible();
    this.state = {
      visible
    };
  }

  static propTypes = {
    festivalName: PropTypes.string.isRequired,
    festivalUrl: PropTypes.string.isRequired,
    times: PropTypes.number,
  }

  componentDidMount() {
    window.addEventListener('message', this.IframeListener, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.IframeListener, false);
  }

  initVisible() {
    const { times, festivalName } = this.props;
    const tchFestivalShow = Number(localStorage.getItem(festivalName));
    return tchFestivalShow > Number(times) - 1 ? false : true;
  }

  closeMask = () => {
    const { festivalName } = this.props;
    const tchFestivalShow = Number(localStorage.getItem(festivalName));
    localStorage.setItem(festivalName, tchFestivalShow + 1);
    window[festivalName] = true;
    this.setState({ visible: false });
  }

  IframeListener = (e) => {
    if (e.data.action === 'back') {
      this.closeMask();
    }
  }

  render() {
    const { festivalUrl } = this.props;
    const { visible } = this.state;
    return (
      <NewProtal visible={visible}>
        <div id='tchFestival'>
          <iframe
            ref={(dom) => {
              if (dom) {
                this.dom = dom;
              }
            }}
            onLoad={() => {
              window.addEventListener('message', this.IframeListener, false);
            }}
            src={`${festivalUrl}?token=${AppLocalStorage.getOauthToken()}`}
            width="100%"
            height="100%"
            frameBorder="no"
            marginWidth="0"
            marginHeight="0"
            scrolling="yes"
            allowtransparency="yes"
            allowFullScreen={true}
          />
        </div>
      </NewProtal>
    );
  }
}

export default TchFestival;

import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import KidHeader from 'components/kidHeader';
import KidAppointment from 'components/KidAppointment';

import './index.scss';

class kidKnows extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  componentDidMount() {
    const { type, subject, linkUrl } = this.props.location.state;
    console.log('type====>', type);
    console.log('subject====>', subject);
    this.setState({
      title: type === 'knowKid' ? '了解掌门少儿' : subject.subjectLabel && subject.subjectLabel,
      linkUrl: type === 'knowKid' ? `${linkUrl}?kidApplication=1` : `${subject.h5Url}?kidApplication=1`,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.func);
  }

  render() {
    const { showModal, linkUrl, title } = this.state;

    return (
      <div className="kidKnows">
        <KidHeader goBack={() => this.props.dispatch(routerRedux.push('/kid'))}>{title}</KidHeader>
        <div className="content">
          <div className="iframeWrap">
            <iframe
              onLoad={() => {
                console.log('onLoad============>');
                this.func = (e) => {
                  console.log('func==========>');
                  if (e.data.type === 'kid_pc_web') {
                    this.setState({ showModal: e.data.showDialog });
                  }
                };
                window.addEventListener('message', this.func);
              }}
              ref={dom => this.appointIframe = dom}
              src={linkUrl}
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
        </div>
        {
          showModal && (
          <KidAppointment switchModelStat={() => this.setState({ showModal: !showModal })
          }
          />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = ({ loading }) => { // 见名知意，把state转换为props
  // 可以打印state看看数据结构，然后放到data里
  return { loading };
};

export default connect(mapStateToProps)(kidKnows);

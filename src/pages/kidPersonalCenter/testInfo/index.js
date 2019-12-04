import './testInfo.scss';
import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import { LearningAbilityReport } from 'components/LearningAbilityReport';
import { routerRedux } from 'dva/router';
import { clickVoice } from 'utils/helpfunc';
import { Config } from 'utils/config';
import { AppLocalStorage } from 'utils/localStorage';

class TestInfo extends Component {
  static defaultProps = {
    doneLearningAbilityTest: false,
    learningAbilityResult: [],
  }

  static propTypes = {
    getLearningAbilityResult: PropTypes.func,
    doneLearningAbilityTest: PropTypes.bool,
    learningAbilityResult: PropTypes.array,
  }

  state = {
  }

  componentDidMount() {
    const { doneLearningAbilityTest,getLearningAbilityResult,dispatch } = this.props;
    if (doneLearningAbilityTest) {
      getLearningAbilityResult();
    }
    dispatch({
      type: 'KidPersonalCenterModel/getPhasetestUrl'
    });
  }

  goAbilityTest = () => {
    clickVoice();
    const { dispatch, doneLearningAbilityTest, learningAbilityResult } = this.props;
    // 已测评跳测评结果页
    const pathname = '/kid/learningAbility';
    // if (!!doneLearningAbilityTest && learningAbilityResult && (learningAbilityResult.length === 15)) {
    //   pathname = '/kid/ability/report';
    // }
    dispatch(routerRedux.push({
      pathname,
      state: {
        from: '/kid/personal',
      },
    }));
  }

  goPhaseTest = () => {
    clickVoice();
    const { phaseTestUrl = {},dispatch } = this.props;
    const { periodTestStudyUrl } = phaseTestUrl;
    if (!periodTestStudyUrl) {
      return;
    }
    const token = AppLocalStorage.getOauthToken();
    const src = `${periodTestStudyUrl}?token=${token}&device=PC`;
    dispatch(routerRedux.push({
      pathname: '/kid/phasetest',
      state: {
        src,
        from: '/kid/personal'
      }
    }))
  }

  render() {
    const { doneLearningAbilityTest,learningAbilityResult,dispatch } = this.props;
    console.log('learningAbilityResult:',this.props);
    return (
      <div id="testInfo">
        {
          // !!doneLearningAbilityTest && learningAbilityResult && (learningAbilityResult.length === 15)
          //   ? (
          //     <div className="had-test">
          //       <LearningAbilityReport dispatch={dispatch} learningAbilityInfo={learningAbilityResult} header />
          //     </div>
          //   )
          //   :
          (
            <div className="un-test">
              {/* <div className="no-bg" />
                <div className="no-tip">还没有进行过学习力测评哦，快来测测吧</div>
                <div className="test-btn" onClick={() => this.goAbilityTest()}>开始测评</div> */}
              <div className="test-item phase-test" onClick={() => this.goPhaseTest()}>
                <p>阶段测评</p>
              </div>
              <div className="test-item ability-test" onClick={() => this.goAbilityTest()}>
                <p>学习力测评</p>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export { TestInfo };

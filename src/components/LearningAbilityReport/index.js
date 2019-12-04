import './learningAbilityReport.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { goAbilityTest } from 'utils/padCommon';
import { clickVoice } from 'utils/helpfunc';

class LearningAbilityReport extends Component {
  static defaultProps = {
    learningAbilityInfo: [],
    platform: '',
    header: false,
  }

  static propTypes = {
    learningAbilityInfo: PropTypes.array,
    platform: PropTypes.string,
    header: PropTypes.bool,
  }

  state = {
    domRef: React.createRef(),
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps && nextProps.reportScrollTop) {
      const { domRef } = this.state;
      domRef.current.scrollTop = nextProps.reportScrollTop;
    }
  }

  getReport(learningAbilityInfo) {
    const reportInfo = {
      concentration: { score: 0 },
      memory: { score: 0, selectA: 0, selectB: 0, selectC: 0 },
      willpower: { score: 0 },
      thinking: { score: 0 },
    };
    for (let i = 0; i < learningAbilityInfo.length; i++) {
      if (i > 10) {
        reportInfo.thinking.score += learningAbilityInfo[i].score;
      } else if (i > 7) {
        reportInfo.willpower.score += learningAbilityInfo[i].score;
      } else if (i > 2) {
        reportInfo.memory.score += learningAbilityInfo[i].score;
        switch (learningAbilityInfo[i].score) {
          case 0:
            reportInfo.memory.selectA += 1;
          case 1:
            reportInfo.memory.selectB += 1;
          case 2:
            reportInfo.memory.selectC += 1;
        }
      } else {
        reportInfo.concentration.score += learningAbilityInfo[i].score;
      }
    }

    // 专注力相关评语和建议
    if (reportInfo.concentration.score > 4) {
      reportInfo.concentration.star = 5;
      reportInfo.concentration.evaluate = '你的注意力较好，在学习和生活中专注性较高。很少被无关事物影响，可以控制自己的身体和动作。视觉注意力优于听觉注意力，因此你需要进一步提升听觉注意力水平。';
      reportInfo.concentration.advise = '建议重点提升听觉注意力水平，听觉注意力会直接影响你上课的听课水平和吸收状态。';
    } else if (reportInfo.concentration.score > 2) {
      reportInfo.concentration.star = 4;
      reportInfo.concentration.evaluate = '你在学习的过程中会出现走神，开小差的现象，在阅读和考试中会出现看错，写错，漏字，多字等现象。你的成绩会随着你注意力的状态而波动。';
      reportInfo.concentration.advise = '建议提升注意力水平，尤其是视觉注意力的细节和听觉注意力的细节。视觉注意力会直接影响你的阅读，答卷和听课水平。';
    } else {
      reportInfo.concentration.star = reportInfo.concentration.score + 1;
      reportInfo.concentration.evaluate = '你的注意力灵活性较好，但是注意力稳定相对较弱，上课易受环境干扰而分心。写作业时会做做玩玩，总会粗心犯错，不断地以喝水、吃东西、小便等理由中断。有时即使看着老师也时常不知道提问的内容。';
      reportInfo.concentration.advise = '你需要尽快提升注意力的稳定性和自控力，注意力水平对你的学习和生活的影响较大。';
    }

    // 记忆类型相关评语和建议
    if (reportInfo.memory.selectA > 2) {
      reportInfo.memory.type = '视觉型记忆类型';
      reportInfo.memory.evaluate = '你在记忆过程中主要是以“看”来建立自己的信息库。你对看过的图、动画、动作记忆深刻，但是有时对细节的敏锐度稍弱，你可以记住图片的大部分内容，但是细节往往被你忽略。';
      reportInfo.memory.advise = '你可以多采用“看”的方式来学习，如文字、图表、图片、视频材料等。你在“倾听”方面的能力比较弱，经常“左耳进右耳出”。所以，你需要重点提升视觉记忆的细节性以及听觉记忆力。';
    } else if (reportInfo.memory.selectB > 2) {
      reportInfo.memory.type = '听觉型记忆类型';
      reportInfo.memory.evaluate = '你平时对声音信息比较敏感，听觉信息记忆相对较好，在课堂上只要能听清楚老师的声音，就能吸收得很好。但是你不喜欢看书和记笔记，即使记笔记也懒得看。';
      reportInfo.memory.advise = '你主要依靠所听到的东西来吸收、记忆信息。所以，建议多采用“听”的方式学习，如音频、朗读、口头交流和讨论、复述等等，同时需要强化视觉记忆能力，加强阅读能力和记笔记的能力。';
    } else if (reportInfo.memory.selectC > 2) {
      reportInfo.memory.type = '触觉型记忆类型';
      reportInfo.memory.evaluate = '你学习的方式是需要通过“做”，如练习、实践、动作模仿等方式才能深入理解并记忆；你的注意力维持时间较短，总是想动，经常玩一会学一会，或是边学边玩，有些坐不住椅子，哪怕是铅笔、橡皮都是你在学习的时候选择的玩具。';
      reportInfo.memory.advise = '建议你多采用“做”的方式学习和记忆，比如说借助教具、记笔记、反复用笔演练、做实验、角色扮演等大量运用到你的手指、肢体、表情的方式，你需要重点强化你的的听觉记忆、视觉记忆、自控能力和注意力的稳定性。';
    } else {
      reportInfo.memory.type = '混合型记忆类型';
      reportInfo.memory.evaluate = '混合型是指视觉型、听觉型、触觉型这三种记忆类型的混合。你可能既对声音敏感，又对视觉信息敏感，或者既喜欢听觉信息又愿意经常动手操作，但是，你不会像单纯视觉记忆类型的学习者对视觉敏感度那么强。因此你可以采用灵活的方式进行记忆，并且找出你视觉记忆、听觉记忆、触觉记忆方面最薄弱方面进行提升，以全面提高你的记忆能力，提高学习效率。';
      reportInfo.memory.advise = '建议你在记忆的过程中尽量使用多种记忆策略，视觉、听觉、触觉方面的记忆可以交替使用，例如：在学习中也不仅要用眼看，还要用嘴读，用耳听，用手写，以构成立体的印象。这样的方法会提升你的记忆和学习效率。';
    }

    // 毅力相关评语和建议
    if (reportInfo.willpower.score > 4) {
      reportInfo.willpower.star = 5;
      reportInfo.willpower.evaluate = '你可以坚持你要做的计划，毅力较好。你有很好克服困难的能力，面对困难不会止步不前，会去尝试。你的抗挫折能力较好，不会因为一次考试或事情失败而否定自己，相反你会自我反思，解决困难。';
      reportInfo.willpower.advise = '你的意志力较好，建议继续保持，平时配合运动等可以提升意志力的活动，让自己达到更好的水平。在坚持的基础上要提升学习方法和学习效率，才可以帮助自己更上一层楼。';
    } else if (reportInfo.willpower.score > 2) {
      reportInfo.willpower.star = 4;
      reportInfo.willpower.evaluate = '你平时可以克服小的困难，会有自己坚持做的事情，但是较少。你做事情会去筛选难度，难的不做，简单的愿意去完成。面对失败会感到挫败，但是大部分可以自我调节。';
      reportInfo.willpower.advise = '你的意志力需要提升，尤其是面对困难和坚持计划的时候，你经常有很好的开端，但是一段时间后无法坚持，因此，提升毅力和自控力是你目前提升的重点。';
    } else {
      reportInfo.willpower.star = reportInfo.willpower.score + 1;
      reportInfo.willpower.evaluate = '面对困难你会不想做，想要放弃，哪怕你可以完成的事情，有时你也会不想去做，你会低估你的能力，对自己缺少自信。面对失败你会有很大的挫败感，在失败之后会去逃避，或是坚持几天发现比较困难然后放弃。';
      reportInfo.willpower.advise = '建议进行毅力和自律的训练，并且提升你的自信心和抗挫折能力。';
    }

    // 思维能力相关评语和建议
    if (reportInfo.thinking.score > 3) {
      reportInfo.thinking.evaluate = '你的思维能力比较敏捷，抽象思维和概括能力较强。可以独立思考问题，做事比较有条理性。你对数字和图形敏感性较强，能够发现其中的联系和规律；但是你不愿动手，实际操作能力需要提升。';
      reportInfo.thinking.advise = '你需要提升手脑协调能力，增强右脑的训练，锻炼实际操作能力。';
    } else if (reportInfo.thinking.score > 1) {
      reportInfo.thinking.evaluate = '你在学习和生活中多数能抓住事情和学习的重点，但是条理性和逻辑性较弱，不喜欢创新和突破难题。有时你会忽略一些重要的细节，遇到难的问题找不到思路。';
      reportInfo.thinking.advise = '你需要训练思维的逻辑性和条理性，关注事物的细节，同时思维的灵活性和反应速度需要提升。';
    } else {
      reportInfo.thinking.evaluate = '你在日常中更偏向于感性和直觉去解决问题，有一定审美能力，比较情绪化，不喜欢去用逻辑思维思考。因此你的抽象思维和概括能力较弱，做事会缺少条理性，但是相对灵活。';
      reportInfo.thinking.advise = '建议增强思维训练，尤其是综合分析能力和逆向思维能力是你所需要提升的重点，需要配合情绪训练和自信心训练。';
    }
    reportInfo.thinking.star = reportInfo.thinking.score + 1;

    return reportInfo;
  }

  goAbilityTest = () => {
    clickVoice();
    const { dispatch, platform } = this.props;
    if (platform === 'KidsPad') {
      const host = window.location.origin;
      goAbilityTest(`${host}/kid/ability/test?retest&from=personal`);
    } else {
      dispatch(routerRedux.push({
        pathname: '/kid/ability/test?retest',
        state: {
          from: '/kid/personal',
        },
      }));
    }
  }

  render() {
    const { learningAbilityInfo, header } = this.props;
    const reportInfo = this.getReport(learningAbilityInfo);
    const { domRef } = this.state;
    return (
      <div ref={domRef} id="learningAbilityReport">
        {
          header
            ? (
              <div className="report-title">
测评报告
                <div className="retry-btn" onClick={() => this.goAbilityTest()}>重新测试</div>
              </div>
            ) : ''
        }
        <div className="score-item concentration">
          <div className="item-header">
            <div className="header-title">专注力分析</div>
            <div className="star-box">
              <div className="star light" />
              <div className={reportInfo.concentration.star > 1 ? 'star light' : 'star'} />
              <div className={reportInfo.concentration.star > 2 ? 'star light' : 'star'} />
              <div className={reportInfo.concentration.star > 3 ? 'star light' : 'star'} />
              <div className={reportInfo.concentration.star > 4 ? 'star light' : 'star'} />
            </div>
          </div>
          <div className="item-title evaluate">
            老师评价
            <p className="item-content">{reportInfo.concentration.evaluate}</p>
          </div>
          <div className="item-title advise">
            小建议
            <p className="item-content">{reportInfo.concentration.advise}</p>
          </div>
        </div>
        <div className="score-item memory long">
          <div className="item-header">
            <div className="header-title">{reportInfo.memory.type}</div>
          </div>
          <div className="item-title evaluate">
            老师评价
            <p className="item-content">{reportInfo.memory.evaluate}</p>
          </div>
          <div className="item-title advise">
            小建议
            <p className="item-content">{reportInfo.memory.advise}</p>
          </div>
        </div>
        <div className="score-item willpower">
          <div className="item-header">
            <div className="header-title">毅力分析</div>
            <div className="star-box">
              <div className="star light" />
              <div className={reportInfo.willpower.star > 1 ? 'star light' : 'star'} />
              <div className={reportInfo.willpower.star > 2 ? 'star light' : 'star'} />
              <div className={reportInfo.willpower.star > 3 ? 'star light' : 'star'} />
              <div className={reportInfo.willpower.star > 4 ? 'star light' : 'star'} />
            </div>
          </div>
          <div className="item-title evaluate">
            老师评价
            <p className="item-content">{reportInfo.willpower.evaluate}</p>
          </div>
          <div className="item-title advise">
            小建议
            <p className="item-content">{reportInfo.willpower.advise}</p>
          </div>
        </div>
        <div className="score-item thinking">
          <div className="item-header">
            <div className="header-title">思维能力分析</div>
            <div className="star-box">
              <div className="star light" />
              <div className={reportInfo.thinking.star > 1 ? 'star light' : 'star'} />
              <div className={reportInfo.thinking.star > 2 ? 'star light' : 'star'} />
              <div className={reportInfo.thinking.star > 3 ? 'star light' : 'star'} />
              <div className={reportInfo.thinking.star > 4 ? 'star light' : 'star'} />
            </div>
          </div>
          <div className="item-title evaluate">
            老师评价
            <p className="item-content">{reportInfo.thinking.evaluate}</p>
          </div>
          <div className="item-title advise">
            小建议
            <p className="item-content">{reportInfo.thinking.advise}</p>
          </div>
        </div>
      </div>
    );
  }
}

export { LearningAbilityReport };

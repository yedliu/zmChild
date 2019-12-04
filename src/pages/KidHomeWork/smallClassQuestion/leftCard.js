import React from 'react';
import './leftcard.scss';
import { costTimeObj } from 'utils/helpfunc';
import dayjs from 'dayjs';

class LeftCard extends React.PureComponent {
  componentDidMount() {
    this.drawCircle();
  }

  componentWillReceiveProps(nextprops) {
    const { totalScore, stuGetScore } = nextprops;
    const getScore = parseInt(stuGetScore || 0);
    const full_score = parseInt(totalScore);
    if (getScore && full_score) {
      setTimeout(this.drawCanvas, 1000);
    }
  }

	drawCircle = () => {
	  const canvas = this.refs.score_canvas;
	  if (!canvas) {
	    return false;
	  }
	  const ctx = canvas.getContext('2d');
	  ctx.beginPath();
	  ctx.arc(64, 64, 54, 0, Math.PI * 2, true);
	  ctx.lineWidth = 8;
	  ctx.strokeStyle = '#F2EADB';
	  ctx.stroke();
	  ctx.closePath();
	};

	drawCanvas = () => {
	  const canvas = this.refs.score_canvas;
	  if (!canvas) {
	    return false;
	  }
	  const getScore = this.props.stuGetScore;
	  const full_score = this.props.totalScore;
	  const rate = parseInt(getScore) / parseInt(full_score);
	  const value = rate * Math.PI * 2;
	  const endColor = `rgb(${255 - parseInt(rate * 15)},${196 - parseInt(rate * 110)},${86 - parseInt(rate * 7)})`;
	  let angle = value - Math.PI / 2;
	  angle = value > 0 ? Math.max(Math.PI / 360 - Math.PI / 2, angle) : -1 * Math.PI / 2;
	  const ctx = canvas.getContext('2d');

	  ctx.beginPath();
	  ctx.arc(64, 64, 54, -0.5 * Math.PI, angle, false);
	  const grd = ctx.createLinearGradient(0, 0, 170, 0);
	  grd.addColorStop('0', 'rgb(255,196,86)');
	  grd.addColorStop('1', endColor);
	  ctx.strokeStyle = grd;
	  ctx.lineWidth = 8;
	  ctx.lineCap = 'round';
	  ctx.stroke();
	  ctx.closePath();
	  if (value > 0) {
	    ctx.beginPath();
	    ctx.arc(64, 10, 2, 0, Math.PI * 2);
	    ctx.fillStyle = '#ffffff';
	    ctx.fill();
	    ctx.closePath();
	  }
	}

	render() {
	  const { wrongAmount, rightAmount, partRightAmount, stuGetScore, costTime, submitTime, teaTotalComment } = this.props;
	  const costtime = costTimeObj(costTime);
	  console.log('name', name);
	  return (
  <div id="leftCard">
    <div className="task-info">
      <div className="innerleft">
        <div className="progress">
          <canvas className="score_canvas" ref="score_canvas" width="128" height="128" />
          <div className="score-number">
            <span className="number">{stuGetScore}</span>
分
          </div>
        </div>
        <div className="distribution">
          <div className="score-item">
            <span>{rightAmount || 0}</span>
            <br />
								正确
          </div>
          <div className="score-item">
            <span>{wrongAmount}</span>
            <br />
								错误
          </div>
          <div className="score-item">
            <span>{partRightAmount}</span>
            <br />
								部分正确
          </div>
        </div>
        <div className="info">
          <div className="info-item">
            <span>用时：</span>
            {`${costtime.h}小时${costtime.m}分钟${costtime.s}秒`}
          </div>
          <div className="info-item">
            <span>提交时间：</span>
            {dayjs(submitTime).format('YYYY-MM-DD HH:MM:ss')}
          </div>
          <div className="info-item">
            <span>教师评语：</span>
            <br />
            <div style={{ overflow: 'hidden', wordBreak: 'break-all' }}>
              {teaTotalComment || '暂无评语'}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
	  );
	}
}

export default LeftCard;

import dayjs from 'dayjs';

export const dateItems = {
  0: '周日',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
};

export const stateList = {
  1: '待上课',
  2: '上课中',
  3: '已上课',
  4: '宝贝缺勤',
  5: '课程取消',
};

export const typeState = {
  1: '测评课',
  2: '正式课',
  3: '调试课',
};

export const homeworkState = {
  30: '练习报告',
  31: '练习报告',
  32: '做练习',
  33: '做练习 ',
  34: '做练习',
};

export const homeState = [30, 31, 32, 33, 34];

export const yuqiState = [33, 34];

export const yuqiList = {
  33: '将逾期',
  34: '已逾期',
};

export function throttle(func, waitTime) {
  let context; let args; let
    previous = 0;
  return function () {
    const now = +new Date(); context = this; args = arguments;
    if (now - previous > waitTime) {
      func.apply(context, args);
      previous = now;
    }
  };
}

export const starArr = [1, 2, 3, 4, 5];

export function reduceDimension(arr) {
  return Array.prototype.concat.apply([], arr);
}

export const centerStyle = {
  display: 'flex',
  alignItems: 'center',
}

export const triangleStyle= {
  display: 'inline-block',
  width: 0,
  height: 0,
  border: '7px solid transparent',
  verticalAlign: 'top',
  borderTop: '9px solid #fff',
  marginLeft: '8px',
  marginTop: '8px',
  borderRadius: '4px',
}

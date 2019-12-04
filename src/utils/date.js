/*eslint-disable */
export function formatDate (datetime, format) {
    if (!format) format = 'YYYY-MM-DD HH:mm';
    if (typeof(datetime) == 'string') {
        datetime = datetime.replace(/\-/g, '/');
        datetime = new Date(datetime);
    } else if (typeof(datetime) == 'number') {
        datetime = new Date(datetime);
    } else if (!(datetime instanceof Date)) {
        datetime = new Date();
    }

    var week = ['日', '一', '二', '三', '四', '五', '六'];
    return format.replace(/YYYY|YY|MM|DD|HH|hh|mm|SS|ss|week/g, function(key) {
        switch (key) {
            case 'YYYY': return datetime.getFullYear();
            case 'YY': return (datetime.getFullYear() + '').slice(2);
            case 'MM': return datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
            case 'DD': return datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate();
            case 'HH':
            case 'hh': return datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours();
            case 'mm': return datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes();
            case 'SS':
            case 'ss': return datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds();
            case 'week': return week[datetime.getDay()];
        }
    });
}
export const getDateCount = (year, month) => new Date(year, month, 0).getDate();

export const getDateIsWhichDay = (...rest) => {
    let res = '';
    if (typeof rest[0] === 'object') {
        res = rest[0].getDay();
    } else {
        res = new Date(rest[0], rest[1], rest[2]).getDay();
    }
    return res;
};

export const getTargetMonth = (nowYear, nowMonth, type) => {
    const res = {
      year: nowYear,
      month: nowMonth,
    };
    if (type === 'prev') {
      if (nowMonth === 1) {
        res.year = nowYear - 1;
        res.month = 12;
      } else {
        res.month = nowMonth - 1;
      }
    } else if (type === 'next') {
      if (nowMonth === 12) {
        res.year = nowYear + 1;
        res.month = 1;
      } else {
        res.month = nowMonth + 1;
      }
    }
    return res;
  };
  export const getArr = (num) => {
    // console.log(num, 'number --223');
    return num === 0 ? [] : new Array(num).fill('');
  };
  export const ifLessThan = (timeStr) => {
    if (typeof (timeStr) === 'string') {
      timeStr = Number(timeStr);
    }
    return timeStr > 9 ? `${timeStr}` : `0${timeStr}`;
  };
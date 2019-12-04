import Katex from 'katex';
import { AppLocalStorage } from 'utils/localStorage';
import { Config } from 'utils/config';

const unescape = (str, dom) => {
  dom.innerHTML = str;
  return dom.innerText || dom.textContent;
};
const fromCodePoint = (str) => {
  return String.fromCodePoint(str);
};

export const characterChange = (str) => {
  let elem = document.createElement('div');
  const str1 = unescape((str || '').replace(/&nbsp;/g, ' '), elem);
  const str2 = str1.replace(/&#(\d+);/g, (e, $1) => fromCodePoint($1));
  elem = null;
  return str2;
};

// 添加图片前缀
export const addImgSrc = (htmlStr, type) => {
  let showImgSrc = htmlStr;
  if (typeof htmlStr !== 'string') return '';
  if (type === 'stuAnswer') {
    showImgSrc = htmlStr.replace(/src="(https:)?(\/\/oss-cn-hangzhou\.aliyuncs\.com\/zm-chat-interview)*/g, 'src="//oss-cn-hangzhou.aliyuncs.com/zm-chat-interview')
      .replace(/background: url\('/g, 'background: url(\'//oss-cn-hangzhou.aliyuncs.com/zm-chat-interview');
  } else {
    showImgSrc = htmlStr.replace(/src="/g, `src="${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`)
      .replace(/background: url\('/g, `background: url('${Config.tkurl}/api/jyeoo/proxyImage?urlImage=`);
  }
  return showImgSrc;
  // return htmlStr;
};

// 获取时间的时分秒对象
/**
 * @param {*} time // 参数为时间的毫秒数
 */
export const costTimeObj = (time = 0) => {
  const timeobj = {
    h: Math.floor(time / (60 * 60 * 1000)),
    m: Math.floor(time / 60000) % 60,
    s: Math.floor(time / 1000) % 60,
  };
  return timeobj;
};

const regbackList = [
  /zmcolor="(#[^"]{3,6})"/g,
  /zmalign="([a-zA-Z]+)"/g,
  /<zmindent><\/zmindent>/g,
  /<zmblank[^>]*>[^<zm]*<\/zmblank>/g,
  /<zmsubline[^>]*>[^<zm]*<\/zmsubline>/g,
];

const backfromZmStandPrev = (str) => {
  if (!str) return '';
  const newStr = str.replace(regbackList[0], 'style="color: $1;"')
    .replace(regbackList[1], 'style="text-align: $1;"')
    .replace(regbackList[2], '<zmindent></zmindent>')
    .replace(regbackList[3], '<zmblank></zmblank>')
    .replace(regbackList[4], '<zmsubline></zmsubline>')
    .replace(/<zmsubline><zmsubline><\/zmsubline><\/zmsubline>/g, '<zmsubline></zmsubline>')
    .replace(/<p>(<br\s?\/?>)<\/p>$/, '')
    .replace(/line-height:\s?\w+?%?;/g, '')
    .replace(/font-size:\s?\w+?%?;/g, '')
    .replace(/<br\s?\/?>$/, '');
  return newStr;
};

export const renderToKatex = (str) => {
  if (!str) return '';
  const str1 = backfromZmStandPrev(str).replace(/<zmlatex(\scontenteditable="false")?>([^<zm]*(<zmlatex>[^</zmlatex>]+<\/zmlatex>)[^<zm]*)<\/zmlatex>/g, (e, $1, $2) => `<zmlatex>${$2.replace(/<zmlatex(\scontenteditable="false")?>([^</zmlatex>]+)<\/zmlatex>/g, (res, i$1, i$2) => i$2)}</zmlatex>`);
  const str2 = str1.replace(/(<zmlatex(\scontenteditable="false")?>)|(<\/zmlatex>)/g, '\\$').replace(/\\\$([^\$]+)\\\$/g, (ev, $1) => {
    let formulaPaste = '';
    try {
      formulaPaste = Katex.renderToString(characterChange($1).replace(/(\u007e|\u301c)/g, (e, i$1) => `\\text{${i$1}}`).replace(/\s?([\u4e00-\u9fa5]+)/g, (e, y$1) => `\\text{${y$1}}`));
    } catch (err) {
      console.warn(`renderToKatex error：${err}`);
      formulaPaste = $1;
    }
    return formulaPaste;
  });
  return str2;
};

export const makeAwnserStr = (type) => {
  if (type === 1) return '正确';
  if (type === 2) return '错误';
  if (type === 3) return '部分正确';
  return '尚未批改';
};

export const letterOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// 匹配过滤 html 格式
export const filterHtmlForm = (value) => {
  let res = '';
  if (isString(value)) {
    res = value.replace(/<(?!img)[^>]*>|&nbsp;|\s/g, '');
  } else {
    res = value;
  }
  return res;
};


// ajax上传文件或图片
export const AjaxUpload = (url, files, cb) => {
  const form = new FormData();
  console.dir(form);

  if (files) {
    form.append('file', files['0']);
  }

  const xhr = new XMLHttpRequest();

  xhr.open('post', `${Config.tkurl + url}?access_token=${AppLocalStorage.getTocken().accessToken}`, true); // 设置提交方式，url，异步提交
  // xhr.setRequestHeader('Accept', 'application/json; charset=UTF-8');
  // xhr.setRequestHeader('Content-type', 'multipart/form-data'); // 设置请求头
  xhr.setRequestHeader('mobile', `${AppLocalStorage.getMobile()}`);
  // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('password', `${AppLocalStorage.getPassWord()}`);

  xhr.send(form);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // console.log(xhr.responseText);
        let data = xhr.responseText;
        data = JSON.parse(data);
        console.log(data);
        if (data.code.toString() === '1') {
          cb(data);
        } else {
          console.warn('Response code 0, please try again!');
        }
      }
    } else {
      console.warn('Request or Response err');
    }
  };
};

// 过滤当前是否为个位数，个位数则加上0到前面
export const ifLessThan = (timeStr) => {
  if (typeof (timeStr) === 'string') {
    timeStr = Number(timeStr);
  }
  return timeStr > 9 ? `${timeStr}` : `0${timeStr}`;
};

/**
 * number => roma
 */
function convert(num) {
  const newArr = [];
  let newStr;
  // 先把数字转化为相应的罗马字母
  while (num > 0) {
    if (num - 1000 >= 0) {
      newArr.push('M');
      num -= 1000;
    } else if (num - 500 >= 0) {
      newArr.push('D');
      num -= 500;
    } else if (num - 100 >= 0) {
      newArr.push('C');
      num -= 100;
    } else if (num - 50 >= 0) {
      newArr.push('L');
      num -= 50;
    } else if (num - 10 >= 0) {
      newArr.push('X');
      num -= 10;
    } else if (num - 5 >= 0) {
      newArr.push('V');
      num -= 5;
    } else if (num - 1 >= 0) {
      newArr.push('I');
      num -= 1;
    }
  }
  newStr = newArr.join('');
  // 将4和9的情况进行替换
  newStr = newStr.replace(/VI{4}|LX{4}|DC{4}|I{4}|X{4}|C{4}/g, (match) => {
    switch (match) {
      case 'VIIII':
        return 'IX';
      case 'LXXXX':
        return 'XC';
      case 'DCCCC':
        return 'CM';
      case 'IIII':
        return 'IV';
      case 'XXXX':
        return 'XL';
      case 'CCCC':
        return 'CD';
      default:
        break;
    }
  });
  return newStr;
}
export const numberToRome = (number) => {
  if (Number(number) >= 0 && Number(number) <= 30) {
    return convert(number - 1);
  }
  return number;
};

export function isNumber(number) {
  return typeof number === 'number';
}

export function isArray(arr) {
  return Array.isArray(arr);
}

export function isFunction(obj) {
  return typeof obj === 'function';
}

export function isObject(obj) {
  return (typeof obj === 'object' && !(obj instanceof Array));
}

export function isString(str) {
  return typeof str === 'string';
}

export const numberToLetter = (number) => {
  if (isNumber(number) && number >= 0) {
    return letterOptions[number % 26];
  }
  return number;
};

// 上传图片后将编辑器内的base64图片保存时替换为在线地址
export const changeImgSrc = (html = '', url = '', remove = false) => {
  // console.log(html.substr(0, 30), url, 4);
  let newHtml = '';
  if (typeof html !== 'string') return '';
  if (remove) {
    newHtml = String(html).replace(/src="((https?):)?(\/\/oss-cn-hangzhou\.aliyuncs\.com\/zm-chat-interview)*/g, 'src="');
    // newHtml = html;
  } else {
    newHtml = String(html).replace(/(src="data:.+")/g, `src="${url}" `);
  }
  // console.log(html, 5);
  return newHtml;
};

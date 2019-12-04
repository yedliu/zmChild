(function () {
  // 设置用户标示
  let accId;
  const __accId = `${+new Date()}${Math.random()}`;
  if (window && window.hasOwnProperty('localStorage') && window.localStorage) {
    accId = localStorage.getItem('__accId__') || __accId;
    (accId == __accId) && localStorage.setItem('__accId__', accId);
  } else {
    accId = (document.cookie.match(/__accId__=([^;]*);?/) || [])[1] || __accId;
    accId == __accId && (document.cookie = `__accId__=${escape(accId)};expires=${(new Date('2580/01/01')).toGMTString()}`);
  }
  const userInfo = JSON.parse(localStorage.getItem('zm-chat-redux-userInfo'));
  const userId = (userInfo && userInfo.userId) || '';
  const appName = localStorage.getItem('appName');
  let dev = '';
  const { host } = window.location;
  switch (host) {
    case 'chat.zmlearn.com':
      dev = 'production';
      break;
    case 'chat.uat.zmops.cc':
      dev = 'uat';
      break;
    case 'x-chat-test.zmlearn.com':
      dev = 'test';
      break;
    default:
      // 本地开发临时切换环境，直接在此return 对应的参数 (prod || uat || test || dev)
      dev = 'development';
  }
  window.__acc2__ = function (obj) {
    const analyticsDomain = `${location.protocol || ''}//acc.zmlearn.com`;
    if (typeof obj !== 'object') return;
    obj.accId = obj.accId || accId; // 追加访问标示
    obj.userId = userId;
    obj.appName = appName;
    obj.userAgent = navigator.userAgent || '';
    obj.time = obj.time || (new Date()).getTime();
    obj.userId = userId;
    obj.userInfo = userInfo;
    obj.dev = dev;
    const req = new XMLHttpRequest();
    req.open('POST', `${analyticsDomain}/acc`, true);
    req.timeout = 20000;
    req.onload = () => {
    };
    req.onerror = () => {
    };
    req.ontimeout = (err) => {
      console.log(`监控发送失败日志：   ${JSON.stringify(err.message)}`);
    };
    req.send(JSON.stringify({ logInfo: obj }));
  };
}());

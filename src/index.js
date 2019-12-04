/**
 * 程序主入口
 * * */
// import './polyfill'; // 兼容低版本浏览器
import dva from 'dva';
import createLoading from 'dva-loading';
import './index.scss';
// import { AppLocalStorage } from 'utils/localStorage';
import { initZmAcc } from 'utils/helpfunc';
import global from './models/global';
import RouterConfig from './router';
import './acc';
import { createBrowserHistory as createHistory } from 'history';
import initRaven from 'utils/sentry';
// import Vconsole from './vconsole.min';
import './index.scss';

const dev = localStorage.getItem('devType') || process.env.BUILD_TYPE;
if (initRaven && dev && dev !== 'test') {
  initRaven();
}

const app = dva({
  history: createHistory(),
  onError(e) {
    console.log('onError', e);
  },
});


// if (dev === 'test' && AppLocalStorage.getAppName() === 'KidsPad') {
//   const vConsole = new Vconsole();
// }
// app.use(vConsole)
// 埋点配置
const buryTimer = setInterval(() => {
  if (initZmAcc.inited) {
    clearInterval(buryTimer);
    return;
  }
  initZmAcc.call(null,false)
},10000); // 埋点配置

app.use(createLoading());

app.model(global);

app.router(RouterConfig);

app.start('#app');
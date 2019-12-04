import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
import { isWin } from 'utils/helpfunc.js';
import { isSupportNewLoginWin } from 'utils/nativebridge.js';
import { menuGlobal } from './utils/routeMenu';
import Header from './components/Hedaer';
import mp3 from './statics/common/mp3/voice.mp3';
import App from './models/app';
import AnimateRouter from './components/RouterAnmiate';
import './components/RouterAnmiate/animate.scss';

function RouterConfig({ history, app }) {
  const isShowWin = isWin() && isSupportNewLoginWin();
  return (
    <App>
      {isShowWin && <Header />}
      <audio src={mp3} style={{ display: 'none' }} id="audio_click" />
      <Router history={history}>
        <AnimateRouter isShowWin={isShowWin}>
          {
            menuGlobal.map(({ path, ...dynamics }, index) => (
              <Route
                key={index}
                path={path}
                exact
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          }
          <Redirect from="/" to="/kid" />
        </AnimateRouter>
      </Router>
    </App>
  );
}

export default RouterConfig;

const u = navigator.userAgent;
const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端

function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) { return callback(window.WebViewJavascriptBridge); }
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
  window.WVJBCallbacks = [callback];
  const WVJBI_FRAME = document.createElement('iframe');
  WVJBI_FRAME.style.display = 'none';
  WVJBI_FRAME.src = 'https://__bridge_loaded__';
  document.documentElement.appendChild(WVJBI_FRAME);
  setTimeout(() => {
    document.documentElement.removeChild(WVJBI_FRAME);
  }, 0);
}

export default {
  callhandler(name, data, callback) {
    if (!isAndroid) {
      console.log('iOS');
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler(name, data, callback);
      });
      return;
    }
    if (window.WebViewJavascriptBridge) {
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler(name, data, callback);
      });
    } else {
      document.addEventListener(
        'WebViewJavascriptBridgeReady',
        () => {
          setupWebViewJavascriptBridge((bridge) => {
            bridge.callHandler(name, data, callback);
          });
        },
        false,
      );
    }
  },
  registerHandler(name, callback) {
    setupWebViewJavascriptBridge((bridge) => {
      bridge.registerHandler(name, (data, responseCallback) => {
        callback(data, responseCallback);
      });
    });
  },
};

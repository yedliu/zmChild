import React, { memo } from 'react'
import ZmModal from '../zmModal/index'
import {
  getClientVersion,
  blockWin,
  closeHome,
  isMacPlatform
} from '../../utils/nativebridge'
import { isWeb } from 'zmNativeBridge'
import './style.scss'

function CheckWebgl(props) {
  const version = getClientVersion()

  const handleWebgleUpgrand = url => {
    try {
      const { remote } = window.require('electron')
      setTimeout(() => {
        remote.shell.openExternal(url)
        blockWin(false)
        localStorage.removeItem('NavIndex')
        localStorage.removeItem('subjectCode')
        localStorage.removeItem('remember-login-password')
        // 移除用户屏幕分辨率的数据统计便是
        localStorage.removeItem('screenAcc')
        closeHome()
      }, 1000)
    } catch (e) {
      return ''
    }
  }

  let {
    forceUpgrade,
    needUpgrade,
    promptTextList,
    macdownloadUrl,
    downloadUrl,
    targetVersion,
    mactargetVersion
  } = props.updateInfo
  if (isMacPlatform()) {
    targetVersion = mactargetVersion
    downloadUrl = macdownloadUrl
  }

  return (
    <ZmModal visible={props.visible}>
      <div id="checkWebgl">
        <div className="ellipse" />
        {forceUpgrade && version !== targetVersion ? null : (
          <div className="check-close" onClick={props.onClose} />
        )}
        <div className="title">提示</div>
        <div className="checkoutcenter">
          <p style={{ alignSelf: 'flex-start' }}>系统检测出:</p>
          <div
            className="check"
            dangerouslySetInnerHTML={{ __html: promptTextList }}
          ></div>
          <div
            style={{
              display: 'flex',
              width: 400,
              marginTop: 10,
              justifyContent: 'space-around'
            }}
          >
            {isWeb() && needUpgrade ? (
              <>
                <a className="gonow" href={downloadUrl}>
                  下载Windows版
                </a>
                <a className="gonow" href={macdownloadUrl}>
                  下载Mac版
                </a>
              </>
            ) : needUpgrade ? (
              <span
                className="gonow"
                onClick={() => handleWebgleUpgrand(downloadUrl)}
              >
                下载最新版本
              </span>
            ) : null}
            {version === targetVersion && (
              <span
                className="gonow"
                onClick={() =>
                  handleWebgleUpgrand(
                    'http://file1.updrv.com/soft/dtl7/7.1.21.68/drivethelife7_setup.exe'
                  )
                }
              >
                下载驱动
              </span>
            )}
          </div>
          {needUpgrade && (
            <div className="tip">
              <span>下载完成新客户端后，请关闭老客户端后再点击安装</span>
            </div>
          )}
        </div>
      </div>
    </ZmModal>
  )
}

export default memo(CheckWebgl)

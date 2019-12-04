import { isKidsClient } from 'utils/nativebridge';
let AgoraRtcEngine = null;
let rtcEngine = null;
if(isKidsClient() && window.require) {
  AgoraRtcEngine = window.require('agora-electron-sdk').default;
  rtcEngine = new AgoraRtcEngine();
  rtcEngine.initialize('0368433925644e9b83eeff9fff26b61e');
}

export function getDeviceInfo() {
  const lastDeviceInfo = JSON.parse(window.localStorage.getItem('lastDeviceInfo') || '{}');
  let voices = rtcEngine.getAudioRecordingDevices() || [];
  voices = voices.map(v => ({ id: v.deviceid, name: v.devicename }));
  let videos = rtcEngine.getVideoDevices() || [];
  videos = videos.map(v => ({ id: v.deviceid, name: v.devicename }));
  let speakers = rtcEngine.getAudioPlaybackDevices() || [];
  speakers = speakers.map(v => ({ id: v.deviceid, name: v.devicename }));
  return Promise.resolve({
    curvoice: lastDeviceInfo.curvoice || voices[0] || {},
    curvideo: lastDeviceInfo.curvideo || videos[0] || {},
    curspeaker: lastDeviceInfo.curspeaker || speakers[0] || {}
  });
}
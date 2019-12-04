export const tipList = [
  '1、请确保摄像头插入了正确的插孔中，并处于开启状态；<br/>2、若杀毒软件（如360安全卫士、百度卫士等）弹出提示信息，请选择允许；<br/>3、确认系统是否禁用了摄像头或被其他程序占用；<br/>4、如果看不到，请切换另一个摄像头再试试<br/>',
  '1、请确保耳机插入了正确的插孔中，并处于开启状态；<br/>2、若杀毒软件（如360安全卫士、百度卫士等）弹出提示信息，请选择允许；<br/>3、确认是否设置了系统静音，或者音量设置过小；<br/>4、如果听不到，请切换另一个扬声器再试试；<br/>',
  '未检测到您孩子的声音<br/>1、请确保麦克风插入了正确的插孔中；<br/>2、若杀毒软件（如360安全卫士、百度卫士等）弹出提示信息，请选择允许；<br/>3、确认是否设置了系统静音，或者音量设置过小；<br/>4、如果听不到，请切换另一个麦克风再试试',
]

export const testTip = [
  '能否清晰看见自己？将摄像头对准自己，保持自己在画面内',
  '点击左边音量按钮，能不能听到声音',
  '点击录音按钮说出以下内容',
  '有问题可以联系班主任老师协助解决哦',
]

export function stopStream(stream) {
  if (!stream) {
    return false
  }
  // console.log(stream);
  if (stream.stop) {
    stream.stop()
  } else {
    const tracks = stream.getTracks()
    // console.log(tracks);
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].stop()
    }
  }
}

const hostConfig = {} // 接口配置对象

// 通过命令来决定环境resetConfig
const setConfig = (window.resetConfig = type => {
  // console.log('config host', type, hostConfig);
  if (type === 'prod') {
    hostConfig.recordPlayerUrl = '//recordplayer.zhangmenkid.com'
    hostConfig.apiurl = 'https://chat.zmlearn.com'
    hostConfig.phaseTest =
      'https://zmkids-h5.zmpeiyou.com/kids-pad/#/stage-evaluation/list/'
    hostConfig.fsurl = 'https://fs.zmlearn.com'
    hostConfig.trurl = 'https://tr.zmlearn.com'
    hostConfig.clientId = '18bd1e36-45e1-45a7-8102-7c6af21a28f2'
    hostConfig.clientSecret = 'SOKnh1IO'
    hostConfig.tkurl = 'https://homework.zmlearn.com'
    hostConfig.frameurl = 'https://chat.zmlearn.com'
    hostConfig.officeurl = 'https://www.zhangmen.com'
    hostConfig.ppturl = 'https://image.zmlearn.com/'
    hostConfig.appapiurl = 'https://appapi.zmlearn.com'
    hostConfig.uploaddoc = 'https://chat-doc.zmlearn.com'
    hostConfig.docurl = 'https://image.zmlearn.com'
    hostConfig.trlink = 'https://tr.zmlearn.com'
    hostConfig.resourceurl =
      'https://zm-chat-lessons.oss-cn-hangzhou.aliyuncs.com'
    hostConfig.pluginurl = 'https://chat.zmlearn.com'
    hostConfig.h5doctree =
      'https://zm-chat-slides.oss-cn-hangzhou.aliyuncs.com/html5Course/h5lessons.json'
    hostConfig.speckAnalysisPath =
      'https://chat.zmlearn.com/api/lessonSpeakInfo/update'
    hostConfig.speckDurationPath =
      'https://chat.zmlearn.com/api/lessonSpeakInfo/updateSpeakDuration'
    hostConfig.trlink_qb = 'https://qb.zmlearn.com'
    hostConfig.pcconfig =
      'https://zm-client.oss-cn-hangzhou.aliyuncs.com/pc/zmFuncConfig.json'
    hostConfig.zmRtcApiUrl = 'https://web-webrtc.zmlearn.com/'
    hostConfig.zmlDocContentUrl = 'https://zml.zmlearn.com/'
    hostConfig.zmOtherOriginLink =
      'https://h.zm1v1.cn/mobile/recommend3.0/Client'
    hostConfig.zmGrowthValueUrl = 'https://www.zhangmen.com/growth-frame'
    hostConfig.zmClientHw =
      'https://chat-gateway.zmlearn.com/zhangmen-client-hw'
    hostConfig.zmClientQb =
      'https://chat-gateway.zmlearn.com/zhangmen-client-qb'
    hostConfig.classroomurl =
      'https://chat.zmlearn.com/zmlearnclient/classroom/'
    hostConfig.zmhub =
      'https://chat.zmlearn.com/gateway/zhangmen-client-hub-chat'
    hostConfig.zmCourseMessage =
      'https://chat.zmlearn.com/gateway/zmc-personal-center'
    hostConfig.upGrade = 'https://chat.zmlearn.com/gateway/zhangmen-client-wo'
    hostConfig.zmcCourseWare =
      'https://chat.zmlearn.com/gateway/zmc-courseware-together'
    hostConfig.baseIpUrl = ''
    hostConfig.bucourseware =
      'https://chat.zmlearn.com/gateway/zmc-courseware-kid'
    hostConfig.zmg = 'https://hdkj.zmlearn.com/zm_course_web/'
    hostConfig.zhangmenKidsUrl = 'https://www.zhangmenkid.com/'
    hostConfig.game = 'https://hdkj.zmlearn.com/StudyPartner'
    hostConfig.makeuplesson = ''
    hostConfig.partnerUrl = ''
    hostConfig.makeuplesson = ''
    hostConfig.notice = 'https://zmkids-h5.zmpeiyou.com/kids-pad/ai-rules.html'
    hostConfig.upGradeUrl = 'https://app-gateway.zmlearn.com'
    hostConfig.studylandUrl = '//app-gateway.zmlearn.com'
  } else if (type === 'uat') {
    hostConfig.recordPlayerUrl = '//recordplayer.uat.zmops.cc'
    hostConfig.apiurl = 'https://chat.uat.zmops.cc'
    hostConfig.phaseTest =
      'http://zmkids-h5.uat.zmops.cc/kids-pad/#/stage-evaluation/list/'
    hostConfig.fsurl = 'https://fs.uat.zmops.cc'
    hostConfig.trurl = 'https://tr.uat.zmops.cc'
    hostConfig.clientId = '18bd1e36-45e1-45a7-8102-7c6af21a28f2'
    hostConfig.clientSecret = 'SOKnh1IO'
    hostConfig.tkurl = 'https://homework.uat.zmops.cc'
    hostConfig.frameurl = 'https://chat.uat.zmops.cc'
    hostConfig.officeurl = 'https://www.zhangmen.com'
    hostConfig.ppturl = 'https://image.zmlearn.com/'
    hostConfig.appapiurl = 'https://appapi.uat.zmops.cc'
    hostConfig.uploaddoc = 'https://chat-doc.uat.zmops.cc'
    hostConfig.docurl = 'https://image.zmlearn.com'
    hostConfig.trlink = 'https://tr.uat.zmops.cc'
    hostConfig.resourceurl =
      'https://zm-chat-lessons.oss-cn-hangzhou.aliyuncs.com'
    hostConfig.pluginurl = 'https://chat.uat.zmops.cc'
    hostConfig.h5doctree =
      'https://zm-chat-slides.oss-cn-hangzhou.aliyuncs.com/html5Course/h5lessons.json'
    hostConfig.speckAnalysisPath =
      'https://chat.uat.zmops.cc/api/lessonSpeakInfo/update'
    hostConfig.speckDurationPath =
      'https://chat.uat.zmops.cc/api/lessonSpeakInfo/updateSpeakDuration'
    hostConfig.trlink_qb = 'https://qb.uat.zmops.cc'
    hostConfig.pcconfig =
      'https://zm-client.oss-cn-hangzhou.aliyuncs.com/pc/zmFuncConfig.json'
    hostConfig.zmRtcApiUrl = 'https://web-webrtc.zmlearn.com/'
    hostConfig.zmlDocContentUrl = 'https://zml-test.zmlearn.com/'
    hostConfig.zmOtherOriginLink =
      'https://h.zm1v1.cn/mobile/recommend3.0/Client'
    hostConfig.zmClientHw =
      'https://client-gateway.uat.zmops.cc/zhangmen-client-hw'
    hostConfig.zmGrowthValueUrl = 'https://www.uat.zmops.cc/growth-frame'
    hostConfig.zmClientQb =
      'https://client-gateway.uat.zmops.cc/zhangmen-client-qb'
    hostConfig.classroomurl =
      'https://chat.uat.zmops.cc/zmlearnclient/classroom/'
    hostConfig.zmhub =
      'https://chat.uat.zmops.cc/gateway/zhangmen-client-hub-chat'
    hostConfig.zmCourseMessage =
      'https://chat.uat.zmops.cc/gateway/zmc-personal-center'
    hostConfig.upGrade = 'https://chat.uat.zmops.cc/gateway/zhangmen-client-wo'
    hostConfig.zmcCourseWare =
      'https://chat.uat.zmops.cc/gateway/zmc-courseware-together'
    hostConfig.baseIpUrl = ''
    hostConfig.bucourseware =
      'https://chat.uat.zmops.cc/gateway/zmc-courseware-kid'
    hostConfig.zmg = 'https://hdkj.uat.zmops.cc/zm_course_web/'
    hostConfig.zhangmenKidsUrl = 'https://wwwzhangmenkid.uat.zmops.cc/'
    hostConfig.game = 'https://hdkj.uat.zmops.cc/StudyPartner'
    hostConfig.partnerUrl = ''
    hostConfig.makeuplesson = ''
    hostConfig.notice = 'https://zmkids-h5.uat.zmops.cc/kids-pad/ai-rules.html'
    hostConfig.upGradeUrl = '//app-gateway.uat.zmops.cc'
    hostConfig.studylandUrl = '//app-gateway.uat.zmops.cc'
  } else if (type === 'test') {
    hostConfig.recordPlayerUrl = '//recordplayer-test.zhangmenkid.com'
    hostConfig.apiurl = 'https://x-chat-test.zmlearn.com'
    hostConfig.phaseTest = 'http://10.81.160.188/#/stage-evaluation/list/'
    // hostConfig.apiurl = 'http://10.81.160.188:8080';
    hostConfig.fsurl = 'https://fs-test.zmlearn.com'
    hostConfig.trurl = 'https://tr-test.zmlearn.com'
    hostConfig.clientId = '18bd1e36-45e1-45a7-8102-7c6af21a28f2'
    hostConfig.clientSecret = 'SOKnh1IO'
    hostConfig.tkurl = 'https://homework-test.zmlearn.com'
    hostConfig.frameurl = 'https://x-chat-test.zmlearn.com'
    // hostConfig.frameurl = 'http://localhost:3000';
    hostConfig.officeurl = 'https://www.zhangmen.com'
    hostConfig.ppturl = 'https://image.zmlearn.com/'
    hostConfig.appapiurl = 'https://appapi-test.zmlearn.com'
    hostConfig.uploaddoc = 'https://x-chat-doc-test.zmlearn.com'
    hostConfig.docurl = 'https://image.zmlearn.com'
    hostConfig.resourceurl =
      'https://zm-chat-lessons.oss-cn-hangzhou.aliyuncs.com'
    hostConfig.trlink = 'https://tr-test.zmlearn.com'
    hostConfig.trlinkDev = 'https://tr-dev.zmlearn.com'
    hostConfig.pluginurl = 'https://x-chat-test.zmlearn.com'
    hostConfig.h5doctree =
      'https://zm-chat-slides.oss-cn-hangzhou.aliyuncs.com/html5Course/h5lessons.json'
    hostConfig.speckAnalysisPath =
      'https://x-chat-test.zmlearn.com/api/lessonSpeakInfo/update'
    hostConfig.speckDurationPath =
      'https://x-chat-test.zmlearn.com/api/lessonSpeakInfo/updateSpeakDuration'
    hostConfig.trlink_qb = 'https://qb-test.zmlearn.com'
    hostConfig.pcconfig =
      'https://zm-client.oss-cn-hangzhou.aliyuncs.com/pc/zmFuncConfig.json'
    hostConfig.zmRtcApiUrl = 'https://web-webrtc.zm1v1.com/'
    hostConfig.zmlDocContentUrl = 'https://zml-test.zmlearn.com/'
    hostConfig.zmOtherOriginLink =
      'http://wechat-test.zm1v1.com/mobile/recommend3.0/Client'
    hostConfig.zmClientHw =
      'https://test-chat-gateway.zmlearn.com/zhangmen-client-hw'
    hostConfig.zmGrowthValueUrl = 'https://v2-test.zm1v1.com/growth-frame'
    hostConfig.zmClientQb =
      'https://test-chat-gateway.zmlearn.com/zhangmen-client-qb'
    hostConfig.classroomurl =
      'https://x-chat-test.zmlearn.com/zmlearnclient/classroom/'
    hostConfig.zmhub =
      'https://x-chat-test.zmlearn.com/gateway/zhangmen-client-hub-chat'
    hostConfig.zmCourseMessage =
      'https://test-chat-gateway.zmlearn.com/zmc-personal-center'
    hostConfig.upGrade =
      'https://x-chat-test.zmlearn.com/gateway/zhangmen-client-wo'
    hostConfig.zmcCourseWare =
      'https://x-chat-test.zmlearn.com/gateway/zmc-courseware-together'
    hostConfig.baseIpUrl = ''
    hostConfig.bucourseware =
      'https://x-chat-test.zmlearn.com/gateway/zmc-courseware-kid'
    hostConfig.zmg = 'https://test.hdkj.zmlearn.com/zm_course_web/'
    hostConfig.zhangmenKidsUrl = 'https://www-test.zhangmenkid.com/'
    hostConfig.game = 'https://test.hdkj.zmlearn.com/StudyPartner_Preview'
    hostConfig.partnerUrl = ''
    hostConfig.makeuplesson = ''
    hostConfig.notice = 'https://kids-active.zmaxis.com/pad/ai-rules.html'
    hostConfig.upGradeUrl = '//app-gateway-test.zmlearn.com'
    hostConfig.studylandUrl = '//app-gateway-test.zmlearn.com'
  } else {
    hostConfig.recordPlayerUrl = '//recordplayer-test.zhangmenkid.com'
    hostConfig.apiurl = 'https://x-chat-test.zmlearn.com'
    hostConfig.phaseTest = 'http://10.81.160.188/#/stage-evaluation/list/'
    // hostConfig.apiurl = 'http://10.81.160.188:8080';
    hostConfig.fsurl = 'https://fs-test.zmlearn.com'
    hostConfig.trurl = 'https://tr-test.zmlearn.com'
    hostConfig.clientId = '18bd1e36-45e1-45a7-8102-7c6af21a28f2'
    hostConfig.clientSecret = 'SOKnh1IO'
    hostConfig.tkurl = 'https://homework-test.zmlearn.com'
    hostConfig.frameurl = 'https://x-chat-test.zmlearn.com'
    // hostConfig.frameurl = 'http://localhost:3000';
    hostConfig.officeurl = 'https://www.zhangmen.com'
    hostConfig.ppturl = 'https://image.zmlearn.com/'
    hostConfig.appapiurl = 'https://appapi-test.zmlearn.com'
    hostConfig.uploaddoc = 'https://x-chat-doc-test.zmlearn.com'
    hostConfig.docurl = 'https://image.zmlearn.com'
    hostConfig.resourceurl =
      'https://zm-chat-lessons.oss-cn-hangzhou.aliyuncs.com'
    hostConfig.trlink = 'https://tr-test.zmlearn.com'
    hostConfig.trlinkDev = 'https://tr-dev.zmlearn.com'
    hostConfig.pluginurl = 'https://x-chat-test.zmlearn.com'
    hostConfig.h5doctree =
      'https://zm-chat-slides.oss-cn-hangzhou.aliyuncs.com/html5Course/h5lessons.json'
    hostConfig.speckAnalysisPath =
      'https://x-chat-test.zmlearn.com/api/lessonSpeakInfo/update'
    hostConfig.speckDurationPath =
      'https://x-chat-test.zmlearn.com/api/lessonSpeakInfo/updateSpeakDuration'
    hostConfig.trlink_qb = 'https://qb-test.zmlearn.com'
    hostConfig.pcconfig =
      'https://zm-client.oss-cn-hangzhou.aliyuncs.com/pc/zmFuncConfig.json'
    hostConfig.zmRtcApiUrl = 'https://web-webrtc.zm1v1.com/'
    hostConfig.zmlDocContentUrl = 'https://zml-test.zmlearn.com/'
    hostConfig.zmOtherOriginLink =
      'http://wechat-test.zm1v1.com/mobile/recommend3.0/Client'
    hostConfig.zmClientHw =
      'https://test-chat-gateway.zmlearn.com/zhangmen-client-hw'
    hostConfig.zmGrowthValueUrl = 'https://v2-test.zm1v1.com/growth-frame'
    hostConfig.zmClientQb =
      'https://test-chat-gateway.zmlearn.com/zhangmen-client-qb'
    hostConfig.classroomurl =
      'https://x-chat-test.zmlearn.com/zmlearnclient/classroom/'
    hostConfig.zmhub =
      'https://x-chat-test.zmlearn.com/gateway/zhangmen-client-hub-chat'
    hostConfig.zmCourseMessage =
      'https://test-chat-gateway.zmlearn.com/zmc-personal-center'
    hostConfig.upGrade =
      'https://x-chat-test.zmlearn.com/gateway/zhangmen-client-wo'
    hostConfig.zmcCourseWare =
      'https://x-chat-test.zmlearn.com/gateway/zmc-courseware-together'
    hostConfig.baseIpUrl = 'http://10.80.228.48:8080'
    hostConfig.pcOldBaseUrl = 'http://10.29.182.197:8080'
    hostConfig.bucourseware =
      'https://x-chat-test.zmlearn.com/gateway/zmc-courseware-kid'
    hostConfig.zmg = 'https://test.hdkj.zmlearn.com/zm_course_web/'
    hostConfig.zhangmenKidsUrl = 'https://www-test.zhangmenkid.com/'
    hostConfig.game = 'https://test.hdkj.zmlearn.com/StudyPartner_Preview'
    hostConfig.partnerUrl = 'http://10.27.4.131:8080'
    hostConfig.makeuplesson = 'http://10.25.1.34:8080'
    hostConfig.notice = 'https://kids-active.zmaxis.com/pad/ai-rules.html'
    hostConfig.upGradeUrl = '//app-gateway-test.zmlearn.com'
    hostConfig.studylandUrl = '//app-gateway-test.zmlearn.com'
  }
})

const getHost = () => {
  const { host } = window.location
  switch (host) {
    case 'chat.zmlearn.com':
      return 'prod'
    case 'chat.uat.zmops.cc':
      return 'uat'
    case 'x-chat-test.zmlearn.com':
      return 'test'
    case 'x-chat-dev.zmlearn.com':
      return 'dev'
    default:
      // 本地开发临时切换环境，直接在此return 对应的参数 (prod || uat || test || dev)
      return localStorage.getItem('devType') || process.env.BUILD_TYPE
  }
}

// 默认根据域名配置地址，可以通过 window.resetConfig 手动切换配置，用于打包后测试不同环境代码的执行结果
setConfig(getHost())

export const Config = hostConfig

export default Config

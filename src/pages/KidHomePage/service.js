import Config from 'utils/config';
import request, { options, JsonToUrlParams } from 'utils/request';
import { func } from 'prop-types';

export function getLessonList() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/index`;
  return request(requestURL, Object.assign({}, options('GET', 'json', false, true)));
}
export function getStudyingCourse({ subjectCode }) {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/getStudyingCourse`;
  return request(requestURL, Object.assign({}, options('GET', 'json', false, true)), { subjectCode });
}
export function getNetworkSpeed() {
  const requestURL = `${Config.apiurl}/api/load-balancing/ping`;
  return request(requestURL, Object.assign({}, options('GET', 'json', false, true)));
}
export function getMessageCount() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/messageCenter/messageCount`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true)));
}
export function getLearningAbilityResult() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/learningAbilityAssessing/hasDiagnosed`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true)));
}

// 学生端验证是否强制上自助调试课
export function getSimulateLessonState(params) {
  const requestURL = `${Config.upGrade}/api/simulateLesson/validAiTestState`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { headers: { userId: params.userId, 'Content-Type': 'application/json;charset=UTF-8' }, body: JSON.stringify(params.bodyParams) }));
}
// 更新首页设备检测消息已读未读状态
export function updateDeviceNotifyReadState(params) {
  const requestURL = `${Config.upGrade}/api/simulateLesson/uptDeviceNotifyReadState`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}
// 查询上节自助调试课检测结果
export function getAiLastTestResult(params) {
  const requestURL = `${Config.upGrade}/api/simulateLesson/getAiLastTestResult`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { headers: { userId: params.userId, 'Content-Type': 'application/json;charset=UTF-8' }, body: JSON.stringify(params.bodyParams) }));
}
// 开自助调试课
export function openSimulateLesson(params) {
  const requestURL = `${Config.upGrade}/api/simulateLesson/openLesson`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { headers: { userId: params.userId, 'Content-Type': 'application/json;charset=UTF-8' }, body: JSON.stringify(params.bodyParams) }));
}
export function getPersonalInfo() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/user/selectStudent`;
  return request(requestURL, Object.assign({}, options('GET', 'json', false, true, '1.9.0')));
}
export function getIsBelongKidsBu() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/isBelongKidsBu`;
  return request(requestURL, Object.assign({}, options('GET', 'json', false, true)));
}
export function getLessonForClass(params) {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/lesson/findLessonForClass`;
  // const requestURL = `${Config.apiurl}/kidsPadApi/courseSchedule/monthCalendarQueryCourseStates`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}
// 获取开关配置信息
export function getSelectSwitch(params) {
  const requestURL = `${Config.upGradeUrl}/kids/api/grayApi/toc/plan/findPlanByCodeAndParam`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, false), { headers: params.headers }, { body: JSON.stringify(params.body) }));
}

// 获取今日是否签到接口
export function getSign() {
  const requestURL = `${Config.partnerUrl}/kidsStuApi/partner/api/op/getSign`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true)));
}

// 获取学伴(判断是否领取学伴)
export function getPartnerInfo() {
  const requestURL = `${Config.partnerUrl}/kidsStuApi/partner/api/op/getPartnerInfo`;
  return request(requestURL, Object.assign({}, options('GET', 'json', false, true)));
}

// 增加能量果（签到）
export function getAddFruit(params) {
  const requestURL = `${Config.partnerUrl}/kidsStuApi/partner/api/op/addFruit`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

// 查询学伴manifest信息学伴本地化
export function getManifest() {
  const requestURL = `${Config.partnerUrl}/kidsStuApi/partner/api/op/manifest`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true)));
}

// 获取教师节活动信息
export function getFestival() {
  const requestURL = `${Config.upGradeUrl}/kidsStuApi/festival/matchCondition`;
  return request(requestURL, Object.assign({}, options('GET', 'json', false, true, '1.7.0')));
}
//获取学习乐园入口配置
export function getStudylandEntryConfig(){
  const requestUrl = `${Config.studylandUrl}/kids/api/study/park/api/config/getStudyParkEntryConfig`;
  return request(requestUrl, Object.assign({},options('GET','json',false,true)),{platform:'pc'});
}
// 节日换肤
export function getFestivalBg() {
  const requestURL = `${Config.upGradeUrl}/kids/resources/pc/theme`;
  return request(requestURL, Object.assign({}, options('GET', 'json', false, true)));
}

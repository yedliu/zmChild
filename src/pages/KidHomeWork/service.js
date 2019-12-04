import request, { options } from 'utils/request';
import Config from 'utils/config';
import { AppLocalStorage } from 'utils/localStorage';

// 小班课做作业接口
export function getDoSmallHomework(params) {
  const { id } = params;
  const reqUrl = `${Config.zmClientHw}/api/smallClazzLessonHomework/${id}/preStuAnswer`;
  return request(reqUrl, Object.assign({}, options('POST', 'json', false, true), {}));
}

// 小班课作业提交接口
export function postSmallHomeworkAnswer(params) {
  const reqUrl = `${Config.zmClientHw}/api/smallClazzLessonHomework/stuAnswer`;
  return request(reqUrl, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

// 小班课作业报告接口
export function getSmallCourseReport(params) {
  const { id } = params;
  const { role } = AppLocalStorage.getUserInfo();
  // console.log(role)
  const reqUrl = `${Config.zmClientHw}/api/homeworkLesson/${id}`;
  return request(reqUrl, Object.assign({}, options('GET', 'json', false, true)), { role });
}

// 1对1做作业接口
export function getOneToOneHomework(params) {
  const { id, bool } = params;
  const { role } = AppLocalStorage.getUserInfo();
  let requestURL = `${Config.zmClientHw}/api/homeworkLesson/${id}/preStuAnswer`;
  // 如果是再做一次 不改变状态
  if (bool === false) {
    requestURL = `${Config.zmClientHw}/api/homeworkLesson/${id}`;
  }

  if (bool === false) {
    return request(requestURL, Object.assign({}, options('GET', 'json', false, true)), { role });
  }
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true)));
}

// 1对1作业报告接口
export function getOneToOneCourseReport(params) {
  const { id } = params;
  const { role } = AppLocalStorage.getUserInfo();
  const requestURL = `${Config.zmClientHw}/api/homeworkLesson/${id}`;
  return request(requestURL, Object.assign({}, options('GET', 'json', false, true)), { role });
}

// 1对1单题答案提交接口
export function postOneToOneHomeworkAnswer(params) {
  const requestURL = `${Config.zmClientHw}/api/homeworkLesson/stuAnswer`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

// 1对1全部答案提交接口
export function postOneToOneHomeworiAllAnswer(params) {
  const requestURL = `${Config.zmClientHw}/api/homeworkLesson/stuAnswer`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

// 增加能量果（作业）
export function getAddFruit(params) {
  const requestURL = `${Config.partnerUrl}/kidsStuApi/partner/api/energy/operation/settle/submit/homework`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

import request, { options } from 'utils/request';
import Config from 'utils/config';

// 查询待学习列表
export function checkUnfinishedLessonList() {
  const requestUrl = `${Config.makeuplesson}/kids/record/lessons/api/list/unfinished`;
  return request(requestUrl, Object.assign({}, options('GET', 'json', false, true)));
}

// 查询已学习列表
export function checkFinishedLessonList(params) {
  const requestUrl = `${Config.makeuplesson}/kids/record/lessons/api/list/finished`;
  return request(requestUrl, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params)}));
}

// 开始学习
export function beginMakeUpLesson(params) {
  const { lessonId } = params;
  const requestUrl = `${Config.makeuplesson}/kids/record/lessons/api/start`;
  return request(requestUrl, Object.assign({}, options('GET', 'json', false, true)), { lessonId });
}

// 获取录播课件
export function getCourseWare(params) {
  const { recordId } = params;
  const requestUrl = `${Config.makeuplesson}/kids/record/lessons/api/fetch/courseware`;
  return request(requestUrl, Object.assign({}, options('GET', 'json', false, true)), { recordId });
}

// 获取录播课uid
export function getRecordedUid(params) {
  const requestUrl = `${Config.makeuplesson}/kids/record/lessons/api/fetch/uid`;
  return request(requestUrl, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

// 消耗免费次数/课时进课堂
export function getEnterNum(params) {
  const requestUrl =  `${Config.makeuplesson}/kids/record/lessons/api/enter`;
  return request (requestUrl, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

export function parseCourse(params) {
  const { requestUrl } = params;
  return fetch(requestUrl).then((response) => {
    
    return response;
  }).then(parseJSON).then((res) => { return res });
}

export function parseJSON(response) {
  return response.json();
}
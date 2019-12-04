import Config from 'utils/config';
import request, { options, JsonToUrlParams } from 'utils/request';

export function queryCourseStates({ statesParams }) {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/courseSchedule/monthCalendarQueryCourseStates`;
  // const requestURL = `${Config.apiurl}/kidsPadApi/courseSchedule/monthCalendarQueryCourseStates`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(statesParams) }));
}

export function queryCourseSchedule({ courseParams }) {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/courseSchedule/someDayQueryCourseSchedule`;
  return request(requestURL, Object.assign({}, options('GET', 'json', false, true, '1.0.2')), courseParams);
}
export function getLessonForClass(params) {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/lesson/findLessonForClass`;
  // const requestURL = `${Config.apiurl}/kidsPadApi/courseSchedule/monthCalendarQueryCourseStates`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

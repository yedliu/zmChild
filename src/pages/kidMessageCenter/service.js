import Config from 'utils/config';
import request, { options, JsonToUrlParams } from 'utils/request';
import { AppLocalStorage } from '../../utils/localStorage';

export function getUnreadMessagesCount() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/messageCenter/messageCount`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true)));
}

export function getCourseMessagesInfo(params) {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/messageCenter/courseMessageInfo`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

export function getHomeworkMessagesInfo(params) {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/messageCenter/homeworkMessageInfo`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

export function setCourseMessagesRead(params) {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/messageCenter/readMultiCourseMessage`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

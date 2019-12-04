import Config from 'utils/config';
import request, { options, JsonToUrlParams } from 'utils/request';

export function gradeSubject() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/dict/gradeSubject`;
  return request(requestURL, Object.assign({}, options('GET', 'json', false, true)));
}

export function modifyStudent(params) {
  const reqUrl = `${Config.baseIpUrl}/kidsStuApi/user/modifyStudent`;
  return request(reqUrl, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

export function getPersonalInfo() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/user/selectStudent`;
  return request(requestURL, Object.assign({}, options('GET', 'json', false, true)));
}

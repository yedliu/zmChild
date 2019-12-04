import request, { options } from 'utils/request';
import Config from 'utils/config';

// 获取卡片列表
export function getPracticeCenter() {
  const reqUrl = `${Config.baseIpUrl}/kidsStuApi/practiceCenter/items`;
  return request(reqUrl, Object.assign({}, options('GET', 'json', false, true)));
}

// 获取学生信息
export function getPersonalInfo() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/user/selectStudent`;
  return request(requestURL, Object.assign({}, options('GET', 'json', false, true)));
}

// 获取年级
export function gradeSubject() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/dict/gradeSubject`;
  return request(requestURL, Object.assign({}, options('GET', 'json', false, true)));
}

// 提交学生信息
export function modifyStudent(params) {
  const reqUrl = `${Config.baseIpUrl}/kidsStuApi/user/modifyStudent`;
  return request(reqUrl, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}
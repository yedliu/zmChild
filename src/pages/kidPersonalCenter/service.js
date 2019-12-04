import Config from 'utils/config';
import request, { options, JsonToUrlParams } from 'utils/request';
import { AppLocalStorage } from '../../utils/localStorage';

export function getPersonalInfo() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/user/selectStudent`;
  return request(requestURL, Object.assign({}, options('GET', 'json', false, true)));
}

export function getLessonsInfo() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/orders/getOtherRemainCourseInfo`;
  return request(requestURL, Object.assign({}, options('GET', 'json', false, true)));
}

export function getFreeLessonsInfo() {
  const mobile = AppLocalStorage.getMobile();
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/orders/queryFreeClassHours`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true)), { mobile });
}

export function getLessonsDetail(params) {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/orders/getConsumeAndGainCourseInfo`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

export function getDoneLearningAbilityTest() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/learningAbilityAssessing/hasDiagnosed`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true)));
}

export function getLearningAbilityResult() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/learningAbilityAssessing/queryByUserId`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true)));
}

//获取阶段测评url
export function getPhasetestUrl(params){
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/urlService/urlGet`;
  return request(requestURL,Object.assign({}, options('GET','json',false,true,'1.6.0')),{...params});
}

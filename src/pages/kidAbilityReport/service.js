import Config from 'utils/config';
import request, { options, JsonToUrlParams } from 'utils/request';
import { AppLocalStorage } from '../../utils/localStorage';

export function getDoneLearningAbilityTest() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/learningAbilityAssessing/hasDiagnosed`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true)));
}

export function getLearningAbilityResult() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/learningAbilityAssessing/queryByUserId`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true)));
}

export function submitLearningAbility(params) {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/learningAbilityAssessing/save`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

export function getIfPaid() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/user/getIfPaid`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true)));
}

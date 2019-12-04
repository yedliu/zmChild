import request, { options } from 'utils/request';
import Config from 'utils/config';
import { getAppReleaseKind } from 'utils/nativebridge';

export async function getRoleList(params) {
  const { mobile } = params;
  const reqUrl = `${Config.apiurl}/gateway/zhangmen-client-inClass/api/user/getRoleList/${mobile}`;
  return request(reqUrl, Object.assign({}, options('POST', 'json', false, false)));
}

export async function getUserInfo(params) {
  const reqUrl = `${Config.apiurl}${getAppReleaseKind() === 'aplus' ? '/api/ajia/getBasicInfo' : '/gateway/zhangmen-client-inClass/api/user/get-basic-info'}`;
  return request(reqUrl, Object.assign({}, options('POST', 'json', true, false), { body: JSON.stringify(params) }));
}

export async function getToken(params) {
  const reqUrl = `${Config.apiurl}/gateway/zhangmen-client-inClass/api/oauth/loginNew`;
  return request(reqUrl, Object.assign({}, options('POST', 'json', false, false), params.params));
}

export async function getPubKey() {
  const reqUrl = `${Config.apiurl}/gateway/zhangmen-client-inClass/api/oauth/rsaPubKey`;
  return request(reqUrl, Object.assign({}, options('GET', 'form', false, false)));
}

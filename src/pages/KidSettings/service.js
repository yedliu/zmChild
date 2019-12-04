import Config from 'utils/config';
import request, { options } from 'utils/request';

export function getBasicInfoByRole(params) {
  const reqUrl = `${Config.apiurl}/gateway/zmc-login/api/user/getBasicInfoByRole`;
  return request(reqUrl, Object.assign({}, options('POST', 'json', false, true)), { role: params.role });
}

export function changePasswd(params) {
  const reqUrl = `${Config.apiurl}/api/oauth/changePasswd`;
  return request(reqUrl, Object.assign({}, options('POST', 'form', false, true)), params);
}

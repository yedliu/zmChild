import request, { options } from 'utils/request';
import Config from 'utils/config';

export function getCourse(params) {
  const reqUrl = `${Config.baseIpUrl}/kidsStuApi/finishedCourse/page`;
  return request(reqUrl, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

export function showKidMindButton() {
  const reqUrl = `${Config.makeuplesson}/kids/record/lessons/api/show/button`;
  return request(reqUrl, Object.assign({}, options('GET', 'json', false, true)));
}
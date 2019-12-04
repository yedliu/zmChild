import Config from 'utils/config';
import request, { options } from 'utils/request';

export function getLessonForClass(params) {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/lesson/findLessonForClass`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

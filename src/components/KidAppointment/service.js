import Config from 'utils/config';
import request, { options, JsonToUrlParams } from 'utils/request';

export function getUserAppointmentInfo() {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/appointment/userAppointmentPage`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true)));
}
export function getAppointment({ defaultSubject }) {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/appointment/appointment`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(defaultSubject) }));
  // return request(requestURL, Object.assign({}, options('POST', 'json', false, true)))
}

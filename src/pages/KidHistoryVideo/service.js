import request, { options, JsonToUrlParams } from 'utils/request';
import Config from 'utils/config';
import { AppLocalStorage } from 'utils/localStorage';


// videotype  获取视频类型
export function getVideoTypeData(params) {
  console.log('params', params);
  const lesUID = params.uid ? params.uid : params.lessonUid;
  const requestURL = `${Config.apiurl}/api/tencent/getTencentAudio`;
  return request(requestURL, options('POST', 'form', false, false), { lesUID });
}

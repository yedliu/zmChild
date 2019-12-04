import request, { options } from 'utils/request';
import Config from 'utils/config';

// 获取上课课件
export function getClassCourseware(params) {
  const lessonId = params.id || params.lessonId;
  const lessonType = params.courseMode == 2 ? 1 : 2;
  const requestURL = `${Config.zmcCourseWare}/lessonCsware/getCswares`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify({ lessonId, lessonType }) }));
}

// 获取预习课件
export function getPreviewCourseware(params) {
  const lessonId = params.id || params.lessonId;
  const lessonType = params.courseMode;
  // const requestURL = `${Config.fsurl}/api/lessonPreview/getPreviewOne`;
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/coursewareService/getPreviewCourseware`;
  // return request(requestURL, options('GET', 'json', true, false), { lessonId, lessonType });
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify({ lessonId, lessonType }) }));
}

// 更新预览进度
// export function updatePreviewProgress(params) {
//   const lessonId = params.data.id || params.data.lessonId;
//   const lessonType = params.courseMode == 2 ? 1 : 2;
//   const { page, totalPage } = params;
//   const requestURL = `${Config.fsurl}/api/lessonPreview/updateProgress`;
//   return request(requestURL, options('POST', 'json', true, false), { lessonId, lessonType, page, totalPage });
// }

// 小班课分BU后获取上课课件的接口
export function getBUClassCourseware(params) {
  const lessonId = params.id || params.lessonId;
  const requestURL = `${Config.bucourseware}/kid/lessonCourseware/getCswaresByLesson`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify({ lessonId }) }));
}

// 预习进度+增加能量果（预习）
export function getAddFruit(params) {
  const requestURL = `${Config.baseIpUrl}/kidsStuApi/coursewareService/updateProgress`;
  return request(requestURL, Object.assign({}, options('POST', 'json', false, true), { body: JSON.stringify(params) }));
}

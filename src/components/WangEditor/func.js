
import fetch from 'dva/fetch';
import { Config } from 'utils/config';
import { AppLocalStorage } from 'utils/localStorage';

export const uploadFiles = (files, cb) => {
  if (!files || files.length <= 0) return;
  const form = new FormData();
  form.append('file', files[0]);
  fetch(`${Config.tkurl}/api/homeworkLesson/uploadImg`, {
    method: 'POST',
    headers: {
      mobile: AppLocalStorage.getMobile(),
      password: AppLocalStorage.getPassWord(),
    },
    body: form,
  }).then((response) => {
    return response.json();
  }, (err) => {
    console.log('upload err msg：', err.message);
    return { data: '', code: '0', message: '上传失败！' };
  }).then((json) => {
    if (json && json.code.toString() === '1') {
      cb(json);
    }
  });
};

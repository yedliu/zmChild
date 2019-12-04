export const stateList = [32, 33, 34];

export const verifyFinishAll = (data) => {
  const alertFlag = { status: 'done', index: 0 };
  alertFlag.status = data.some((item, index) => {
    let flag = false;
    if (item.children && item.children.length > 0) {
      flag = !item.children.every((it) => {
        return (it.stuAnswer || '').replace(/<(?!img)[^>]*>|&nbsp;|\s/g, '');
      });
    } else {
      flag = !(item.stuAnswer || '').replace(/<(?!img)[^>]*>|&nbsp;|\s/g, '');
    }
    alertFlag.index = flag === true ? index : 0;
    return !!flag;
  }) ? 'undone' : 'done';
  return alertFlag;
};

export const buttonStyle = {
  width: '120px',
  height: '45px',
  'font-size': '16px',
  'font-family': 'HYZhengYuan',
  color: '#fff',
};

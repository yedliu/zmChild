/**
 * 统一方法入口
 */

import { fromJS, List } from 'immutable'
import {
  numberToLetter,
  numberToRome,
  renderToKatex,
  isFunction,
  isString,
  isObject,
  isNumber,
  isArray,
} from '../../../pages/KidHomeWork/oneToOneQuestion/common'
import { OneGroup } from './questionConfig'

// 导出方法
export {
  numberToLetter,
  renderToKatex,
  isString,
  isObject,
  isNumber,
  isArray,
  fromJS,
  List,
}

const indexGet = {
  number(index) {
    return index
  },
  chinese(index) {
    return numberToLetter(index - 1)
  },
  rome(index) {
    return numberToRome(index - 1)
  },
}

// 返回 type 类型的 index
export const changeIndex = (index, type) => {
  let res = ''
  if (!isFunction(indexGet[type])) {
    res = `${index}.`
  } else {
    res = `${indexGet[type](index)}.`
  }
  return res
}

// 过滤当前不存在的属性
// const filterOptions = (options, question) => {
//   const newOptions = options.filter((item) => {
//     let res = '';
//     if (isObject(item)) {
//       res = question.get(item.key);
//     } else {
//       res = question.get(item);
//     }
//     return res;
//   });
//   return newOptions;
// };

// 对 options 排序处理
export const reSortOption = (optionList = []) => {
  const optionFilter = []
  const groupSort = {}
  let groupSortIndex = -1
  const len = optionList.length || 0
  for (let i = 0; i < len; i += 1) {
    const item = optionList[i]
    if (isString(item) && OneGroup.includes(item)) {
      if (groupSort[0]) {
        groupSort[0].values.push(item)
      } else {
        groupSortIndex += 1
        groupSort[0] = {
          index: groupSortIndex,
          values: [item],
        }
      }
    } else if (isObject(item) && item.group) {
      if (groupSort[item.group]) {
        groupSort[item.group].values.push(item)
      } else {
        groupSortIndex += 1
        groupSort[item.group] = {
          index: groupSortIndex,
          values: [item],
        }
      }
    } else {
      groupSortIndex += 1
      optionFilter.push(item)
    }
  }

  const newOptionList = optionFilter
  // console.log('start', newOptionList);

  // 将 group 数据放到数组中
  const newGroupSort = []
  for (const it in groupSort) {
    newGroupSort.push(groupSort[it])
    // newOptionList.splice(groupSort[it].index, 0, groupSort[it].values);
  }
  // 对 group 数组进行排序
  newGroupSort.sort((a, b) => a.index - b.index)

  // 插入到原数组中
  for (let i = 0; i < newGroupSort.length; i += 1) {
    // console.log(groupSort[i]);
    newOptionList.splice(newGroupSort[i].index, 0, newGroupSort[i].values)
  }
  // console.log(optionFilter);
  // console.log(groupSort);
  // console.log(newGroupSort);
  // console.log('end', newOptionList);
  return newOptionList
}

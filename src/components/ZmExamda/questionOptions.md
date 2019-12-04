```jsx
  const splitSpan = <span style={{ display: 'inline-block', margin: '0 5px' }}>|<span>;

  <QuestionItem
    question={questionData}
    index                         // 当前题号, number || string(如：'一、')；number 时传入 1 得到结果 1. ,string 时则以传入 '一、' 得到结果 一、
    showCorrection                // 是否显示批改结果
    interactive                   // 是否可交互（即学生是否可以作答）
    handleChange                  // 每一次交互是触发的方法（stuAnswer, id）
    indexType                     // 序号类型 默认number, number | chinese | rome | icon
    // 显示的顺序会按照 show不传默认是true
    options={[                    // 题目内容显示配置
      {
        key: 'title',
      }
      {
        key: 'answerArea',
      },
      {                  // 知识点
        label: '知识点：'，           
        split: '、',              // 多个知识点之间的分隔符
        key: 'knowledges',        // 对应的字段名
        group: 1                  // 组合，例如知识点、答案和解析以经常放在同一个 div 内，而其他不可能不会在一起（非少儿题型适用）,用于自定义组合
                                  // 不传则使用默认组合
      },
      {                  // 答案
        label: '答案：',
        key: 'answerList',
      },
      {                  // 解析
        lable: '解析：',
        key: 'analysis',
      },
      {                 
        lable: '学生答案：',
        key: 'stuAnswer',
      },
      {                 
        key: 'children',
       	indexType: '' // 子题序号 默认number, number | chinese | rome | icon
      },
      {
      	inlineList: [{
          label: '题型：',
          split: splitSpan,                       // string | reactDom
          key: 'questionTypeName',
        }],
      }
      ...
    ]}

    // 也可以直接传字符串
    options={[
      'title', 'knowledges', 'answerList', 'analysis'
      ...
    ]}
  />
```

**如需扩展其他字段的显示**
```JavaScript
  options={[
    ...
    {
      show: true,
      label: '$$：',
      key: "[question's key]"
    }
  ]}
```
// import React from 'react';
// import { fromJS } from 'immutable';

// import ZmExamda from '../index';
// import { DemoWrapper, QuestionBox } from './indexStyle';
// import QuestionData from './mock';

// const splitSpan = (<span style={{ display: 'inline-block', margin: '0 8px' }}>|</span>);

// class QuestionDemo extends React.PureComponent { // eslint-disable-line
//   constructor() {
//     super();
//     this.changeStuAnswer = this.changeStuAnswer.bind(this);
//     this.state = {
//       questionData: fromJS(QuestionData),
//     };
//   }
//   changeStuAnswer({ id, stuAnswer }) {
//     const { questionData } = this.state;
//     if (questionData.get('id') === id) {
//       const newQuestionData = questionData.set('stuAnswer', stuAnswer);
//       this.setState({ questionData: newQuestionData });
//     }
//   }
//   render() {
//     const { questionData } = this.state;
//     return (<DemoWrapper>
//       <QuestionBox>
//         <ZmExamda
//           question={questionData}
//           options={[
//             'title',
//             'knowledgeNameList',
//             'answerList',
//             'analysis',
//             {
//               inlineList: [{
//                 label: '题型：',
//                 split: splitSpan,                       // string | reactDom
//                 key: 'questionType',
//               }, {
//                 label: '使用次数：',
//                 split: splitSpan,                       // string | reactDom
//                 key: 'quoteCount',
//               }, {
//                 label: '来源：',
//                 split: splitSpan,                       // string | reactDom
//                 key: 'label',
//               }],
//             },
//           ]}
//           handleChange={this.changeStuAnswer}
//           interactive
//         />
//       </QuestionBox>
//     </DemoWrapper>);
//   }
// }

// export default QuestionDemo;

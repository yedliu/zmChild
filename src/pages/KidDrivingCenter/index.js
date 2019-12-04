import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import KidHeader from 'components/kidHeader';
import ZmModal from 'components/zmModal/index';
import zmTip from 'components/zmTip';
import { modifyStudent } from './service';
import './index.scss';

import homeworkbg from './images/img_practiceCenter_homework.png';
import pretestbg from './images/img_practiceCenter_pretest.png';
import stagedbg from './images/img_practiceCenter_stagedEvaluation.png';

const cardList = [
  {
    bg: homeworkbg,
  },
  {
    bg: pretestbg,
  },
  {
    bg: stagedbg,
  }
]

function KidDrivingCenter(props) {
  const [showModal, setShowModal] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [gradeVlaue, setGradeValue] = useState(null);
  const [gradeCode, setGradeCode] = useState(null);
  const [nameValue, setNameValue] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [isDisable, setDisable] = useState(true);
  const [checkIndex, setCheckIndex] = useState(null);
  const { dispatch, kiddrivingcenter } = props;
  const { practiceItems, personInfo, gradeList } = kiddrivingcenter;
  const handleGoBack = () => {
    dispatch(routerRedux.push(
      {
        pathname: '/kid',
        state: {
          from: '/kid/kiddrivingcenter',
        },
      },
    ));
  }

  useEffect(() => {
    if (gradeVlaue && nameValue) {
      setDisable(false);
    } else {
      setDisable(true);
    }

    if (!nameValue) {
      setShowDelete(false);
    }
  }, [gradeVlaue, nameValue]);

  useEffect(() => {
    dispatch({
      type: 'kiddrivingcenter/getPersonalInfo',
    })
    dispatch({
      type: 'kiddrivingcenter/getPracticeCenter',
    })
  }, [])

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleArrow = () => {
    if (personInfo.stuGrade) return;
    setShowSelect(!showSelect);
  }

  const handleCheckGrade = (item, index) => {
    setShowSelect(false);
    setCheckIndex(index);
    setGradeValue(item.label);
    setGradeCode(item.code);
  }

  const handleSure = async () => {
    setShowModal(false);
    const params = {
      name: nameValue,
      gradeCode: gradeCode
    }
    const res = await modifyStudent(params);
    if (res && res.code === '0') {
      const info = {
        title: '完善成功',
        time: 2000,
        className: 'success'
      };
      zmTip(info);
    } else {
      const info = {
        title: res.message,
        time: 2000,
      };
      zmTip(info);
    }
  }

  const handleDelete = () => {
    setShowDelete(false);
    setNameValue("");
  }

  const handleKeyUp = (e) => {
    setShowDelete(true);
    setNameValue(e.target.value)
  }

  const renderMoadl = () => {
    return (
      <ZmModal visible={showModal} >
        <div id="complete-info">
          <div className="ellipse" />
          <div className="close-btn" onClick={handleCloseModal} />
          <div className="info-title">完善信息</div>
          <div className="info-tip">为了测评结果的准确性，请先完善宝贝的信息</div>
          <div className="info-input">
            <div className="name-pic" />
            <input placeholder="请输入宝贝姓名" type="text" className="input" value={nameValue} onChange={(e) => handleKeyUp(e)} />
            {showDelete && <div className="delete" onClick={handleDelete} />}
          </div>
          <div className="info-input">
            <div className="grade-pic" />
            <input placeholder="请选择宝贝年级" type="text" disabled className="input" defaultValue={gradeVlaue} />
            <div className="grade-arrow" onClick={handleArrow} />
            { showSelect &&
              <div className="select-box">
                {
                  gradeList.map((item, index) => (
                    <div key={index} className={`grade-list ${checkIndex === index ? 'checked' : ''}`} onClick={() => handleCheckGrade(item, index)}>{item.label}</div>
                  ))
                }
              </div>
            }
          </div>
          <button className={`info-btn ${isDisable ? '' : 'red-btn'}`} onClick={handleSure} disabled={isDisable}>确定</button>
        </div>
      </ZmModal>
    )
  }

  const handleInto = (item) => {
    if (!personInfo.name || !personInfo.stuGrade) {
      setShowModal(true);
      setGradeValue(personInfo.stuGrade);
      dispatch({
        type: 'kiddrivingcenter/gradeSubject',
      });
    } else {
      dispatch(routerRedux.push(
        {
          pathname: '/kid/kidpracticecenter',
          state: {
            url: item.jumpUrl,
            from: '/kid/kiddrivingcenter',
          },
        },
      ));
    }
  }

  let newCard = [];
  let store = {};
  practiceItems.map((item) => {
    cardList.map((cardItem) => {
      return newCard.push(Object.assign({}, item, cardItem));
    })
  });

  newCard = newCard.reduce((item, next) => {
    if (!store[next.bg] && !store[next.title]) {
      item.push(next);
      store[next.bg] = true;
      store[next.title] = true;
    }
    return item;
  }, [])


  return(
    <div id="kiddrivingcenter">
      <KidHeader center="练习中心" goBack={handleGoBack} />
      <div className="driving-center">
        {
          newCard.map((item, index) => (
            <div 
              key={index} 
              style={{marginTop: `${index === 1 ? '65px': '140px'}`}} 
              className="driving-card"
            >
              <div className="card-title">{item.title}</div>
              <div className="card-pic" style={{backgroundImage: `url(${item.imageUrl || item.bg})`}}></div>
              <div className="card-button" onClick={() => handleInto(item)}>立即进入</div>
            </div>
          ))
        }
      </div>
      {showModal && renderMoadl()}
    </div>
  )
}

function mapStateToProps({kiddrivingcenter}) {
  return {kiddrivingcenter}
}

export default connect(mapStateToProps)(KidDrivingCenter);
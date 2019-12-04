import React from 'react';
import PropTypes from 'prop-types';
import KidButton from 'components/KidButton';
import { clickVoice } from 'utils/helpfunc';
import { uniqueId } from 'lodash';
import './style.scss';

const TipModal = (props) => {
  const { visible, fileList, handleStartDownload, handleCloseTip } = props;
  if (!visible) return null;

  function handleClickClose(e) {
    clickVoice();
    handleCloseTip(e);
  }
  return (
    <div className="csDownloadContainer">
      <div className="inner">
        <h3>上课课件下载</h3>
        <p className="tip">为给宝贝一个良好的上课体验，建议提前下载今日上课所需的课件，点击【开始下载】，后台将自动下载</p>
        <div className="csListContainer">
          <ul className="coursewareList">
            {
              fileList.map((item) => {
                let name = item.name || '';
                name = name.replace('.zmg', '');

                return !item.notShow ? (
                  <li key={uniqueId('csItem_')} className="coursewareItem">{name}</li>
                ) : null;
              })
            }
          </ul>
        </div>
        <KidButton size="medium" handleClick={handleStartDownload}>开始下载</KidButton>
      </div>
    </div>
  );
};

TipModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  fileList: PropTypes.array.isRequired,
  handleCloseTip: PropTypes.func.isRequired,
  handleStartDownload: PropTypes.func.isRequired,
};

export default TipModal;

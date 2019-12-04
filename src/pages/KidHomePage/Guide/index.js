import React, { useState } from 'react';
import ZmModal from 'components/zmModal';
import KidButton from 'components/KidButton';

import './index.scss';

function Guide() {
  const [showModal, setModal] = useState(true)
  const handleClick = () => {
    setModal(false)
  }

  return (
    showModal && <ZmModal visible={showModal}>
      <div id="guide">
        <div className="guide-box">
          <div className="handle"></div>
          <div className="tips">
            <p>点击课程卡片，可查看课程介绍，以及老师信息哦</p>
            <KidButton handleClick={handleClick}>我知道了</KidButton>
          </div>
        </div>
      </div>
    </ZmModal>
  )
}

export default Guide;
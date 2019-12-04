import React, { useState, useEffect, useRef, memo } from 'react';
import NoGetFriends from '../../statics/common/svga/nogetfriends.svga';
import DaiDaiHungry from '../../statics/common/svga/daidaihungry.svga';
import DaiDaiGet from '../../statics/common/svga/daidaiget.svga';
import DaiDaiSleep from '../../statics/common/svga/daidaisleep.svga';
import MeiMeiTuGet from '../../statics/common/svga/meimeituget.svga';
import MeiMeiTuHungry from '../../statics/common/svga/meimeituhungry.svga';
import MeiMeiTuSleep from '../../statics/common/svga/meimeitusleep.svga';
import ZhangXiaoMengGet from '../../statics/common/svga/zhangxiaomengget.svga';
import ZhangXiaoMengHungry from '../../statics/common/svga/zhangxiaomenghungry.svga';
import ZhangXiaoMengSleep from '../../statics/common/svga/zhangxiaomengsleep.svga';
import SVGA from 'svgaplayerweb';
import './style.scss';


function FriendsAnimate({ partnerInfo = {}, showFriute = false, fruite }) {
  let [svgA, setSvga] = useState(NoGetFriends);
  let Friends = useRef(null);

  let setFriends = () => {
    // 未领取学伴
    if (!partnerInfo.isAdoption) {
      setSvga(NoGetFriends);
    }
    // 掌小萌
    if (partnerInfo.partnerId == 1) {
      // 未签到状态
      if (!partnerInfo.isSign) {
        setSvga(ZhangXiaoMengSleep);
      } else {
        // 签到但饥饿状态
        if (partnerInfo.isHunger) {
          setSvga(ZhangXiaoMengHungry);
        } else {
          // 签到不饥饿状态
          setSvga(ZhangXiaoMengGet);
        }
      }
    }
    // 美美兔
    if (partnerInfo.partnerId == 2) {
      // 未签到状态
      if (!partnerInfo.isSign) {
        setSvga(MeiMeiTuSleep);
      } else {
        // 签到但饥饿状态
        if (partnerInfo.isHunger) {
          setSvga(MeiMeiTuHungry);
        } else {
          // 签到不饥饿状态
          setSvga(MeiMeiTuGet);
        }
      }
    }
    // 呆呆熊
    if (partnerInfo.partnerId == 3) {
      // 未签到状态
      if (!partnerInfo.isSign) {
        setSvga(DaiDaiSleep);
      } else {
        // 签到但饥饿状态
        if (partnerInfo.isHunger) {
          setSvga(DaiDaiHungry);
        } else {
          // 签到不饥饿状态
          setSvga(DaiDaiGet);
        }
      }
    }
  };

  let player = null;
  let parser = null;

  useEffect(() => {
    setFriends();
      player = new SVGA.Player(Friends.current);
      parser = new SVGA.Parser(Friends.current);
      parser.load(svgA, (videoItem) => {
        player.setVideoItem(videoItem);
        player.startAnimation();
      });
    return () => {
      setFriends = null;
    }
  }, [svgA, partnerInfo.isSign, partnerInfo.partnerId, partnerInfo.isHunger]);

  return (
    <div className="friends-animate-box">
      {showFriute && (
      <div className="friute-box">
        +{fruite}
      </div>
      )}
      <div ref={Friends} className="friends" />
    </div>
  );
}

export default memo(FriendsAnimate);

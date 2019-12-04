import React, { useState, useEffect, useRef, memo } from 'react';
import studyParkEntry from '../../statics/common/svga/zhangxiaomeng_rukou.svga';
import SVGA from 'svgaplayerweb';
import './style.scss';


function StudyParkAnimate(props) {
  let [svgA, setSvga] = useState(studyParkEntry);
  let entryRef = useRef(null);

  let player = null;
  let parser = null;

  useEffect(() => {
      player = new SVGA.Player(entryRef.current);
      parser = new SVGA.Parser(entryRef.current);
      player.fillMode = 'Forward';
      player.clearsAfterStop = false;
      player.onFrame((frame)=>{
        if(frame === 30){
          // player.stopAnimation();
          player.startAnimationWithRange({location:15,length:60});
        }
      })
    //   player.loops = 1;
      parser.load(svgA, (videoItem) => {
        player.setVideoItem(videoItem);
        if (props.stop && player) {
          player.stepToFrame(50,false);
          return;
        }
        player.startAnimation();
      });
  }, [props.stop]);
  return (
    <div className="entry-animate" ref={entryRef}></div>
  );
}

export default memo(StudyParkAnimate);

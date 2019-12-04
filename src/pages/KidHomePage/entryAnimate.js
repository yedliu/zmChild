import React, { useState, useEffect, useRef, memo } from 'react';
import studyParkEntry from '../../statics/common/image/entry.png';
import SVGA from 'svgaplayerweb';


function StudyParkEntryAnimate(props) {
  let [svgA, setSvga] = useState(studyParkEntry);
  let entryRef = useRef(null);

  let player = null;
  let parser = null;
  let [firstVisit,setFirstVisit] = useState(false);
  const {cartoonList=[],onClick=()=>{}} = props;
  const listLen = cartoonList.length;
  const svgaSrc = cartoonList[0].match(/\.svga$/)?cartoonList[0]:'';
  useEffect(() => {
    console.log('animate mounted')
      let videoIndex = 0;
      firstVisit = localStorage.getItem('first-visit') === null;
      setFirstVisit(firstVisit);
      player = new SVGA.Player(entryRef.current);
      parser = new SVGA.Parser(entryRef.current);
      if (listLen > 1) {
        player.loops = 1;
        player.onFinished(() => {
          console.log('svga finished');
          videoIndex = ++videoIndex % listLen;
          const svga = cartoonList[videoIndex].match(/\.svga$/) ? cartoonList[videoIndex] : '';
          svga && parser.load(svga,(video) => {
            player.setVideoItem(video);
            player.startAnimation();
          });
        });
      }
      parser.load(svgaSrc||svgA, (videoItem) => {
        player.setVideoItem(videoItem);
        player.startAnimation();
      });
  }, []);

  return (
    <div className={`entry ${firstVisit?'first':''}`} ref={entryRef} onClick={onClick}></div>
  );
}

export default memo(StudyParkEntryAnimate);

import React, { useRef, memo, useEffect } from 'react';
import ZmModal from 'components/zmModal';
import SVGA from 'svgaplayerweb';
import './index.scss';
import loading from '../../statics/common/mp3/loading.svga';

function KidLoading (props) {
  const svgaDiv = useRef(null);
  useEffect(() => {
    let player = new SVGA.Player(svgaDiv.current);
    let parser = new SVGA.Parser(svgaDiv.current);
    parser.load(loading, (videoItem) => {
      player.loops = 1;
      player.setVideoItem(videoItem);
      player.startAnimation();
    });
    return () => {
      parser.load(loading, (videoItem) => {
        player.onFinished(() => {
          player.setVideoItem(videoItem);
          player.stopAnimation();
          player.clear();
          parser = null;
          videoItem = null;
          player = null;
        })
      })
    }
  }, [props.loading]);

  return (
    props.loading && <ZmModal visible={props.loading}>
      <div ref={svgaDiv} className="svga" />
    </ZmModal>
  );
}

export default memo(KidLoading);

import React from 'react';
import { routerRedux } from 'dva/router';
import KidHeader from 'components/kidHeader';
import ZmModal from 'components/zmModal';
import { connect } from 'dva';
import { clickVoice } from 'utils/helpfunc';
import { tipList, stopStream, testTip } from './constanst';
import sound from './sound.svga';
import testSound from './test1.mp3';
import './style.scss';

let CIRCLE_VALUE = 0;
const recordingTime = 5;// 麦克风测试录音时长
const GiveNativeMsg = {
  'camera name': '',
  'camera id': '',
  'mic name': '',
  'mic id': '',
  'speaker name': '',
  'speaker id': '',
};
class KidDeviceTest extends React.Component {
  state = {
    helpModal: false,
    seeModal: false,
    unfinishedmodal: false,
    showorhidevideo: false,
    showorhidespeaker: false,
    showorhidemicro: false,
    selectedvideo: { deviceId: '', text: '' }, // 摄像头
    selectedspeaker: { deviceId: '', text: '' }, // 耳机扬声器
    selectedmicro: { deviceId: '', text: '' }, // 话筒
    voptions: [],
    soptions: [],
    moptions: [],
    showrecordbutton: false,
    recording: false, // 录音中，css动画
    clicktype: '',
    receivefrequency: 0,
    receiveSound: false,
    microTesting: false,
    stepsWarning: false,
    circleDone: false, // 录音灰色圆环是否已绘制
    step: 0,
    result: [0, 0, 0],
  }

  componentDidMount() {
    if (JSON.parse(localStorage.getItem('testready'))) {
      this.initDeveceOptions();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // 修改多摄像头选择失效问题
    const selectedVideo = this.state.selectedvideo;
    if (this.state.step == 0 && selectedVideo.deviceId) {
      this.playVideo(selectedVideo);
    }
    if (this.state.step == 2 && !this.state.circleDone) {
      this.drawCircle();
      this.setState({
        circleDone: true,
      });
    }
    if (this.state.step == 1) {
      import('svgaplayerweb').then((SVGA) => {
        const player = new SVGA.Player(this.sound);
        const parser = new SVGA.Parser(this.sound);
        parser.load(sound, (videoItem) => {
          player.setVideoItem(videoItem);
        });
      })
    }
  }

  initTesting = (bool) => {
    this.setState({
      result: [0, 0, 0],
      step: 0,
      circleDone: false, // 录音灰色圆环是否已绘制
      recording: false, // 录音中，css动画
      recordingProgress: 0, // 录音进度
      recordPlay: false, //
      micWarning: false,
    });
    this.initDeveceOptions();
  }

  handleHelp = () => {
    clickVoice();
    this.setState({ helpModal: true });
  }

  handleCloseHelp = () => {
    clickVoice();
    this.setState({ helpModal: false });
  }

  renderHelpTip = () => {
    return (
      <div id="help-box">
        <div className="ellipse" />
        <div className="text-world">
          <span dangerouslySetInnerHTML={{ __html: tipList[0] }} />
        </div>
        <div className="bottom-btns" onClick={this.handleCloseHelp}>我知道啦</div>
      </div>
    );
  }

  renderRight = () => {
    return (
      <div className="help" onClick={this.handleHelp} />
    );
  }

  handleBeginTest = () => {
    clickVoice();
    this.initDeveceOptions();
    localStorage.setItem('testready', true);
    this.setState({});
  }

  initDeveceOptions = () => {
    let videoOptions = [];
    let speakerOptions = [];
    let microOtions = [];
    stopStream(window.VIDEO_STREAM);
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      console.log('audio', deviceInfos);
      videoOptions = deviceInfos.filter(item => item.kind === 'videoinput');
      speakerOptions = deviceInfos.filter(item => item.kind === 'audiooutput' && item.label !== 'Default' && item.label !== 'Communications' && item.label !== 'Realtek Digital Output (Realtek High Definition Audio)');
      microOtions = deviceInfos.filter(item => item.kind === 'audioinput' && item.label !== 'Default' && item.label !== 'Communications');
      const speakerId = speakerOptions.length > 0 ? speakerOptions[0].deviceId : '';

      const speakerLabel = speakerOptions.length > 0 ? speakerOptions[0].label : '';
      const videoId = videoOptions.length > 0 ? videoOptions[0].deviceId : '';
      const videoLabel = videoOptions.length > 0 ? videoOptions[0].label : '';
      const microId = microOtions.length > 0 ? microOtions[0].deviceId : '';
      const microLabel = microOtions.length > 0 ? microOtions[0].label : '';
      this.setState({
        voptions: videoOptions,
        soptions: speakerOptions,
        moptions: microOtions,
        selectedspeaker: {
          deviceId: speakerId,
          text: speakerLabel,
        },
        selectedvideo: {
          deviceId: videoId,
          text: videoLabel,
        },
        selectedmicro: {
          deviceId: microId,
          text: microLabel,
        },
      });
      this.playVideo(this.state.selectedvideo);
      this.giveDeviceInfoToNative('video', { id: videoId, label: videoLabel });
      this.giveDeviceInfoToNative('voiceinput', { id: microId, label: microLabel });
      this.giveDeviceInfoToNative('voiceoutput', { id: speakerId, label: speakerLabel });
      localStorage.setItem('ss.media.audio_source_id', microId);
    }).catch((err) => {
      console.log(`${err.name}: ${err.message}`);
    });
  }

  playVideo = (selectedvideo) => {
    const video = this.videotape;
    const constraints = {
      video: { deviceId: selectedvideo.deviceId ? { exact: selectedvideo.deviceId } : undefined },
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      window.VIDEO_STREAM = stream;
      if ('srcObject' in video) {
        video.srcObject = stream;
      } else {
        video.src = window.URL.createObjectURL(stream);
      }
      video.onloadedmetadata = function (e) {
        video.play();
      };
    }).catch((err) => {
      console.log(`${err.name}: ${err.message}`);
    });
    localStorage.setItem('ss.media.video_source_id', selectedvideo.deviceId);
  }

  giveDeviceInfoToNative = (name, data) => {
    // console.log('giveDeviceInfoToNative', name, data);
    if (name === 'video') {
      GiveNativeMsg['camera name'] = data.label;
      GiveNativeMsg['camera id'] = data.id;
    } else if (name === 'audioinput') {
      GiveNativeMsg['mic name'] = data.label;
      GiveNativeMsg['mic id'] = data.id;
    } else if (name === 'audiooutput') {
      GiveNativeMsg['speaker name'] = data.label;
      GiveNativeMsg['speaker id'] = data.id;
    }
    localStorage.setItem('giveDeviceInfoToNative', JSON.stringify(GiveNativeMsg));
  }

  renderBeginTest = () => {
    return (
      <div className="test-warper">
        <div className="title-tip">
          <p>为了保证您能正常上课、需要检测您的扬声器、摄像头等设备</p>
          <p>请先准备好摄像头、耳机、麦克风</p>
        </div>
        <div className="device">
          <div className="device-box">
            <div className="common camera" />
            <div className="device-name">摄像头</div>
          </div>
          <div className="device-box">
            <div className="common headset" />
            <div className="device-name">耳机</div>
          </div>
          <div className="device-box">
            <div className="common microphone" />
            <div className="device-name">麦克风</div>
          </div>
        </div>
        <div className="bottom-button" onClick={this.handleBeginTest}>已经准备好了，开始检测</div>
      </div>
    );
  }

  handleNoSee = () => {
    clickVoice();
    this.setState({ seeModal: true });
  }

  handleChange = (id, label) => {
    this.setState({
      selectedvideo: {
        deviceId: id,
        text: label,
      },
    });
    // this.playVideo(this.state.selectedvideo);
    this.giveDeviceInfoToNative('video', { id, label });
    localStorage.setItem('ss.media.video_source_id', id);
  }

  selectVideo = (e) => {
    e.stopPropagation();
    this.setState({
      showorhidevideo: !this.state.showorhidevideo,
    });
  }

  renderCameraTest = () => {
    const { selectedvideo, voptions, showorhidevideo } = this.state;
    return (
      <div className="device-test">
        <span className="tip-case">如果看不到，请换一个摄像头再试试</span>
        <div className={`select-video ${showorhidevideo ? 'active' : ''}`} onClick={e => this.selectVideo(e)}>
          <span className="select">{selectedvideo.text}</span>
          {
            showorhidevideo
            && (
            <div className="option-list">
              {voptions.map((item, index) => (
                <div
                  className={`option ${selectedvideo.deviceId === item.deviceId ? 'active' : ''}`}
                  key={index}
                  onClick={() => this.handleChange(item.deviceId, item.label)}
                >
                  {item.label}
                </div>
              ))}
            </div>
            )
          }
        </div>
        <div className="video-wrap">
          <video src="" ref={ele => this.videotape = ele} />
        </div>
        <div className="device-buttons">
          <div className="no-see" onClick={this.handleNoSee}>看不见</div>
          <div className="can-see" onClick={() => this.handleNext(true)}>看得见</div>
        </div>
      </div>
    );
  }

  handleSound = () => {
    import('svgaplayerweb').then((SVGA) => {
      const player = new SVGA.Player(this.sound);
      const parser = new SVGA.Parser(this.sound);
      const audio = this.testaudio;

      if (audio && audio.paused) {
        audio.play();
        parser.load(sound, (videoItem) => {
          player.setVideoItem(videoItem);
          player.startAnimation();
        });
        clearTimeout(this.STO);
        this.STO = setTimeout(() => {
          parser.load(sound, (videoItem) => {
            player.setVideoItem(videoItem);
            player.stopAnimation();
          });
        }, 3000);
      }
    })
  }

  selectSpeaker = (e) => {
    e.stopPropagation();
    this.setState({
      showorhidespeaker: !this.state.showorhidespeaker,
    });
  }

  handleSpeaker = (id, label) => {
    this.setState({
      selectedspeaker: {
        deviceId: id,
        text: label,
      },
    });
    this.giveDeviceInfoToNative('audiooutput', { id, label });
  }

  renderHeadsetTest = () => {
    const { selectedspeaker, showorhidespeaker, soptions } = this.state;
    return (
      <div className="device-test">
        <span className="tip-case">如果听不到，请切换另一个扬声器再试试</span>
        <div className={`select-video ${showorhidespeaker ? 'active' : ''}`} onClick={this.selectSpeaker}>
          <span className="select">{selectedspeaker.text}</span>
          {
            showorhidespeaker
            && (
            <div className="option-list">
              {soptions.map((item, index) => (
                <div
                  className={`option ${selectedspeaker.deviceId === item.deviceId ? 'active' : ''}`}
                  key={index}
                  onClick={() => this.handleSpeaker(item.deviceId, item.label)}
                >
                  {item.label}
                </div>
              ))}
            </div>
            )
          }
        </div>
        <div className="speaker-wrap">
          <div className="speaker" ref={ele => this.sound = ele} onClick={this.handleSound}>
            <audio src={testSound} ref={ele => this.testaudio = ele} />
          </div>
          <div className="speaker-text">点击播放</div>
        </div>
        <div className="device-buttons">
          <div className="no-see" onClick={this.handleNoSee}>听不见</div>
          <div className="can-see" onClick={() => this.handleNext(true)}>听得见</div>
        </div>
      </div>
    );
  }

  stopRecording = () => {
    if (!this.state.recording) {
      return;
    }
    clearInterval(this.timer);
    if (window.AUDIO_RECORDER && window.AUDIO_RECORDER.state == 'recording') {
      window.AUDIO_RECORDER.stop();
    }
    stopStream(window.AUDIO_STREAM);
    this.setState({
      recording: false,
      recordPlay: true,
      receiveSound: false,
      micWarning: !this.state.receiveSound,
    });
  }

  drawCircle = () => {
    const { canvas } = this;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.clearRect(0, 0, 190, 190);
    ctx.arc(95, 95, 85, 0, Math.PI * 2, true);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#FFE2A8';
    ctx.stroke();
    ctx.closePath();
  }

  drawCanvas = () => {
    if (CIRCLE_VALUE > 100) {
      clearInterval(this.timer);
      setTimeout(() => this.autoclick.click(), 100);
      this.setState({
        clicktype: 'auto',
        receivefrequency: 0,
        showrecordbutton: true,
        showrecordbutton: !!this.state.receiveSound,
        microTesting: false,
      });
      if (!this.state.receiveSound) {
        this.setState({ seeModal: true });
      }

      this.stopRecording();
      return false;
    }
    const rate = (CIRCLE_VALUE + 1) / 100;
    const value = rate * Math.PI * 2;
    const endColor = 'rgb(255,94,101)';
    const angle = value - Math.PI / 2;
    this.drawCircle();
    const { canvas } = this;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(95, 95, 85, -0.5 * Math.PI, angle, false);
    const grd = ctx.createLinearGradient(255, 94, 101, 1);
    grd.addColorStop('0', 'rgb(255,94,101)');
    grd.addColorStop('1', endColor);
    ctx.strokeStyle = grd;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();
    CIRCLE_VALUE += 1;
  }

  playRecordingAudio = () => {
    const audio = this.micTest;
    // 判断音频是否播放完毕
    audio.addEventListener('ended', () => this.setState({
      microTesting: true,
    }), false);
    if (this.state.clicktype !== 'auto') {
      this.setState({
        microTesting: !this.state.microTesting,
      });
    }
    if (audio && audio.paused) {
      audio.play();
      this.setState({
        clicktype: 'click',
      });
    } else {
      audio.pause();
    }
  }

  recordVoice = (audioSource) => {
    const audio = this.micTest;
    const getSound = (level) => {
      this.setState({
        receiveSound: true,
      });
    };

    const constraints = {
      audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        window.AUDIO_STREAM = stream;
        const recorder = new MediaRecorder(stream);
        window.AUDIO_RECORDER = recorder;
        let buffers = [];
        recorder.ondataavailable = function (event) {
          buffers.push(event.data);
        };
        recorder.onstop = function () {
          const blob = new Blob(buffers, { type: 'audio/ogg; codecs=opus' });
          const url = URL.createObjectURL(blob);
          audio.src = url;

          buffers = [];
        };
        if (!window.audioContext) {
          window.audioContext = new AudioContext();
        }
        const source = audioContext.createMediaStreamSource(stream);
        const destination = audioContext.createMediaStreamDestination();
        const node = audioContext.createScriptProcessor(16384, 1, 1);
        const analyser = audioContext.createAnalyser();
        let lastVolLevel = 0;
        const handleProcess = (event) => {
          if (!this.state.recording) {
            node.removeEventListener('audioprocess', handleProcess);
            return;
          }
          const array = new Uint8Array(analyser.frequencyBinCount);
          let values = 0;
          // console.log('array',array)
          analyser.getByteFrequencyData(array);
          const { length } = array;

          for (let i = 0; i < length; i++) {
            values += array[i];
          }
          const level = Math.floor(values / length);
          this.setState({
            receivefrequency: level,
          });
          if (level != lastVolLevel) {
            getSound(level);
            console.log('收录音变化：', lastVolLevel, level);
            lastVolLevel = level;
          }
        };
        node.addEventListener('audioprocess', handleProcess);
        let lastNode = source;
        if (analyser) {
          source.connect(analyser);
          lastNode = analyser;
        }
        lastNode.connect(node);
        node.connect(audioContext.destination);
        recorder.start();
      }).catch((err) => {
        console.log(`${err.name}: ${err.message}`);
      });
  }

  drawCanvasInterval = () => {
    localStorage.setItem('zm-chat-kid-testmicroguide', true);
    if (this.state.recording) return;
    this.setState({
      recording: true,
      receiveSound: false,
      showrecordbutton: false,
    });
    CIRCLE_VALUE = 0;
    const audio = this.micTest;
    if (audio && !audio.paused) {
      audio.pause();
      this.setState({
        clicktype: 'auto',
        recordPlay: !this.state.recordPlay,
      });
    } else {
      audio.pause();
    }
    this.recordVoice(this.state.selectedmicro.deviceId);
    this.timer = setInterval(this.drawCanvas, recordingTime * 1000 / 100);
  }

  handleMicro = (id, label) => {
    this.setState({
      selectedmicro: {
        deviceId: id,
        text: label,
      },
    });
    this.recordVoice(id);
    this.giveDeviceInfoToNative('audioinput', { id, label });
    localStorage.setItem('ss.media.audio_source_id', id);
  }

  selectMicro = (e) => {
    e.stopPropagation();
    this.setState({
      showorhidemicro: !this.state.showorhidemicro,
    });
  }

  renderMicrophone = () => {
    const { selectedmicro, showorhidemicro, showrecordbutton, microTesting, receivefrequency, moptions } = this.state;
    return (
      <div className="device-test">
        <span className="tip-case">如果听不到，请切换另一个扬声器再试试</span>
        <div className={`select-video ${showorhidemicro ? 'active' : ''}`} onClick={e => this.selectMicro(e)}>
          <span className="select">{selectedmicro.text}</span>
          {
            showorhidemicro
            && (
            <div className="option-list">
              {moptions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => this.handleMicro(item.deviceId, item.label)}
                  className={`option ${selectedmicro.deviceId === item.deviceId ? 'active' : ''}`}
                >
                  {item.label}
                </div>
              ))}
            </div>
            )
          }
        </div>
        <div className="microphone-wrap">
          <audio src="" id="micTest" ref={ele => this.micTest = ele} />
          <div className={`microphone ${localStorage.getItem('zm-chat-kid-testmicroguide') ? '' : 'guide'}`} style={{ left: showrecordbutton ? '-48px' : 0 }}>
            <canvas ref={ele => this.canvas = ele} width="190" height="190" className={`${localStorage.getItem('zm-chat-kid-testmicroguide') ? '' : 'show'}`} />
            <a onMouseDown={this.drawCanvasInterval}>
              <div className="mic-icon" />
            </a>
            <span className="long-press">点击录音</span>
            <div className="volume-bar">
              <div className="volume-levels path">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="volume-value" style={{ width: receivefrequency ? `${receivefrequency * 3}%` : 0 }}>
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
            { showrecordbutton
              && (
              <a className={`play ${microTesting ? 'pause' : ''}`} ref={ele => this.autoclick = ele} onClick={() => this.playRecordingAudio()}>
                <span>
                  {microTesting ? '播放' : '暂停'}
                  录音
                </span>
              </a>
              )
            }
          </div>
        </div>
        <div className="device-buttons">
          <div className="no-see" onClick={this.handleNoSee}>听不见</div>
          <div className="can-see" onClick={() => this.handleNext(true)}>听得见</div>
        </div>
      </div>
    );
  }

  renderZmTip = () => {
    const { step } = this.state;
    return (
      <div className="test-tip">
        <span className={`${step == 2 ? 'special' : ''}`}>{testTip[step]}</span>
        {
          step == 2
          && (
          <div className="step-tip">
            <span>掌门少儿</span>
            <span>让孩子爱上学习</span>
          </div>
          )
        }
      </div>
    );
  }

  handleSwitch = (num) => {
    const res = this.state.result;
    this.setState({
      step: num,
      soundTesting: false,
      receivefrequency: 0,
      showorhidevideo: false,
      showorhidespeaker: false,
      showorhidemicro: false,
    });
    if (num !== 0) {
      stopStream(window.VIDEO_STREAM);
    } else if (num == 0) {
      this.setState({
      }, () => {
        this.playVideo(this.state.selectedvideo);
      });
    }
    if (num != 2) {
      clearInterval(this.timer);
      this.stopRecording();
      stopStream(window.AUDIO_STREAM);
    }

    const rest = res.map((item, index) => {
      if (index == num || this.state.step == num) return;
      if (item != 1) {
        res[index] = -1;
      }
      return res;
    });
  }

  renderTest = () => {
    const { step, result } = this.state;
    return (
      <div className={`camera-box ${step > 0 ? 'headset-box' : ''}`}>
        <div className="top-device">
          <div className={`${step == 0 ? 'circle' : 'normal'}`}>
            <div className={`common-style test-camera passes${result[0]}`} onClick={() => this.handleSwitch(0)} />
          </div>
          <div className="line" />
          <div className={`${step == 1 ? 'circle' : 'normal'}`}>
            <div className={`common-style test-headset passes${result[1]}`} onClick={() => this.handleSwitch(1)} />
          </div>
          <div className="line" />
          <div className={`${step == 2 ? 'circle' : 'normal'}`}>
            <div className="common-style test-microphone" onClick={() => this.handleSwitch(2)} />
          </div>
        </div>
        {step === 0 && this.renderCameraTest()}
        {step === 1 && this.renderHeadsetTest()}
        {step === 2 && this.renderMicrophone()}
        {this.renderZmTip()}
      </div>
    );
  }

  handleNext = (bool) => {
    clickVoice();
    const res = this.state.result;
    if (this.state.step === 0) {
      stopStream(window.VIDEO_STREAM);
    }
    if (this.state.step == 2) {
      clearInterval(this.timer);
      this.stopRecording();
      stopStream(window.AUDIO_STREAM);
    }
    res[this.state.step] = bool ? 1 : -1;

    this.setState({
      step: this.state.step + 1,
      result: res,
      soundTesting: false,
      stepsWarning: false,
      showrecordbutton: false,
      showorhidevideo: false,
      showorhidespeaker: false,
      showorhidemicro: false,
      seeModal: false,
    });
  }

  handleRepeatTest = () => {
    clickVoice();
    this.setState({ seeModal: false });
  }

  renderSeeModal = () => {
    const { step } = this.state;
    return (
      <div id="help-box">
        <div className="ellipse" />
        <div className="text-world">
          <span dangerouslySetInnerHTML={{ __html: tipList[step] }} />
        </div>
        {
          step !== 2
            ? (
              <div className="see-buttons">
                <div className="test-next" onClick={() => this.handleNext(false)}>测试下一项</div>
                <div className="test-repeat" onClick={this.handleRepeatTest}>重新测试</div>
              </div>
            )
            : (
              <div className="see-buttons">
                <div className="test-next" onClick={() => this.handleNext(false)}>查看结果</div>
                <div className="test-repeat" onClick={this.handleRepeatTest}>再次测试</div>
              </div>
            )
        }

      </div>
    );
  }

  handleOk = () => {
    clickVoice();
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/kid',
      state: {
        from: '/kid/kiddevicetest',
      },
    }));
  }

  renderResult = () => {
    const { result } = this.state;
    const final = result.every(e => e > 0);
    return (final
      ? (
        <div className="test-result">
          <div className="success-box">
            <div className="success-top" />
            <div className="gongxi">恭喜您，设备检测通过啦！</div>
            <div className="success-tip">不要忘记上课哦，上课前20分钟可以进入课堂</div>
            <div className="success-button" onClick={this.handleOk}>知道啦</div>
          </div>
        </div>
      )
      : (
        <div className="test-faile">
          <div className="fail-box">
            <div className="fail-top">很遗憾，设备检测未通过！</div>
            <div className="fail-center">
              <div className="fail-left">
                <div className="top">摄像头有问题</div>
                <div className="bottom">
                  <div className="fail-text">1.请确认摄像头是否插入了正确的插孔</div>
                  <div className="fail-text">2.并确认系统中是否禁用了摄像头</div>
                  <div className="fail-text">3.或是尝试切换其他设备。</div>
                </div>
              </div>
              <div className="fail-right">
                <div className="top">扬声器有问题</div>
                <div className="bottom">
                  <div className="fail-text">1.请确认耳机是否插入了正确的插孔</div>
                  <div className="fail-text">2.并确认是否设置了系统静音</div>
                  <div className="fail-text">3.尝试切换其他音频设备</div>
                </div>
              </div>
            </div>
            <div className="fail-bottom">
              <div className="fail-left">
                <div className="top">麦克风有问题</div>
                <div className="bottom">
                  <div className="fail-text">1.请确认麦克风是否插入了正确的插孔</div>
                  <div className="fail-text">2.并确认是否设置了系统静音</div>
                  <div className="fail-text">3.尝试切换其他麦克风设备。</div>
                </div>
              </div>
              <div className="fail-right">
                <div className="exit" onClick={this.handleOk}>退出</div>
                <div className="aggin" onClick={this.initTesting}>再测一次</div>
              </div>
            </div>
          </div>
          {this.renderZmTip()}
        </div>
      )
    );
  }

  goBack = () => {
    clickVoice();
    const { dispatch } = this.props;
    const { step } = this.state;
    const testReady = JSON.parse(localStorage.getItem('testready'));
    if (!testReady) {
      dispatch(routerRedux.push({
        pathname: '/kid',
        state: {
          from: '/kid/kiddevicetest',
        },
      }));
      return;
    }

    if (step == 0 || step == 1 || step == 2) {
      this.setState({
        unfinishedmodal: !this.state.unfinishedmodal,
      });
      return;
    }
    dispatch(routerRedux.push({
      pathname: '/kid',
      state: {
        from: '/kid/kiddevicetest',
      },
    }));
  }

  handleGoTest = () => {
    clickVoice();
    this.setState({ unfinishedmodal: !this.state.unfinishedmodal });
  }

  handleLeave = () => {
    clickVoice();
    const { dispatch } = this.props;
    stopStream(window.VIDEO_STREAM);
    stopStream(window.AUDIO_STREAM);
    dispatch(routerRedux.push({
      pathname: '/kid',
      state: {
        from: '/kid/kiddevicetest',
      },
    }));
  }

  renderUnfinished = () => {
    return (
      <div id="help-box">
        <div className="ellipse" />
        <div className="unfinished">
          <div>设备测试尚未完成，可能影响上课</div>
          <div>效果，是否确认离开</div>
        </div>
        <div className="see-buttons">
          <div className="test-next" onClick={this.handleLeave}>确认离开</div>
          <div className="test-repeat" onClick={this.handleGoTest}>继续测试</div>
        </div>
      </div>
    );
  }

  render() {
    const { history } = this.props;
    const { helpModal, seeModal, unfinishedmodal, step } = this.state;
    return (
      <div id="kiddevicetest">
        <KidHeader center="设备检测" history={history} goBack={() => this.goBack()} right={this.renderRight()} />
        <div className="content-bottom">
          {step == 3
            ? this.renderResult()
            : JSON.parse(localStorage.getItem('testready')) ? this.renderTest() : this.renderBeginTest()
          }

        </div>
        {
          helpModal
          && (
          <ZmModal visible={helpModal}>
            {this.renderHelpTip()}
          </ZmModal>
          )
        }
        {
          seeModal
          && (
          <ZmModal visible={seeModal}>
            {this.renderSeeModal()}
          </ZmModal>
          )
        }
        {
          unfinishedmodal
          && (
          <ZmModal visible={unfinishedmodal}>
            {this.renderUnfinished()}
          </ZmModal>
          )
        }
      </div>
    );
  }
}

function mapStateToProps({ kiddevicetest }) {
  return { kiddevicetest };
}

export default connect(mapStateToProps)(KidDeviceTest);

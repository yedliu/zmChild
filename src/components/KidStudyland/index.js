import React from 'react';
import ZmModal from 'components/zmModal';
import KidButton from 'components/KidButton';
import { connect } from 'dva';
import StudyParkAnimate from 'components/KidStudyparkEntry';
import NewProtal from '../zmModal/newProtal';
import studyEntry from '../../statics/common/mp3/studyentry.mp3'
import './style.scss';

class Studyland extends React.PureComponent {
    constructor (props) {
        super(props);
        this.state = {
            guideVisible: false,
            stopAnimate:false
        }
        this.soundPlayed = false;
    }
    closeGuide = () => {
        this.setState({ guideVisible: false });
    }
    componentDidMount() {
        //检测是否第一次进入首页-学习乐园引导
        const fistVisit = localStorage.getItem('first-visit') === null;
        this.setState({ guideVisible: fistVisit });
        const audio = this.entryAudio;
        setTimeout(()=>{
            localStorage.setItem('first-visit','');
        },0);
        // if (audio && audio.paused) {
        //     audio.play();
        //     audio.addEventListener('ended',()=>{
        //         //暂停动画
        //         console.log('end of audio')
        //         this.setState({stopAnimate:true});
        //     });
        // }
    }
    componentDidUpdate(){
        console.log('update');
        if(this.soundPlayed){
            return;
        }
        const audio = this.entryAudio;
        if (audio && audio.paused) {
            audio.play().catch(err=>{
                console.log('audio play error:',err);
            });
            this.soundPlayed = true;
            audio.addEventListener('ended',()=>{
                //暂停动画
                console.log('end of audio')
                this.setState({stopAnimate:true});
            });
        }
    }
    onHandleClose = ()=>{
        const {onClose=()=>{}} = this.props;
        this.entryAudio&&this.entryAudio.pause();
        onClose();
    }
    render() {
        const { loading } = this.props;
        const { guideVisible, stopAnimate } = this.state;
        return (
            <React.Fragment>
            {guideVisible && !loading&&<audio src={studyEntry} style={{display:'none'}} ref={ele => this.entryAudio = ele} />}
            <ZmModal visible={guideVisible && !loading} style={{opacity:'0.7'}}>
                <div className="entry-wrapper">
                    <div className="guide">
                        <div className="cloud">
                            <p>小朋友，这里是为你创造的掌门“学习<br />乐园”哦，
                            小学伴也住进里面了，快去看看吧~</p>
                            <KidButton handleClick={this.onHandleClose}>知道了</KidButton>
                        </div>
                        <div className="arrow"></div>
                        <StudyParkAnimate stop={stopAnimate}/>
                    </div>
                </div>
            </ZmModal>
            </React.Fragment>
        )
    }
}

const mapStateToProps = ({ loading }) => {
    return {
        loading: loading.global && !loading.models.Verify
    }
}
export default connect(mapStateToProps)(Studyland);
import cateitem from './images/fenlei1_bg@2x.png'
import pool from './images/yongchi@2x.png'
import wrong1 from './images/wrong1@2x.png'
import wrong2 from './images/wrong2@2x.png'
import right2 from './imagesbeach/right2@2x.png'

const centerBeforeAfter = `
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
`
const clearfix = `&:after{
  content:'';
  display:block;
  width:0;
  clear:both;
}`
const _categoryStyle = `

        .cate-target-list{
            width:656px;
            margin:0 auto;
            margin-top:15px;
            text-align:center;
            ${clearfix}
            .cate-target{
                position:relative;
                display:inline-block;
                width:130px;
                height:160px;
                padding:15px 0 15px;
                background:url(${cateitem}) no-repeat;
                background-size:100% 100%;
                transition:all .2s linear;
                vertical-align: top;
                &.right{
                    &:before{
                        content:"";
                        display:inline-block;
                        position:absolute;
                        width:46px;
                        height:46px;
                        top:10px;
                        right:-6px;
                        background-image:url(${right2});
                        background-repeat:no-repeat;
                        background-size:100%;
                    }
                }
                .cate-title{
                    height:39px;
                    font-size:14px;
                    text-align:center;
                    color:#68200B;
                    padding: 0 8px;
                    line-height:1;
                    .cate-title-text{
                        display:inline-block;
                        vertical-align:middle;
                    }
                    &:after{
                        content:'';
                        display:inline-block;
                        height:100%;
                        vertical-align:middle;
                    }
                }
                &.scale{
                    transform:scale(1.1);
                }
                .cate-inner{
                    height:95px;
                    margin:0 18px;
                    text-align:left;
                    &::-webkit-scrollbar {
                        display: none;
                    }
                }
                .cate-option{
                    position:relative;
                    display:inline-block;
                    width:42px;
                    height:42px;
                    margin:2px;
                    font-size:12px;
                    text-align:center;
                    vertical-align:top;
                    background-color:#fff;
                    z-index:20;
                    img{
                        height:100%;
                        width:100%;
                        pointer-events: none;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -webkit-user-select:none;
                        -o-user-select:none;
                        user-select:none;
                    }
                    .wrong-tag{
                        display:none;
                    }
                    &.wrong{
                        border-radius:2px;
                        &:before{
                            position:absolute;
                            content:'';
                            display:inline-block;
                            width:100%;
                            height:100%;
                            left:0;
                            top:0;
                            background-color:rgba(238 ,44 ,44 , .3);
                            border:2px solid #ff0005;
                            box-sizing: border-box;
                        }
                        .wrong-tag{
                            display:inline-block;
                            position:absolute;
                            content:'';
                            width:31px;
                            height:31px;
                            bottom:-8px;
                            right:-8px;
                            background-image:url(${wrong1});
                            background-repeat:no-repeat;
                            background-size:100%;
                        }
                    }
                }
            }
            .scale{
                // transform:scale(1.1)
            }
        }
        .cate-pool{
            width:748px;
            height:360px;
            padding:32px;
            margin:0 auto;
            margin-top:15px;
            background:url(${pool}) no-repeat;
            background-size:100% 100%;
            .cate-option{
                display:inline-block;
                width:80px;
                height:80px;
                margin:4px;
                font-size:14px;
                text-align:center;
                vertical-align:top;
                overflow:hidden;
                background-color:#fff;
                img{
                    height:100%;
                    width:100%;
                    pointer-events: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -webkit-user-select:none;
                    -o-user-select:none;
                    user-select:none;
                }
            }
        }
        .cate-option{
            .cate-text{
                display:inline-block;
                vertical-align:middle;
                line-height:1.3;
                max-height:100%;
                overflow:hidden;
            }
            &:after{
                content:'';
                display:inline-block;
                height:100%;
                width:0;
                vertical-align:middle;
            }
        }
        .operation{
                padding-top:8px;
                text-align:center;
                .view-answer{
                    position:relative
                    display:inline-block;
                    width:80px;
                    height:24px;
                    background-color:#EF4C4F;
                    border:1px solid #983434;
                    border-radius:12px;
                    &:after{
                        position:absolute;
                        display:block;
                        height:24px;
                        width:100%;
                        line-height:24px;
                        content:'查看答案';
                        font-size:16px;
                        text-align:center;
                        color:#fff;
                    }
                }
                .back-answer{
                    width:108px;
                    height:24px;
                    background-color:#EF4C4F;
                    border:1px solid #983434;
                    border-radius:12px;
                    &:after{
                        position:absolute;
                        display:block;
                        width:100%;
                        height:24px;
                        line-height:24px;
                        content:'返回我的答案';
                        font-size:16px;
                        text-align:center;
                        color:#fff;
                    }
                }
        }
`
const categoryStyle = _categoryStyle.replace(/\d+px/g, v => `${parseInt(parseInt(v) / 786 * 1200)}px`)

export default categoryStyle

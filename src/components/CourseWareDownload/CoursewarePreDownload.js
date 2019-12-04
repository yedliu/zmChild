import React, { PureComponent, Fragment } from 'react';
import { AppLocalStorage } from 'utils/localStorage';
import { getClientVersion } from 'zmNativeBridge';
import eventBus from './eventBus';
import SuperWorker from './SuperWorker';
import {
  storageParam,
  checkVersionAndPlatform,
  fetchCourseWareListForLocal,
} from './server';
import TipModal from './TipModal';
import CoursewareDownloadPannel from './CoursewareDownloadPannel';

export function checkEnvironment() {
  const notXpClient = getClientVersion().indexOf('xp') !== 0;
  return window.process
    && (window.process.platform === 'win32' || window.process.platform === 'darwin')
    && notXpClient
    && window.ZmResourcesLocalization
    && AppLocalStorage.getRole() === 'student';
}

function getRemote() {
  try{
    const electron = window.require('electron');
    return electron.remote;
  }catch(err){
    return {}
  }
}

function requestUrl(url, su, fa) {
  const req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.timeout = 5000;

  req.onload = function () {
    su(1);
  };
  req.onerror = function () {
    fa(2);
  };
  req.ontimeout = function () {
    fa(3);
  };
  req.send(null);
}

export default class CoursewarePreDownload extends PureComponent {
  constructor(props) {
    super(props);
    const doNotShowTip = JSON.parse(sessionStorage.getItem('ZmgDoNotShowTip'));
    let showTip = true;
    if (doNotShowTip === true) {
      showTip = false;
    }
    this.state = {
      showTip,
      isDownloadPannelVisible: false,
      fileList: [],
      fetchError: false,
    };
    this.currentDownloadIndex = 0;
    this.secondLoading = false;
    this.doNotShowTip = doNotShowTip;

    this.path = getRemote().require('path');
    this.fs = getRemote().require('fs');
    this.https = getRemote().require('https');
    this.codeIgnore = false;
  }

  async componentDidMount() {
    eventBus.removeListener('stop_render');

    // 检查环境是否满足条件
    if (checkEnvironment()) {
      const secondLoading = sessionStorage.getItem('secondLoading');
      if (!secondLoading) {
        // 获取remote模块与主进程通信，启动http服务器
        this.startHttpServer();
        // 测试http服务器是否创建成功
        this.detectHttpServer();
        // 删除超过7天的数据
        this.cleanLocalCourseware(7);
        // 检查app版本和平台
        // this.checkVersionAndPlatform();
      } else {
        if (this.doNotShowTip === true) return;
        // 第二次加载该组件，直接启动获取课程列表下载
        // this.secondLoading = secondLoading;
        // sessionStorage.removeItem('secondLoading');
        this.startHttpServer();
        // const coursewareList = await this.getCourseWareListForLocal();
        // const hasUnfinishedDownload = coursewareList.some(item => !item.zipAlreadyExists);
        // if (hasUnfinishedDownload) {
        //   this.setState({
        //     isDownloadPannelVisible: true,
        //   });
        //   this.handleDownloadLocalZmg();
        // }
      }
      eventBus.addListener('stop_render', () => {
        this.stopRender = true;
      });
    }
  }


  componentWillUnmount() {
    // 组件被卸载后，课件将继续被下载。为防止下载函数中setState出错，将this.stopRender设置为false
    eventBus.emit('stop_render');
    if (this.req && this.req.destroy) {
      this.req.destroy();
    }
    sessionStorage.setItem('secondLoading', true);
    clearTimeout(this.hidenTimer);
  }

  startHttpServer() {
    const { path } = this;
    const savePath = path.resolve(window.process.resourcesPath, 'app/node_modules');
    const decompressionPath = path.resolve(window.process.resourcesPath, 'app');
    const zmZmgLocalLoad = this.zmZmgLocalLoad = new window.ZmResourcesLocalization(savePath, decompressionPath);
    this.superWorker = new SuperWorker(zmZmgLocalLoad.downLoadResourcesBreakpointResumePromise.bind(zmZmgLocalLoad), 1, 5, 1000);
  }

  detectHttpServer() {
    const { path, fs } = this;
    fs.exists(path.join(window.process.resourcesPath, 'app', 'node_modules', 'http-server'), (exists) => {
      if (exists) {
        this.zmZmgLocalLoad.createPort(path.join(window.process.resourcesPath, 'app'));
        const existZmgPath = fs.existsSync(path.join(window.process.resourcesPath, 'app', 'zmg'));
        if (!existZmgPath) {
          this.createLocalFolder(path.join(window.process.resourcesPath, 'app', 'zmg'));
        }
      }
    });
  }

  createLocalFolder(folderPath) {
    const { path, zmZmgLocalLoad } = this;
    try {
      zmZmgLocalLoad.createFolder(folderPath, (suc) => { console.warn('创建文件夹成功！！'); }, (err) => {
        zmZmgLocalLoad.chmodFile(path.resolve(folderPath, '../'), 0o777, (resolve) => {
          zmZmgLocalLoad.createFolder(folderPath, () => { console.warn('创建文件夹成功！！'); }, (fail) => {
            console.warn('创建文件夹失败', fail);
          });
        }, (reject) => {
          console.warn('创建文件夹失败!!', reject);
        });
      });
    } catch (e) {
      console.warn('创建文件夹失败 catch', e);
    }
  }

  cleanLocalCourseware(date = 7) {
    // 删除本地历史文件
    const { path } = this;
    const dirPath = path.join(window.process.resourcesPath, 'app', 'zmg');
    this.zmZmgLocalLoad.removeOverdueFiles(
      dirPath,
      date,
      (data) => {
        console.log('清理磁盘-suc', data);
        const accObject = {
          type: 3,
          code: 0,
          message: '课前本地化清理磁盘成功',
          otherId: 'KID_PRE_DOWNLOAD_COURSEWARE_SUCCEED',
          arguments: {
            path: dirPath,
            date,
          },
          result: data,
        };
        window.__acc2__(accObject);
      },
      (err) => {
        console.log('清理磁盘-err', err);
        const accObject = {
          type: 3,
          code: 1,
          message: '课前本地化清理磁盘异常',
          otherId: 'KID_PRE_DOWNLOAD_COURSEWARE_DISK_CLEANUP_FAILED',
          arguments: {
            path: dirPath,
            date,
          },
          result: err,
        };
        window.__acc2__(accObject);
      },
    );
  }

  checkVersionAndPlatform = () => {
    this.getCourseWareListForLocal();
  }

  getCourseWareListForLocal = async () => {
    // 获取下载课件列表并且查看课件在本地是否存在
    try {
      const { fs, path } = this;
      const response = await fetchCourseWareListForLocal();
      if (!response || !response.data || response.code !== '0') {
        throw Error('fetch courseware list error');
      }

      let resultList = [];
      resultList = response.data.filter(item => item.manifest && item.manifest.length > 10);
      if (resultList.length < 0) {
        return;
      }
      resultList = await Promise.all(
        resultList.map(async (item) => {
          const res = await fetch(item.manifest);
          const manifestJSON = await res.json();
          Object.assign(item, { manifestJSON });
          return item;
        }),
      );

      const contentPath = path.join(window.process.resourcesPath, 'app', 'zmg');
      // isFileBroken是同步任务，将它放在事件队列尾部来防止阻塞主页面加载
      await Promise.all(
        resultList.map((item) => {
          const filePath = path.join(contentPath, (item.manifestJSON.id + item.manifestJSON.version));
          return new Promise((resolve) => {
            setTimeout(() => {
              const isZipFileIsComplete = this.zipFileIsComplete(filePath, item);
              item.zipAlreadyExists = fs.existsSync(filePath) && isZipFileIsComplete;
              resolve();
            }, 1000);
          });
        }),
      );

      const newResultList = [];
      resultList.map((item, i) => {
        const videos = item.manifestJSON.videos;
        const filePath = path.join(contentPath, (item.manifestJSON.id + item.manifestJSON.version));
        newResultList.push(item);
        if (videos.length > 0) {
          videos.forEach(v => {
            newResultList.push({
              manifestJSON: {
                id: item.manifestJSON.id,
                version: item.manifestJSON.version,
                url: v.url
              },
              notShow: true,
              name: v.filename,
              type: 'video',
              zipAlreadyExists: fs.existsSync(path.join(filePath, "web-mobile", v.filename))
            });
          });
        }
      });
      this.setState({
        fileList: newResultList,
      });
      return newResultList;
    } catch (error) {
      console.log(error);
    }
  }

  // 检查文件是否损坏
  isFileBroken = (path, item) => {
    const fileCounts = this.zmZmgLocalLoad.getFileCountsOfFolder(path);
    const zipCounts = this.zmZmgLocalLoad.getFileCountsOfZip(`${path}.zip`);

    let videoCount = 0;
    if (item && item.manifestJSON && item.manifestJSON.videos) {
      videoCount = item.manifestJSON.videos.length;
    }
    const isEuqal = fileCounts === zipCounts + videoCount;
    const hasTempFile = this.hasTemporaryFiles(this.path.join(path, 'web-mobile'));
    return !isEuqal || hasTempFile;
  }

  zipFileIsComplete = (path, item) => {
    const fileCounts = this.zmZmgLocalLoad.getFileCountsOfFolder(path);
    const zipCounts = this.zmZmgLocalLoad.getFileCountsOfZip(`${path}.zip`);

    return fileCounts >= zipCounts
  }

  hasTemporaryFiles(fileFolPath) {
    try {
      const { path, fs } = this;

      if (!fs.existsSync(fileFolPath)) {
        return true;
      }
      const fileArray = fs.readdirSync(fileFolPath);
      return fileArray.some((item) => {
        const stat = fs.statSync(path.join(fileFolPath, item));
        return stat.isFile() && path.extname(path.join(fileFolPath, item)) === '.temp';
      });
    } catch (e) {
      return true;
    }
  }

  decompressionResources = false // zip文件是否解压完毕
  currentSize = 0 // 进度条的累计进度
  totalSize = 0 // 下载总大小
  showIndex = 0 // 展示列表的当前下载下标



  handleDownloadLocalZmg = async () => {
    const { path, currentDownloadIndex } = this;
    const { fileList } = this.state;
    this.showIndex = currentDownloadIndex > fileList.length ? this.showIndex + 1 : this.showIndex;
    const _this = this;

    if (!this.totalSize) {
      await Promise.all(
        fileList.map(item => {
          return new Promise(function (res, rej) {
            _this.https.get(item.manifestJSON.url, function (response) {
              res(response);
            })
          })
        })
      ).then(function (values) {
        values.forEach(x => { _this.totalSize = _this.totalSize + Number(x.headers['content-length']) })
      }).catch(e => {
        console.log('err', e);
      });
    }

    // 下载课件到本地
    if (this.stopRender) return;
    this.codeIgnore = false;
    const zmgInfo = fileList[currentDownloadIndex];
    const handleZmgInfo = fileList[0];
    if (!zmgInfo) {
      this.hidePannel();
      this.setState({ fileList: [...fileList] });
      return;
    }
    const { manifestJSON, zipAlreadyExists } = zmgInfo;
    const contentPath = path.join(window.process.resourcesPath, 'app', 'zmg');
    const type = zmgInfo.type === 'video' ? 'mp4' : 'zip';
    let pathStr = path.join(contentPath, `${manifestJSON.id}${manifestJSON.version}.zip`);
    if (type === 'mp4') {
      pathStr = path.join(contentPath, (manifestJSON.id + manifestJSON.version), 'web-mobile', zmgInfo.name)
    }
    if (zipAlreadyExists) {
      console.log(`${manifestJSON.id + manifestJSON.version} 在本地有数据，无需下载`);

      this.getExistFileSize(pathStr, (size, existSize) => {
        this.currentSize += existSize;
        handleZmgInfo.totalSize = ((this.totalSize) / 1024 / 1024).toFixed();;
        this.currentDownloadIndex += 1;
        this.decompressionResources = true;
        if (currentDownloadIndex === fileList.length - 1) {
          handleZmgInfo.loadInfo = { code: 0, message: '下载完成' };
        }
        if (!this.stopRender) {
          this.setState({
            fileList: [...fileList],
          }, () => {
            this.handleDownloadLocalZmg();
          });
        } else {
          this.handleDownloadLocalZmg();
        }
      });
    } else {
      if (type !== 'mp4') {
        this.decompressionResources = false; //是否解压zip完成
        this.getExistFileSize(pathStr, (size, existSize) => {
          zmgInfo.existSize = existSize;
        });
        const csZipUrl = manifestJSON.zipurl || manifestJSON.url;
        const req = this.zmZmgLocalLoad.downLoadResourcesBreakpointResumeZip(
          csZipUrl,
          `${(manifestJSON.id + manifestJSON.version)}.zip`,
          contentPath,
          (data) => {
            // 下载完成
            console.log('下载完成', zmgInfo.name, data);
            if (currentDownloadIndex === fileList.length - 1) {
              handleZmgInfo.loadInfo = data;
            }
            this.currentDownloadIndex += 1;
            const accObjectDS = {
              type: 3,
              code: 0,
              message: '课前本地化下载课件成功',
              otherId: 'KID_PRE_DOWNLOAD_COURSEWARE_SUCCEED',
              arguments: {
                url: csZipUrl,
                localName: `${(manifestJSON.id + manifestJSON.version)}.zip`,
                path: contentPath,
              },
              result: data,
            };
            window.__acc2__(accObjectDS);
            const zmgPath = path.join(contentPath, (manifestJSON.id + manifestJSON.version));
            this.zmZmgLocalLoad.decompressionResourcesZip(
              path.join(contentPath, `${(manifestJSON.id + manifestJSON.version)}.zip`),
              zmgPath,
              (result) => {
                // 解压完成
                console.log('解压缩-suc', result);
                this.decompressionResources = true;
                this.handleDownloadLocalZmg();

                const accObjectCS = {
                  type: 3,
                  code: 0,
                  message: '课前本地化解压课件成功',
                  otherId: 'KID_PRE_DOWNLOAD_COURSEWARE_DECOMPRESS_SUCCEED',
                  arguments: {
                    path: path.join(path.join(contentPath, (manifestJSON.id + manifestJSON.version))),
                  },
                  result,
                };
                window.__acc2__(accObjectCS);
              },
              (err) => {
                // 解压失败
                console.log('解压缩-err', err);
                const accObjectCS = {
                  type: 3,
                  code: 1,
                  message: '课前本地化解压课件失败',
                  otherId: 'KID_PRE_DOWNLOAD_COURSEWARE_DECOMPRESS_FAILED',
                  arguments: {
                    path: path.join(contentPath, (manifestJSON.id + manifestJSON.version)),
                  },
                  err,
                };
                window.__acc2__(accObjectCS);
              },
            );
          },
          (data) => {
            // 下载失败
            console.log('下载-err', zmgInfo.name, data);
            if (req) {
              req.destroy();
            }
            if (data.code === -6) {
              this.cleanLocalCourseware(1);
              this.codeIgnore = true;
            }
            if (data && data.code === -3) return;
            handleZmgInfo.loadInfo = data;
            if (!this.stopRender) {
              this.setState({ fileList: [...fileList] });
            }
            const accObjectDF = {
              type: 3,
              code: 1,
              message: '课前本地化下载课件失败',
              otherId: 'KID_PRE_DOWNLOAD_COURSEWARE_FAILED',
              arguments: {
                url: csZipUrl,
                localName: `${(manifestJSON.id + manifestJSON.version)}.zip`,
                path: contentPath,
              },
              result: data,
            };
            window.__acc2__(accObjectDF);
            this.handleDownloadLocalZmg()
          },
          (data) => {
            // 下载进度
            if (fileList.length === 0) return;
            const existSize = zmgInfo.existSize || 0;
            if (data === req.totalSize) {
              this.currentSize += req.totalSize + existSize;
              return;
            };
            handleZmgInfo.loadInfo = { code: 1, message: '下载中' };
            handleZmgInfo.totalSize = ((this.totalSize) / 1024 / 1024).toFixed();
            handleZmgInfo.rate = Number(((data + this.currentSize + existSize) / (this.totalSize)) * 100).toFixed();
            if (!this.stopRender) {
              this.setState({ fileList: [...fileList] });
            }
          },
        );
        this.req = req;
      }
      else {
        // 下载map 并判断zip文件是否解压缩完毕
        if (this.decompressionResources === true) {
          const zmgPath = path.join(contentPath, (manifestJSON.id + manifestJSON.version));
          this.getExistFileSize(pathStr, (size, existSize) => {
            zmgInfo.existSize = existSize;
          });
          const req1 = this.zmZmgLocalLoad.downLoadResourcesBreakpointResumeZip(
            manifestJSON.url,
            `${zmgInfo.name}`,
            path.join(zmgPath, 'web-mobile'),
            (data) => {
              if (currentDownloadIndex === fileList.length - 1) {
                handleZmgInfo.loadInfo = data;
              }
              this.currentDownloadIndex += 1;
              this.setState({ fileList: [...fileList] });
              this.handleDownloadLocalZmg();
            },
            (data) => {
              if (req1) {
                req1.destroy();
              }
              if (data.code === -6) {
                this.cleanLocalCourseware(1);
                this.codeIgnore = true;
              }
              if (data && data.code === -3) return;
              handleZmgInfo.loadInfo = data;
              if (!this.stopRender) {
                this.setState({ fileList: [...fileList] });
              }
              this.handleDownloadLocalZmg()
            },
            (data) => {
              // 下载进度
              if (fileList.length === 0) return;
              const existSize = zmgInfo.existSize || 0;
              if (data === req1.totalSize) {
                this.currentSize += req1.totalSize + existSize;
                return;
              };
              handleZmgInfo.loadInfo = { code: 1, message: '下载中' };
              handleZmgInfo.totalSize = ((this.totalSize) / 1024 / 1024).toFixed();
              handleZmgInfo.rate = Number(((data + this.currentSize + existSize) / (this.totalSize)) * 100).toFixed();
              if (!this.stopRender) {
                this.setState({ fileList: [...fileList] });
              }
            },
          );
        }

      }
    }
  }

  getExistFileSize = (path, cb) => {
    // 已存在本地文件大小
    try {
      let fileSize = 0;
      const fileInfo = this.fs.statSync(path);
      fileSize = Number(fileInfo.size / 1024 / 1024).toFixed();
      cb(fileSize, fileInfo.size);
    } catch (e) {
      cb(0, 0);
    }
  }

  hidePannel = () => {
    this.hidenTimer = setTimeout(() => {
      this.setState({
        isDownloadPannelVisible: false,
      });
    }, 5000);
  }

  handleCheckboxChange = () => {
    storageParam.setStorage();
  }

  handleCloseTip = () => {
    this.setState({
      showTip: false,
    });
    sessionStorage.setItem('ZmgDoNotShowTip', true);
  }

  handleStartDownload = () => {
    this.setState({
      showTip: false,
      isDownloadPannelVisible: true,
    });
    this.handleDownloadLocalZmg();
  }

  render() {
    const {
      showTip,
      isDownloadPannelVisible,
      fileList,
      fetchError,
    } = this.state;
    const { currentDownloadIndex, secondLoading, showIndex } = this;
    if (fileList.length === 0 || !checkEnvironment()) {
      return null;
    }
    const fileNeedToDownload = fileList.some(item => !item.zipAlreadyExists);
    const showFileList = fileList.slice(0, 1);
    const isTipVisible = showTip && fileNeedToDownload && !secondLoading;
    return (
      <Fragment>
        <CoursewareDownloadPannel
          visible={isDownloadPannelVisible}
          fileList={showFileList}
          fetchError={fetchError}
          currentDownloadIndex={showIndex}
          handleDownloadLocalZmg={this.handleDownloadLocalZmg}
        />
        <TipModal
          visible={isTipVisible}
          fileList={showFileList}
          handleCloseTip={this.handleCloseTip}
          handleStartDownload={this.handleStartDownload}
        />
      </Fragment>
    );
  }
}

CoursewarePreDownload.propTypes = {
};

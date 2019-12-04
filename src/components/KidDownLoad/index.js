import React, { Component, Fragment } from 'react'
import { getClientVersion } from 'zmNativeBridge'
import { AppLocalStorage } from 'utils/localStorage'
import eventBus from './eventBus'

export function checkEnvironment() {
  const notXpClient = getClientVersion().indexOf('xp') !== 0
  return (
    window.process &&
    (window.process.platform === 'win32' ||
      window.process.platform === 'darwin') &&
    notXpClient &&
    window.ZmResourcesLocalization &&
    AppLocalStorage.getRole() === 'student'
  )
}

function getRemote() {
  try {
    const electron = window.require('electron')
    return electron.remote
  } catch (error) {
    // console.log(error);
  }
}


// Wrapper 传入的组件
// dataSource 传入要下载的数据
// folderName 要创建的文件夹名称
// prot 启动本地服务的端口

const DownLoadHOC = Wrapper => {
  return class DownLoad extends Component {
    constructor(props) {
      super(props)
      this.path = getRemote() && getRemote().require('path')
      this.fs = getRemote() && getRemote().require('fs')
      this.currentDownloadIndex = 0

      this.state = {
        dataSize: 0,
        totalSize: 0,
        rate: 0,
        loadInfo: {} // 下载信息
      }
    }

    componentDidMount() {
      eventBus.removeListener('stop_render')
      // 检查环境是否满足条件
      if (checkEnvironment()) {
        // 获取remote模块与主进程通信，启动http服务器
        this.startHttpServer()
        // 测试http服务器是否创建成功
        this.detectHttpServer()
        // 删除超过7天的数据
        this.cleanLocalCourseware(7);
        // this.startHttpServer();
        this.handleDownloadLocalZmg();
        eventBus.addListener('stop_render', () => {
          this.stopRender = true
        })
      }
    }

    componentWillUnmount() {
      eventBus.emit('stop_render');
      this.umounted = true;
      if (this.req && this.req.destroy) {
        this.req.destroy()
      }
    }

    startHttpServer = () => {
      const { path } = this;
      const savePath = path.resolve(window.process.resourcesPath, 'app/node_modules');
      let decompressionPath = path.resolve(window.process.resourcesPath, 'app','zmcourse');//课件统一放置到app/zmcourse下
      this.zmZmgLocalLoad = new window.ZmResourcesLocalization(savePath, decompressionPath);
    }

    detectHttpServer = (port = 9213) => {
      const { path, fs, zmZmgLocalLoad } = this;
      const { folderName } = this.props;
      fs.exists(path.join(window.process.resourcesPath, 'app', 'node_modules', 'http-server'), (exists) => {
        if (exists) {
          
          try {
            const serverRoot = this.path.resolve(window.process.resourcesPath,'app');
            zmZmgLocalLoad.createFolder(
              path.join(serverRoot, 'zmg'),
              suc => {
                console.warn('创建文件夹成功！！')
              },
              () => {
                zmZmgLocalLoad.createPort(
                  serverRoot,
                  port,
                  () => {
                    localStorage.setItem('localResourcesLocalServer', `http://127.0.0.1:${port}/`);
                  },
                  reject => {
                    console.warn('创建文件夹失败!!', reject)
                  }
                )
              }
            )
          } catch (e) {
            console.warn('创建文件夹失败 catch', e)
          }
        

          const existZmgPath = fs.existsSync(path.join(window.process.resourcesPath, 'app','zmcourse', folderName));
          if (!existZmgPath) {
            this.createLocalFolder(path.join(window.process.resourcesPath, 'app','zmcourse', folderName));
          }
        }
      })
    }

    createLocalFolder = (folderPath) => {
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
      

    cleanLocalCourseware = (date = 7) => {
      // 删除本地历史文件
      const { path } = this;
      const { folderName } = this.props;
      const dirPath = path.join(window.process.resourcesPath, 'app','zmcourse', folderName);
      this.zmZmgLocalLoad.removeOverdueFiles(
        dirPath,
        date,
        data => {
          console.log('清理磁盘-成功', data)
        },
        err => {
          console.log('清理磁盘-失败', err)
        }
      )
    }

    // 检查文件是否损坏
    isFileBroken = path => {
      const fileCounts = this.zmZmgLocalLoad.getFileCountsOfFolder(path)
      const zipCounts = this.zmZmgLocalLoad.getFileCountsOfZip(`${path}.zip`)
      const result = fileCounts !== zipCounts
      return result
    }

    handleDownloadLocalZmg = () => {
      // 下载课件到本地
      const { fs, path, currentDownloadIndex } = this;
      const { dataSize } = this.state;
      const { dataSource, folderName='courses' } = this.props;
      if (this.stopRender) return;
      const sourceId = dataSource.id;
      const sourceVersion = dataSource.version;
      let contentPath = path.join(window.process.resourcesPath, 'app','zmcourse', folderName,String(sourceId));
      let zipName = `${sourceVersion}.zip`;
      let pathStr = path.join(contentPath,zipName);
      let filePath = path.join(contentPath,sourceVersion);
      if(folderName === 'zmg'){
        contentPath = path.join(window.process.resourcesPath, 'app', folderName);
        zipName = `${(sourceId + sourceVersion)}.zip`;
        pathStr =  path.join(contentPath, zipName);
        filePath =  path.join(contentPath, (sourceId + sourceVersion));
      }
      // 如果文件已存在
      if (fs.existsSync(filePath)) {
        this.getExistFileSize(pathStr, size => {
          this.setState({
            loadInfo: { code: 0, message: '下载完成' },
            totalSize: size
          })
          this.currentDownloadIndex += 1
          if (!this.stopRender) {
            this.setState({}, () => {
              // this.handleDownloadLocalZmg();
            })
          } else {
            // this.handleDownloadLocalZmg();
          }
        })
      } else {
        this.getExistFileSize(pathStr, (size, existSize) => {
          this.setState({ dataSize: existSize });
        });
        const downurl = dataSource.manifest||dataSource.url;
        const req = this.zmZmgLocalLoad.downLoadResourcesBreakpointResumeZip(
          // dataSource.manifest,
          // downurl.replace('https:','http:'),
          downurl,
          zipName,
          contentPath,
          data => {
            // 下载完成
            this.setState({ loadInfo: data })
            this.currentDownloadIndex += 1
            // this.handleDownloadLocalZmg();
            this.zmZmgLocalLoad.decompressionResourcesZip(
              pathStr,
              filePath,
              (result) => {
              // 解压完成
                console.log('解压缩-成功', result);
                if(this.umounted){
                  return;
                }
                this.setState({
                  loadInfo: { code: 0, message: '解压缩-成功' }
                })
              },
              err => {
                // 解压失败
                console.log('解压缩-失败', err)
              }
            )
          },
          (data) => {
            // 下载失败
            if(this.umounted){
              return;
            }
            this.setState({
              loadInfo: { code: -1, message: '下载-失败' }
            })
            console.log('下载-失败', data)
            if (req) {
              req.destroy()
            }
            if (data.code === -6) {
              this.cleanLocalCourseware(1)
              this.codeIgnore = true
            }
            if (data && data.code === -3) return
            this.setState({ loadInfo: data })
          },
          (data) => {
            // 下载进度
            if(this.umounted){
              return;
            }
            this.setState({
              loadInfo: { code: 1, message: '下载中' },
              totalSize: ((dataSize + req.totalSize) / 1024 / 1024).toFixed(),
              rate: Number(((data + dataSize) / (req.totalSize + dataSize)) * 100).toFixed(),
            }, () => {
              if (data === req.totalSize) return;
            });
          },
        );
        this.req = req;
      }
    }

    getExistFileSize = (path, cb) => {
      // 已存在本地文件大小
      try {
        let fileSize = 0
        const fileInfo = this.fs.statSync(path)
        fileSize = Number(fileInfo.size / 1024 / 1024).toFixed()
        cb(fileSize, fileInfo.size)
      } catch (e) {
        cb(0, 0)
      }
    }

    render() {
      const { rate, loadInfo } = this.state
      return (
        <Wrapper
          {...this.props}
          rate={rate}
          loadInfo={loadInfo}
          begigDownLoad={this.handleDownloadLocalZmg}
        />
      )
    }
  }
}

export default DownLoadHOC

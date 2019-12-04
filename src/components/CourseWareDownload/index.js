import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import CoursewarePreDownload, { checkEnvironment } from './CoursewarePreDownload';

class CoursewarePreDownloadPortal extends PureComponent {
  constructor(props) {
    super(props);
    this.downloadPortalRoot = document.createElement('div');
  }

  componentDidMount() {
    document.body.appendChild(this.downloadPortalRoot);
  }

  componentWillUnmount() {
    this.downloadPortalRoot.remove();
  }

  render() {
    if (!checkEnvironment()) return null;
    return ReactDOM.createPortal(
      <CoursewarePreDownload />,
      this.downloadPortalRoot,
    );
  }
}

CoursewarePreDownloadPortal.propTypes = {};

export default CoursewarePreDownloadPortal;

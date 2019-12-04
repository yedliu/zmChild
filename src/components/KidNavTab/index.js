import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

class KidNavTab extends React.PureComponent {
  render() {
    const { items, selectedIndex, handleSelect, selectBg } = this.props;
    // items.indexOf('全部') < 0 && items.unshift({ subjectLabel: '全部' });
    return (
      <div className="kidNavTab">
        {
          items.map((item, index) => (
            <div
              className={`${selectedIndex === index ? 'active' : ''}`}
              key={index}
              onClick={() => handleSelect(item, index)}>
              {item.subjectLabel || item}
              <i
                style={{ backgroundImage: selectBg && `url(${selectBg})` }}
                className='bg' />
            </div>
          ))
        }
      </div>
    );
  }
}

KidNavTab.propTypes = {
  items: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  selectBg: PropTypes.string
};
export { KidNavTab };

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './TabBarNav.css';
const TabBarNav = ({
    navLabel,className,onChangeActiveTab,
                    })=> {
    const classes=className(
        'nav-item',
        className,
    );
    return (
        <button
        className={classes}
        onClick={()=>{onChangeActiveTab(navLabel);}}
        >
        </button>
    );
};

TabBarNav.propTypes={
    navLabel:PropTypes.string,
    className:PropTypes.string,
    onChangeActiveTab:PropTypes.func,
};

TabBarNav.defaultProps={
    navLabel:'Tab',
    className:'',
    onChangeActiveTab:()=>{},
};

export default TabBarNav
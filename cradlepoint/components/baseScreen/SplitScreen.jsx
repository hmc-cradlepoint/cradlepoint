import React from 'react';
import styles from '../../styles/SplitScreen.module.css';
import PropTypes from 'prop-types';
import MenuBar from './MenuBar';

export default function SplitScreen(props) {
    return (
        <div style={{flexDirection: "column",flex:1}}>
            <MenuBar />
            <div className={styles.screenContainer}>
                {/* Add styling to leftSection and rightSection in SplitScreen.css as neccessary */}
                {props.topChildren}
                <div className={styles.sectionContainer}>
                    <div style={{width: "50%", wordBreak: "break-word"}} className={styles.leftSection}>{props.leftSection}</div>
                    <div style={{width: "50%", wordBreak: "break-word"}} className={styles.rightSection}>{props.rightSection}</div>
                </div>
                {props.bottomChildren}
            </div>
        </div>
    )
}

SplitScreen.propsTypes = {
    topChildren: PropTypes.any,
    leftSection: PropTypes.any,
    rightSection: PropTypes.any,
    bottomChildren: PropTypes.any,
}

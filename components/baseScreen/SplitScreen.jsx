import React from 'react';
import styles from '../../styles/SplitScreen.module.css';
import PropTypes from 'prop-types';
import MenuBar from './MenuBar';

/**
 * for screens in the form of dividing into 3 sections vertically as top, middle, and bottom
 * then, the mid section is divided into left and right subsection with equal lengths
 * @param {*} props topChildren, leftSection, rightSection, bottomChildren
 * content of each section
 * @returns the entire screen
 */
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

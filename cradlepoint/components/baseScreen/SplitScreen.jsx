import React from 'react';
import styles from '../../styles/SplitScreen.module.css';
import PropTypes from 'prop-types';
import MenuBar from './MenuBar';

export default function SplitScreen(props) {
    return (
        <div>
            <MenuBar />
            <div className={styles.screenContainer}>
                {/* Add styling to leftSection and rightSection in SplitScreen.css as neccessary */}
                <div className={styles.leftSection}>{props.leftSection}</div>
                <div className={styles.rightSection}>{props.rightSection}</div>
            </div>
        </div>
    )
}

SplitScreen.propsTypes = {
    leftSection: PropTypes.any,
    rightSection: PropTypes.any
}

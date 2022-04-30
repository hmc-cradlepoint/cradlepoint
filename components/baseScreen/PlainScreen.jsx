import React from 'react';
import PropTypes from 'prop-types';
import MenuBar from './MenuBar';
import styles from '../../styles/SplitScreen.module.css';

/**
 * 
 * @param {*} props the children content of the screen is passed from the pages themselves
 * @returns the entire screen, including menu bar and children
 */
export default function PlainScreen(props) {
    return (
        <div style={{flexDirection: "column",flex:1}}>
            <MenuBar />
            <div className={styles.screenContainer}>
                {props.children}
            </div>

        </div>
    )
}

PlainScreen.propTypes = {
    children: PropTypes.any
}

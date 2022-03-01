import React from 'react';
import PropTypes from 'prop-types';
import MenuBar from './MenuBar';
import styles from '../../styles/SplitScreen.module.css';

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

import React from 'react';
import PropTypes from 'prop-types';
import MenuBar from './MenuBar';

export default function PlainScreen(props) {
    return (
        <div>
            <MenuBar />
            <div style={{marginLeft: "5%", marginRight: "5%", marginTop: "2%", marginBottom: "2%"}}>
                {props.children}
            </div>

        </div>
    )
}

PlainScreen.propTypes = {
    children: PropTypes.any
}

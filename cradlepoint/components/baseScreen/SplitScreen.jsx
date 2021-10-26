import React from 'react';
import MenuBar from './MenuBar';

export default function SplitScreen(props) {
    <div>
        <MenuBar />
        <div className="screenContainer">
            {/* Add styling to leftSection and rightSection in SplitScreen.css as neccessary */}
            <div className="leftSection">{leftSection}</div>
            <div className="rightSection">{rightSection}</div>
        </div>
    </div>
}

SplitScreen.propsTypes = {
    leftSection: PropTypes.any,
    rightSection: PropTypes.any
}

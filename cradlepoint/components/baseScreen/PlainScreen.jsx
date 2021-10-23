import React from 'react';
import MenuBar from './MenuBar';

export default function PlainScreen(props) {
    <div>
        <MenuBar />
        {children}
    </div>
}

PlainScreen.propTypes = {
    children: PropTypes.any
}

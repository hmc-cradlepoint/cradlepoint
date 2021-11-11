import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

function CPButton(props) {
    return (
        <Button 
            style={{borderRadius: 8, backgroundColor: "#FCAC1C", margin: 10, display: 'flex'}} 
            variant="contained" 
            size="large"
            onClick={props.onClick}
        >
            <div style={{padding: "10px"}}>
            {props.text}
            </div>
        </Button>
    )
}

function HorizontalButton(props) {
    return (
        <Button 
            style={{borderRadius: 8, backgroundColor: "#FCAC1C", margin: 10}} 
            variant="contained" 
            size="large"
            onClick={props.onClick}
        >
            <div style={{padding: "10px"}}>
            {props.text}
            </div>
        </Button>
    )
}

Button.propTypes = {
    text: PropTypes.any
}

export {CPButton, HorizontalButton}; 
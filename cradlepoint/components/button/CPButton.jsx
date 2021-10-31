import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@mui/styles'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// const CPTheme = createMuiTheme({ palette: { primary: "#d9d9d9" } })

export default function CPButton(props) {
    return (
        <Button style={{borderRadius: 8, backgroundColor: "#FCAC1C", margin: 10}} variant="contained" size="large">
            <div style={{padding: "10px"}}>
            {props.text}
            </div>
        </Button>
    )
}

Button.propTypes = {
    text: PropTypes.any
}

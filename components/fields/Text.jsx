import React from 'react';
import { Field, Formik} from 'formik';

// use formik

// 1-line text field
function SmallTextInput(props) {
    return(
        <div  style={{padding: "25px"}}>
            <span>{props.label} </span>
            <input type="text" name={props.name} value={props.value} onChange={props.onChange}/>
        </div>
    )
}

// Multi-line text field
function BigTextInput(props) {
    return(
        <div style={{padding: "25px"}}>
            <p>{props.label} </p>
            <textarea rows="4" cols="50" name={props.name} value={props.value} onChange={props.onChange}/>
        </div>
    )
}

export {SmallTextInput, BigTextInput}; 


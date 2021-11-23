import React from 'react';
import { Field, Formik} from 'formik';

// use formik

// 1-line text field
function SmallTextInput(props) {
    return(
        <div  style={{padding: "25px"}}>
        <span>{props.name}: </span>
        <Formik>
            <Field name={props.name} placeholder={props.name} value={props.value}/>
        </Formik>
        </div>
    )
}

// Multi-line text field
function BigTextInput(props) {
    return(
        <div  style={{padding: "25px"}}>
        <div>{props.name}: </div>
        <Formik>
            <Field name={props.name} placeholder="Placeholder" as="textarea" rows={10} value={props.value}/>
        </Formik>
        </div>
    )
}

export {SmallTextInput, BigTextInput}; 


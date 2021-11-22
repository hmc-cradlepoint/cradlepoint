import React from 'react';
import { Field, Formik} from 'formik';

// use formik

// 1-line text field
export default function DropDown(props) {
    return (
    <Formik>
        <Field name="result" as="select" >
           {/* <option value="passed">Passed</option>
           <option value="unknown">Unknown</option>
           <option value="failed">Failed</option> */}
           {props.options.map((option)=>
                {return <option value={option}>{option}</option>})
            }
       </Field>
    </Formik>
    )
}
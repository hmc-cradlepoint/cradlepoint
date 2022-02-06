import React from 'react';
import { Field, Formik} from 'formik';

// use formik

// 1-line text field
export default function DropDown(props) {

    function handleChange(evt) {
      console.log(evt);
      props.onChange(evt);
    }
    
    return (
        <div style={{padding: "25px"}}>
        <Formik>
          <label>
            {props.title}
            <Field as="select" name={props.fieldName} value={props.value} 
            onChange={handleChange}>
              {props.options.map((o) => {
                return <option value={o}>{o}</option>
              })}
            </Field>
            </label>
          </Formik>
          </div>
    )
}
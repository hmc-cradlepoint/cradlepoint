import React from 'react';
import { Field, Formik} from 'formik';

// use formik

// 1-line text field
export default function DropDown(props) {
    console.log(props.options);
    return (
        <div style={{padding: "25px"}}>
        <Formik>
          <label>
            {props.title}
            <Field as="select" name={props.fieldName} value={props.value} onChange={props.handleChange}>
              {/* <option value="pass">Pass</option>
              <option value="unknown">Unknown</option>
              <option value="fail">Fail</option> */}
              {/* TODO: this is just displaying blank */}
              {props.options?.map(({ value }) => (
               
                <option value={value}>
                  {value}
                </option>
              
                ))}
            </Field>
            </label>
          </Formik>
          </div>
    )
}
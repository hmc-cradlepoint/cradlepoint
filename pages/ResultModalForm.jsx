import React, {useState} from "react";
import Modal from 'react-modal';
import CPButton from "../components/button/CPButton";
import styles from '../styles/Modal.module.css'
import PropTypes from 'prop-types';
import {Formik, Field} from 'formik';
import { SmallTextInput, BigTextInput } from "../components/fields/Text";
import { borderLeft } from "@mui/system";
import {ObjectID} from 'bson';
import {flowType, modalFormType} from '../util/modalUtils';
import DropDown from "../components/fields/DropDown";

/**
 * 
 * @param {*} props 
 *      - modalFormType: what kind of flow this should be (edit or create new)
 *      - onClose: called when user is done with the modal
 *      - isOpen: whether the model is visible
 *      - onBack: close modal without submitting
 *      - [ONLY for edit flow] data: original data of a test plan 
 * @returns div of Result modal
 */
export default function ResultModalForm(props) {
    const initialData = {
      _id: props.data?._id??new ObjectID(),
      description: props.data?.description??"",
      evidence: props.data?.evidence??"",
      testId: props.data?.testId,
      resultStatus: props.data?.resultStatus??"Unknown"
    }
    
  // state variable to keep track of the fields
  const [data, setData] = useState(initialData)
  
  /**
   * calls whenever user make changes to the fields to update the data variable
   * @param {*} evt onChange event
   */
  function handleChange(evt) {
    const value = evt.target.value;
    setData({
      ...data,
      [evt.target.name]: value
    });
  }
  
  /**
   * triggers by onClick of the Done button and calls the corresponding api 
   */
  async function handleSubmitData() {
    let newData = {
      ...props.data, 
      "_id":data._id, 
      "description":data.description, 
      "evidence": data.evidence,
      "testId": data.testId,
      "resultStatus": data.resultStatus,
    }

    // Calls corresponding api depending on modalFormType
    let endPoint = '/api/edit/Result';
    let method = 'PUT';
    if (props.modalFormType==modalFormType.NEW){
      endPoint = '/api/add/NewResult';
      method = 'POST';
    }

    try{
      const res = await fetch(endPoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })
    } catch (err){
      console.log("Error:",err)
    }
    props.onBack();
    setData(initialData);
  }
  
  // for the dropdown of result status
  const options = ["Pass", "Unknown", "Fail"];
  
  return (
      <Modal className={styles.content} isOpen={props.isOpen} overlayClassName={styles.overlay}>
        <h2>Add New Result to Test</h2>
        {/* Fields */}
        <div style={{alignItems:borderLeft}}>
          <DropDown title="Result Status: " fieldName="resultStatus" value={data.resultStatus} 
              onChange={handleChange} options={options}/>
          <BigTextInput label='Detail Description:' name='description' value={data.description} onChange={handleChange}/>
          <BigTextInput label='Evidence:' name='evidence' value={data.evidence} onChange={handleChange}/>
        </div>

        {/* Buttons */}
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <CPButton text='Back' onClick={()=>{props.onBack(); setData(initialData);}}/>
          <CPButton text='Done' onClick={handleSubmitData}/>
        </div>
      </Modal>
  );
}



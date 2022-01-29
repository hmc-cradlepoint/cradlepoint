import React, {useState} from "react";
import Modal from 'react-modal';
import CPButton from "../components/button/CPButton";
import styles from '../styles/Modal.module.css'
import PropTypes from 'prop-types';
import {Formik} from 'formik';
import { SmallTextInput, BigTextInput } from "../components/fields/Text";
import { borderLeft } from "@mui/system";
import {ObjectID} from 'bson';


export default function ResultModalForm(props) {
    const initialData = {
      _id: props.data?._id??new ObjectID(),
      details: props.data?.details??"",
      // POCApproval:  props.data.POCApproval,
      // SEApproval: props.data.SEApproval,
      evidence: props.data?.evidence??"",
      testId: props.data.testId,
      resultStatus: props.data?.resultStatus??"unknown"
    }

   
    const [data, setData] = useState(initialData)
  
    function handleChange(evt) {
      const value = evt.target.value;
      setData({
        ...data,
        [evt.target.name]: value
      });
    }
  
    async function handleSubmitData() {
      let newData = {
        ...props.data, 
        "_id":data._id, 
        "details":data.details, 
        // "POCApproval":data.POCApproval,
        // "SEApproval": data.SEApproval,
        "evidence": data.evidence,
        "testId": data.testId,
        "resultStatus": data.resultStatus,
      }
      
      try{
        const res = await fetch('/api/editResult', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newData),
        })
      } catch (err){
        console.log("Error:",err)
      }
      
      props.onBack()
    }
  
  
  return (
      <Modal className={styles.Modal} isOpen={props.isOpen}>
        <h2>Add New Result to Test</h2>
        <div style={{alignItems:borderLeft}}>
        <div style={{padding: "25px"}}>
          <Formik>
            <label>
              Result Status:
              <select value={data.resultStatus} onChange={handleChange}>
                <option value="pass">Pass</option>
                <option value="unknown">Unknown</option>
                <option value="fail">Fail</option>
              </select>
              </label>
            </Formik>
            </div>
        <BigTextInput label='Detail Description:' name='details' value={data.details} onChange={handleChange}/>
        <BigTextInput label='Evidence:' name='evidence' value={data.evidence} onChange={handleChange}/>
        
        </div>
        <CPButton text='Back' onClick={props.onBack}/>
        <CPButton text='Create' onClick={handleSubmitData}/>
      </Modal>
  );
}

ResultModalForm.propTypes = {
  onBack: PropTypes.bool.isRequired,
  modalOpen: PropTypes.bool.isRequired,
}


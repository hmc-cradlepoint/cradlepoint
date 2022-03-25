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

export default function ResultModalForm(props) {
    const initialData = {
      _id: props.data?._id??new ObjectID(),
      description: props.data?.description??"",
      evidence: props.data?.evidence??"",
      testId: props.data.testId,
      resultStatus: props.data?.resultStatus??"Unknown"
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
        "description":data.description, 
        "evidence": data.evidence,
        "testId": data.testId,
        "resultStatus": data.resultStatus,
      }
      
      let endPoint = '/api/editResult';
      let method = 'PUT';
      if (props.modalFormType==modalFormType.NEW){
        endPoint = '/api/addNewResult';
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
  
  const options = ["Pass", "Unknown", "Fail"];
  
  return (
      <Modal className={styles.Modal} isOpen={props.isOpen}>
        <h2>Add New Result to Test</h2>
        <div style={{alignItems:borderLeft}}>
        <DropDown title="Result Status: " fieldName="resultStatus" value={data.resultStatus} 
            onChange={handleChange} options={options}/>
        <BigTextInput label='Detail Description:' name='description' value={data.description} onChange={handleChange}/>
        <BigTextInput label='Evidence:' name='evidence' value={data.evidence} onChange={handleChange}/>

        </div>
        <CPButton text='Back' onClick={()=>{props.onBack(); setData(initialData);}}/>
        <CPButton text='Done' onClick={handleSubmitData}/>
      </Modal>
  );
}

ResultModalForm.propTypes = {
  onBack: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
}


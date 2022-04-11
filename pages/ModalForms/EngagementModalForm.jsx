import React, { useState } from 'react';
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from "../../components/fields/Text";
import { borderLeft } from "@mui/system";
import PropTypes from 'prop-types';
import { useRouter } from 'next/router'
import {ObjectID} from 'bson';
import { modalFormType } from '../../util/modalUtils';

export default function EngagementModalForm(props) {
  const router = useRouter();
  const initialData = {
    name: props.data?.name??"",
    customer: props.data?.customer??"",
    SFDC: props.data?.SFDC??"",
    description: props.data?.description??"",
    statusCode: props.data?.statusCode??1,
    SE: props.data?.SE??"",
    POC_Engineer: props.data?.POC_Engineer??""
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
    console.log(props.modalFormType)
    let newData = {
      ...props.data, 
      "name":data.name, 
      "customer":data.customer, 
      "SFDC":data.SFDC, 
      "description":data.description,
      "statusCode": data.statusCode,
      "SE": data.SE,
      "POC_Engineer": data.POC_Engineer}

   
    let endPoint = '/api/edit/Engagement';
    let method = 'PUT';
    
    if (props.modalFormType===modalFormType.NEW){
      endPoint = '/api/add/NewEngagement';
      method = 'POST';
    } 

    console.log(newData)
    try{
      const d = JSON.stringify(newData);
      const res = await fetch(endPoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(d)
        },
        body: d
      })
      console.log("RES:", res)
    } catch (err){
      console.log("Error:",err)
    }
    props.onClose();
    if (props.modalFormType==modalFormType.NEW){
      setData(initialData);
    }
  }

  return (
      <Modal className={styles.Modal} isOpen={props.isOpen}>
        <h2>Fill in Engagement Info</h2>
        <div style={{alignItems:borderLeft}}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <SmallTextInput label="Name: " name='name' value={data.name} onChange={handleChange}/>
          <SmallTextInput label='Customer: ' name='customer' value={data.customer} onChange={handleChange}/>
          <SmallTextInput label="SE: " name='SE' value={data.SE} onChange={handleChange}/>
          <SmallTextInput label='POC Eng: ' name='POC_Engineer' value={data.POC_Engineer} onChange={handleChange}/>
          <SmallTextInput label="SFDC: " name='SFDC' value={data.SFDC} onChange={handleChange}/>
          <BigTextInput label="Description: " name='description' value={data.description} onChange={handleChange}/>
        </div>

        </div>
        <CPButton text='Back' onClick={()=>{props.onBack(); setData(initialData);}}/>
        <CPButton text='Done' onClick={handleSubmitData}/>
      </Modal>
  );
}

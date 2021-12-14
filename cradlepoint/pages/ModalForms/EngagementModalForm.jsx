import React, { useState } from 'react';
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from "../../components/fields/Text";
import { borderLeft } from "@mui/system";
import PropTypes from 'prop-types';
import { useRouter } from 'next/router'
import {ObjectID} from 'bson';

export default function EngagementModalForm(props) {
  const router = useRouter();

  const [data, setData] = useState({
    _id: props.data?._id??new ObjectID(),
    name: props.data?.name??"",
    customer: props.data?.customer??"",
    SFDC: props.data?.SFDC??"",
    engagementDetails: props.data?.engagementDetails??"",
  })

  function handleChange(evt) {
    const value = evt.target.value;
    setData({
      ...data,
      [evt.target.name]: value
    });
  }

  async function handleSubmitData() {
    // console.log(props.data);
    let newData = {...props.data, "_id":data._id, "name":data.name, "customer":data.customer, "SFDC":data.SFDC, "engagementDetails":data.engagementDetails}
    delete newData.POC_Eningeer_details;
    delete newData.SEDetails;
    try{
      const res = await fetch('/api/editEngagement', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })
      console.log("RES:", res)
    } catch (err){
      
      console.log("Error:",err)
    }

    props.onBack()
  }

  return (
      <Modal className={styles.Modal} isOpen={props.isOpen}>
        <h2>Fill in Engagement Info</h2>
        <div style={{alignItems:borderLeft}}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <SmallTextInput label="Engagement Name:" name='name' value={data.name} onChange={handleChange}/>
          <SmallTextInput label='Customer' name='customer' value={data.customer} onChange={handleChange}/>
          <SmallTextInput label="SFDC:" name='SFDC' value={data.SFDC} onChange={handleChange}/>
          <BigTextInput label="Engagement Description:" name='engagementDetails' value={data.engagementDetails} onChange={handleChange}/>
        </div>

        </div>
        <CPButton text='Back' onClick={props.onBack}/>
        <CPButton text='Done' onClick={handleSubmitData}/>
      </Modal>
  );
}

EngagementModalForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onBack: PropTypes.bool.isRequired,
}
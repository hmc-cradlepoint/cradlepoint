import React, {useState} from "react";
import Modal from 'react-modal';
import CPButton from "../components/button/CPButton";
import styles from '../styles/Modal.module.css';
import { SmallTextInput, BigTextInput } from '../components/fields/Text';
import { borderLeft } from "@mui/system";
import { useRouter } from 'next/router';
import {ObjectID} from 'bson';

export default function TestPlanModalForm(props) {
  const router = useRouter();

  const [data, setData] = useState({
    _id: new ObjectID(),
    name: "",
    active: "",
    version: "",
    customerFeedback: "",
    testPlanDescription: "",
    DeviceConfig: ""
  })

  function handleChange(evt) {
    const value = evt.target.value;
    setData({
      ...data,
      [evt.target.name]: value
    });
  }

  return (
      <Modal className={styles.Modal} isOpen={props.isOpen}>
        <h2>Test Plan Info</h2>
        <div style={{alignItems:borderLeft}}>
          <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
          <div>
          <SmallTextInput label="Name:" name='name' value={data.name} onChange={handleChange}/>
          <SmallTextInput label="Active:" name='active' value={data.active} onChange={handleChange}/>
          <SmallTextInput label="Version:" name='version' value={data.version} onChange={handleChange}/>
          </div>
        <BigTextInput label="Customer Feedback:" name='customerFeedback' value={data.customerFeedback} onChange={handleChange}/>
        </div>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        <BigTextInput label="Test Plan Description:" name='testPlanDescription' value={data.testPlanDescription} onChange={handleChange}/>
        <BigTextInput label="Device Config:" name='deviceConfig' value={data.deviceConfig} onChange={handleChange}/>
        </div>
        </div>
        <div style={{display: "flex", flexDirection: "row"}}>
          <CPButton text='Cancel' onClick={props.onBack}/>
          <CPButton text='Create'/>
        </div>
      </Modal>
  );
}

import React, {useState} from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from "../../components/fields/Text";
import { borderLeft } from "@mui/system";
import { useRouter } from 'next/router';
import {ObjectID} from 'bson';
import DropDown from "../../components/fields/DropDown";
import {modalFormType} from '../../util/modalUtils';

export default function TestPlanModalForm(props) {
  const router = useRouter();
  console.log(props.cloneData);
  // const initialData = {
  //   _id: props.data?._id??new ObjectID(),
  //   name: props.data?.name??"",
  //   isActive: props.data?.isActive??"true",
  //   version: props.data?.version??"",
  //   customerFeedback: props.data?.customerFeedback??"",
  //   description: props.data?.description??"",
  //   deviceConfig: props.data?.deviceConfig??""
  // }

// TODO: do we even need this if else??
  const initialData = (props.isClone)? 
    {
      _id: new ObjectID(),
      name: (props.cloneData?.name??"") + " (copy)",
      isActive: props.cloneData?.isActive??true,
      version: props.cloneData?.version??"",
      customerFeedback: props.cloneData?.customerFeedback??"",
      description: props.cloneData?.description??"",
      deviceConfig: props.cloneData?.deviceConfig??"",
      summaryBOM: props.cloneData?.summaryBOM??[],
      testCases: props.cloneData?.testCases??[]
    }:{
      _id: new ObjectID(),
      name: "",
      isActive: "true",
      version: "",
      customerFeedback: "",
      description: "",
      deviceConfig: "",
      summaryBOM: [],
      testCases: []
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
      "_id":data._id.toString(), 
      "name":data.name, 
      "isActive":data.isActive,
      "version": data.version,
      "customerFeedback": data.customerFeedback,
      "description": data.description,
      "deviceConfig": data.deviceConfig,
      "engagementId": props.engagementId,
      "summaryBOM": data.summaryBOM,
      "testCases": data.testCases,
    }

    const endPoint = '/api/editTestPlan';
    const method = 'PUT';

    if (props.modalFormType===modalFormType.NEW){
      method = 'POST';
      endPoint = props.isClone?'/api/cloneTestPlan':'/api/addNewTestPlan';
    } 

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

  // for the dropdown of isActive
  const options = [true, false];
  return (
      <Modal className={styles.Modal} isOpen={props.isOpen}>
        <h2>Test Plan Info</h2>
        <div style={{alignItems:borderLeft}}>
          <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
          <div>
          <SmallTextInput label="Name:" name='name' value={data.name} onChange={handleChange}/>
          <DropDown title="Active: " fieldName="isActive" value={data.isActive} 
            onChange={handleChange} options={options}/>
          <SmallTextInput label="Version:" name='version' value={data.version} onChange={handleChange}/>
          </div>
        <BigTextInput label="Customer Feedback:" name='customerFeedback' value={data.customerFeedback} onChange={handleChange}/>
        </div>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        <BigTextInput label="Description:" name='description' value={data.description} onChange={handleChange}/>
        <BigTextInput label="Device Config:" name='deviceConfig' value={data.deviceConfig} onChange={handleChange}/>
        </div>
        </div>
        <div style={{display: "flex", flexDirection: "row"}}>
          <CPButton text='Back' onClick={()=>{
          setData(initialData);
          props.onBack();}}/>
          <CPButton text='Done' onClick={handleSubmitData}/>
        </div>
      </Modal>
  );
}

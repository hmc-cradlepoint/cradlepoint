import React, {useState} from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from "../../components/fields/Text";
import { borderLeft } from "@mui/system";
import { useRouter } from 'next/router'
import {ObjectID} from 'bson';
import {modalFormType} from '../../util/modalUtils';

export default function TestModalForm(props) {
  const router = useRouter();
  const initialData = {
    _id: props.data?._id??new ObjectID(),
    name: props.data?.name??"",
    description: props.data?.description??"",
    resultStatus: props.data?.resultStatus??"unknown"
  }
  const [data, setData] = useState(initialData);

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
      "name":data.name, 
      "description":data.description,
      "testCaseId": props.testCaseId,
      "resultStatus": data.resultStatus
    }

    let endPoint = '/api/edit/Test';
    let method = 'PUT';
    if (props.modalFormType==modalFormType.NEW){
      endPoint = '/api/addNewTest';
      method = 'POST';
      newData["results"] = [];
    }

    try{
      const d = JSON.stringify(newData);
      const res = await fetch(endPoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(d)
        },
        body: d,
      })
    } catch (err){
      console.log("Error:",err)
    }
    
    props.onClose();
    // TODO: if create new, then should navigate to the corresponding test details page
    if (props.modalFormType==modalFormType.NEW){
      setData(initialData);
    }
    
  }

  return (
    <>
      <Modal className={styles.Modal} isOpen={props.isOpen}>
        <h2>Fill in Test Info</h2>
        <div style={{alignItems:borderLeft}}>
        <SmallTextInput label="Name" name='name' value={data.name} onChange={handleChange}/>
        <BigTextInput label="Description" name='description' value={data.description} onChange={handleChange} />
        </div>
        <CPButton text='Back' onClick={()=>{
          setData(initialData);
          props.onBack()
        }}/>
        <CPButton text='Done' onClick={handleSubmitData}/>
      </Modal>
    </>
  );
}

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
      "results": []
    }

    const endPoint = '/api/editTest';
    const method = 'PUT';
    if (props.modalFormType==modalFormType.NEW){
      endPoint = '/api/addNewTest';
      method = 'POST';
    }

    try{
      const d = JSON.stringify(newData);
      const res = await fetch(endPoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(d)
        },
        body: JSON.stringify(newData),
      })
      console.log(res);
    } catch (err){
      console.log("Error:",err)
    }
    // TODO: if create new, then should navigate to the corresponding test details page
    props.onBack();
    setData(initialData);
  }

  return (
    <>
      <Modal className={styles.Modal} isOpen={props.isOpen}>
        <h2>Fill in Test Info</h2>
        <div style={{alignItems:borderLeft}}>
        <SmallTextInput label="Subject" name='name' value={data.name} onChange={handleChange}/>
        <BigTextInput label="Description" name='description' value={data.description} onChange={handleChange} />
        </div>
        <CPButton text='Back' onClick={()=>{
          setData(initialData);
          props.onBack()
        }}/>
        {/* TODO: integrate edit api call for test*/}
        <CPButton text='Done' onClick={handleSubmitData}/>
      </Modal>
    </>
  );
}

import React, {useState} from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from "../../components/fields/Text";
import { borderLeft } from "@mui/system";
import { useRouter } from 'next/router'
import {ObjectID} from 'bson';

export default function TestModalForm(props) {
  const router = useRouter();
  const initialData = {
    _id: props.data?._id??new ObjectID(),
    name: props.data?.name??"",
    details: props.data?.details??"",
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
      "details":data.details
    }
    try{
      const res = await fetch('/api/editTest', {
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
    <>
      <Modal className={styles.Modal} isOpen={props.isOpen}>
        <h2>Fill in Test Info</h2>
        <div style={{alignItems:borderLeft}}>
        <SmallTextInput label="Subject" name='name' value={data.name} onChange={handleChange}/>
        <BigTextInput label="Description" name='details' value={data.details} onChange={handleChange} />
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

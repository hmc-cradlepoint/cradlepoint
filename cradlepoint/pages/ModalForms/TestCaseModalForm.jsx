import React, {useState} from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from "../../components/fields/Text";
import { borderLeft } from "@mui/system";
import { useRouter } from 'next/router'
import {ObjectID} from 'bson';

export default function TestCaseModalForm(props) {
  const router = useRouter();
  const initialData = {
    _id: props.data?._id??new ObjectID(),
    name: props.data?.name??"",
    description: props.data?.description??"",
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
    const clone = JSON.parse(JSON.stringify(props.data));
    const BOM = clone.BOM.map((d) => {
      delete d.device;
      return d;
    });
    let newData = {
      ...props.data, 
      "_id":data._id, 
      "name":data.name, 
      "description":data.description,
      "BOM": BOM,
    }
    console.log("NewData:", newData);
    try{
      const res = await fetch('/api/editTestCase', {
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
    <>
      <Modal className={styles.Modal} isOpen={props.isOpen}>
        <h2>Fill in New Test Case Info</h2>
        <div style={{alignItems:borderLeft}}>
        <SmallTextInput label="Subject:" name='name' value={data.name} onChange={handleChange}/>
        <BigTextInput label="Description:" name='description' value={data.description} onChange={handleChange}/>
        </div>
        <CPButton text='Back' onClick={()=>{
          setData(initialData);
          props.onBack();}}/>
        {/* TODO: integrate add/edit api call for test case*/}
        <CPButton text='Done' onClick={handleSubmitData}/>
      </Modal>
    </>
  );
}

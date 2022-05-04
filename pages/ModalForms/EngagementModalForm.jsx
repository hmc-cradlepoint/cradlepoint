import React, { useState } from 'react';
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from "../../components/fields/Text";
import { borderLeft } from "@mui/system";
import PropTypes from 'prop-types';
import { useRouter } from 'next/router'
import { ObjectID } from 'bson';
import { modalFormType } from '../../util/modalUtils';

/**
 * 
 * @param {*} props 
 *      - modalFormType: what kind of flow this should be (edit or create new)
 *      - onClose: called when user is done with the modal
 *      - isOpen: whether the model is visible
 *      - onBack: close modal without submitting
 *      - [ONLY for edit flow] data: original data of a test plan 
 * @returns div of Engagement modal
 */
export default function EngagementModalForm(props) {
  const router = useRouter();
  // initial data that fills the Engagement modal
  // for each field, if not passed in from props, then default to empty (CREATE NEW case)
  // if passed in from props, this is the EDIT case so pre-fill with fields passed in

  const initialData = {
    name: props.data?.name ?? "",
    description: props.data?.description ?? "",
    customer: props.data?.customer ?? "",
    SFDC: props.data?.SFDC ?? "",
    SE: props.data?.SE ?? "",
    POC_Engineer: props.data?.POC_Engineer ?? "",
    statusCode: props.data?.statusCode ?? 1,
  }

  // state variable to keep track of the fields
  const [data, setData] = useState(initialData)

  /**
   * calls whenever user make changes to the fields to update the data variable
   * @param {*} evt onChange event
   */
  function handleChange(evt) {
    const value = evt.target.value;
    setData({
      ...data,
      [evt.target.name]: value
    });
  }
  
  /**
   * triggers by onClick of the Done button and calls the corresponding api 
   */
  async function handleSubmitData() {
    let newData = {
      ...props.data,
      "name": data.name,
      "description": data.description,
      "customer": data.customer,
      "SFDC": data.SFDC,
      "SE": data.SE,
      "POC_Engineer": data.POC_Engineer,
      "statusCode": data.statusCode,
      "createdOn": new Date(), // Schema provides a default val, not necessary to provide
    }

    // checks the modal for type, if NEW, calls add, else calls edit api
    let endPoint = '/api/edit/Engagement';
    let method = 'PUT';

    if (props.modalFormType === modalFormType.NEW) {
      endPoint = '/api/add/NewEngagement';
      method = 'POST';
    }

    try {
      const d = JSON.stringify(newData);
      const res = await fetch(endPoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(d)
        },
        body: d
      })
      if (res.statusCode && res.statusCode !== 200){
        // TODO: Instead of throwing an error, display what went wrong
        // console.log("RES:", res)
        throw new Error(res.error)
      }
    } catch (err) {
      // console.log("Error:", err)
      throw err
    }
    // close the modal
    props.onClose();

    // reset data only if it is a creating from new modal flow
    if (props.modalFormType == modalFormType.NEW) {
      setData(initialData);
    }
  }

  return (
      <Modal className={styles.content} isOpen={props.isOpen} overlayClassName={styles.overlay}>
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
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <CPButton text='Back' onClick={()=>{props.onBack(); setData(initialData);}}/>
          <CPButton text='Done' onClick={handleSubmitData}/>
        </div>
      </Modal>
  );
}

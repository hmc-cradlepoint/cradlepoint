import React, { useState } from 'react';
import Modal from 'react-modal';
import CPButton from "../components/button/CPButton";
import styles from '../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from "../components/fields/Text";
import { borderLeft } from "@mui/system";
import PropTypes from 'prop-types';
import { useRouter } from 'next/router'
import {ObjectID} from 'bson';

export default function EngagementModalForm(props) {
  const router = useRouter();

  const [data, setData] = useState({
    _id: new ObjectID(),
    name: "",
    customer: "",
    SFDC: "",
    engagementDetails: "",
  })

  function handleChange(evt) {
    const value = evt.target.value;
    setData({
      ...data,
      [evt.target.name]: value
    });
  }

  async function addNew() {
    // console.log("addNew is called with: " + JSON.stringify(data))
    // const res = await fetch(`${process.env.HOST}/api/addNewEngagement`, {
    //   body: JSON.stringify(data),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   method: 'POST'
    // })
    // router.push("/3EngagementDetails?_id=" + data._id);
  
    // const result = await res.json()

    // fetch(`${process.env.HOST}/api/addNewEngagement`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.parse(JSON.stringify(data)),
    // })
    // .then((resp) => {
    //   console.log(resp);
    //   console.log("Succesfully created new engagement");
    //   router.push("/3EngagementDetails?_id=" + data._id);
    // })
    // .catch((e) => console.log(e));
  }

  return (
      <Modal className={styles.Modal} isOpen={props.isOpen}>
        <h2>Fill in New Engagement Info</h2>
        <div style={{alignItems:borderLeft}}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <SmallTextInput label="Engagement Name:" name='name' value={data.name} onChange={handleChange}/>
          <SmallTextInput label='Customer' name='customer' value={data.customer} onChange={handleChange}/>
          <SmallTextInput label="SFDC:" name='SFDC' value={data.SFDC} onChange={handleChange}/>
          <BigTextInput label="Engagement Description:" name='engagementDetails' value={data.engagementDetails} onChange={handleChange}/>
        </div>

        </div>
        <CPButton text='Back' onClick={props.onBack}/>
        <CPButton text='Create' onClick={addNew}/>
      </Modal>
  );
}

EngagementModalForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onBack: PropTypes.bool.isRequired,
}
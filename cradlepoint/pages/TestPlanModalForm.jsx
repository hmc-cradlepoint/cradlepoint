import React from "react";
import Modal from 'react-modal';
import CPButton from "../components/button/CPButton";
import styles from '../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from '../components/fields/Text';
import { borderLeft } from "@mui/system";

export default function TestPlanModalForm(props) {
  return (
    <>
      <Modal className={styles.Modal} isOpen={props.modalOpen}>
        <h2>Edit Test Plan Info</h2>
        <div style={{alignItems:borderLeft}}>
          <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
          <div>
          <SmallTextInput name='Subject' />
          <SmallTextInput name='Active' />
          <SmallTextInput name='Version' />
          </div>
        <BigTextInput name='Customer Feedback' />
        </div>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        <BigTextInput name='Test Plan Description'/>
        <BigTextInput name='Device Config'/>
        </div>
        </div>
        <div style={{display: "flex", flexDirection: "row"}}>
          <CPButton text='Cancel' onClick={props.onBack}/>
          <CPButton text='Create'/>
        </div>
      </Modal>
    </>
  );
}

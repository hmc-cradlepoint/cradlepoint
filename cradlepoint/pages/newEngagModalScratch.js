import React from "react";
import Modal from 'react-modal';
import CPButton from "../components/button/CPButton";
import styles from '../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from "../components/fields/Text";
function NewEngagModalScratch(props) {
  return (
    <>
      <Modal className={styles.ModalEngagInfo} isOpen={props.modalOpen}>
        <h2>Create New Engagment from Cloning Existing Engagement</h2>
        <SmallTextInput name='Engagment Name' value={props.selectedRow.name}/>
        <SmallTextInput name='System Engineer Responsible' value={props.selectedRow.sysEng}/>
        <SmallTextInput name='POC Engineer Responsible' value={props.selectedRow.pocEng}/>
        <SmallTextInput name='Customer' value={props.selectedRow.customer}/>
        <SmallTextInput name='SFDC'/>
        <BigTextInput name='Engagment Description' value={props.selectedRow.details}/>
        <div>
        <CPButton text='Back' onClick={props.onBack}/>
        <CPButton text='Create'/>
        </div>
      </Modal>
    </>
  );
}

export default NewEngagModalScratch;
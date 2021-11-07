import React from "react";
import Modal from 'react-modal';
import CPButton from "../components/button/CPButton";
import styles from '../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from "../components/fields/Text";
function NewEngagModalScratch(props) {
  return (
    <>
      <Modal className={styles.ModalEngagInfo} isOpen={props.modalOpen}>
        <h2>Create New Engagment From Scratch</h2>
        <SmallTextInput name='Engagment Name'/>
        <SmallTextInput name='System Engineer Responsible'/>
        <SmallTextInput name='POC Engineer Responsible'/>
        <SmallTextInput name='Customer'/>
        <SmallTextInput name='SFDC'/>
        <BigTextInput name='Engagment Description'/>
        <div>
        <CPButton text='Back' onClick={props.onBack}/>
        <CPButton text='Create'/>
        </div>
      </Modal>
    </>
  );
}

export default NewEngagModalScratch;
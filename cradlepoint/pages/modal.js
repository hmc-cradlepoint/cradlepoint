import React from "react";
import Modal from 'react-modal';
import CPButton from "../components/button/CPButton";
import styles from '../styles/Modal.module.css'

function NewEngagModal(props) {
  return (
    <>
      <Modal className={styles.ModalButtonStack} isOpen={props.modalOpen}>
        <h2>Create New Engagment</h2>
        <CPButton text='From scratch' className="ModalButton"/>
        <CPButton text='From exisiting engagment (Clone)'/>
        <CPButton text='Cancel' onClick={()=>props.onClose(false)}/>
      </Modal>
    </>
  );
}

export default NewEngagModal;
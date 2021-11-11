import React from "react";
import Modal from 'react-modal';
import CPButton from "../components/button/CPButton";
import styles from '../styles/Modal.module.css'

function NewEngagModal(props) {

  return (
    <>
      <Modal className={styles.ModalSelect} isOpen={props.modalOpen}>
        <h2>Create New Engagement</h2>
        <CPButton text='From scratch' className="ModalButton" onClick={()=>{console.log('scratch clicked');
        props.onClickNext("scratch")}}/>
        <CPButton text='From exisiting engagement (Clone)' onClick={()=>props.onClickNext("clone")}/>
        <CPButton text='Cancel' onClick={()=>props.onClose(false)}/>
      </Modal>
    </>
  );
}

export default NewEngagModal;
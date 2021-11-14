import React from "react";
import Modal from 'react-modal';
import CPButton from "../components/button/CPButton";
import styles from '../styles/Modal.module.css'
import PropTypes from 'prop-types';

export default function CreateNewModal(props) {
  return (
      <Modal className={styles.ModalSelect} isOpen={props.modalOpen}>
        <h2>Create New {props.isEngagementOrTestPlan === "TEST_PLAN" ? "Test Plan" : "Engagement"}</h2>
        <CPButton text='From scratch' className="ModalButton" onClick={()=>{console.log('scratch clicked');
        props.onClickNext("scratch")}}/> 
        <CPButton text='From exisiting engagement (Clone)' onClick={()=>props.onClickNext("clone")}/>
        <CPButton text='Cancel' onClick={()=>props.onClose(false)}/>
      </Modal>
  );
}

CreateNewModal.propTypes = {
  onClose: PropTypes.bool.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  onClickNext:PropTypes.func.isRequired,
  testPlanOrEngagement: PropTypes.string.isRequired,
}


import React from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from "../../components/fields/Text";
import { borderLeft } from "@mui/system";

export default function EditTestCaseModalInfo(props) {
  return (
    <>
      <Modal className={styles.Modal} isOpen={props.modalOpen}>
        <h2>Edit Test Case Info</h2>
        <div style={{alignItems:borderLeft}}>
        <SmallTextInput name='Subject' value={props.selectedRow.subject}/>
        <BigTextInput name='Description' value={props.selectedRow.description}/>
        </div>
        <CPButton text='Cancel' onClick={props.onBack}/>
        <CPButton text='Save'/>
      </Modal>
    </>
  );
}

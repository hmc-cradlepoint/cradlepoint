import React from "react";
import Modal from 'react-modal';
import CPButton from "../components/button/CPButton";
import styles from '../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from "../components/fields/Text";
import { borderLeft } from "@mui/system";

export default function TestModalForm(props) {
  return (
    <>
      <Modal className={styles.Modal} isOpen={props.isOpen}>
        <h2>Fill in Test Info</h2>
        <div style={{alignItems:borderLeft}}>
        <SmallTextInput name='Subject' />
        <BigTextInput name='Description' />
        </div>
        <CPButton text='Back' onClick={props.onBack}/>
        <CPButton text='Create'/>
      </Modal>
    </>
  );
}

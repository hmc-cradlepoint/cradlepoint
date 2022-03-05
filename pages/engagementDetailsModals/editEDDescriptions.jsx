import React from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from "../../components/fields/Text";

export default function EditEDDescription(props) {
  // TODO: For edit description, make first value the existing value
  return (
    <>
      <Modal className={styles.Modal} isOpen={props.modalOpen}>
        <h2>Edit Engagement Details Descriptions</h2>
        <div style={{display: "flex", flexDirection: "row"}}>
          <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
              <SmallTextInput name='ID'/>
              <SmallTextInput name='Client'/>
              <SmallTextInput name='SFDC' />
              <SmallTextInput name='Status'/>
              <SmallTextInput name='System Engineer'/>
              <SmallTextInput name='POC Engineer'/>
          </div>
          <div>
            <BigTextInput name="Description" />
          </div>
        </div>
        <div style={{display: "flex", flexDirection: "row"}}>
          <CPButton text='Cancel' onClick={props.onBack}/>
          <CPButton text='Save'/>
        </div>
      </Modal>
    </>
  );
}

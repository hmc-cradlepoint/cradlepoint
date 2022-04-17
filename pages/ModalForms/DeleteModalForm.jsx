import React, {useState} from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'

export default function DeleteModalForm(props) {
  return (
    //   update modal style when modal PR is approved and merged
    <Modal className={styles.Modal} isOpen={props.isOpen}>
        <h2>Are you sure you want to delete this? This action is irreversible.</h2>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <CPButton text='Back' onClick={props.onBack}/>
            <CPButton text='Delete' onClick={() => props.handleDelete(true)}/>
        </div>
    </Modal>
  );
}

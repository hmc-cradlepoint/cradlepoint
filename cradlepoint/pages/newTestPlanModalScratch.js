import React from "react";
import Modal from 'react-modal';
import CPButton from "../components/button/CPButton";
import styles from '../styles/Modal.module.css'
import { SmallTextInput, BigTextInput } from "../components/fields/Text";
import { borderLeft } from "@mui/system";
import PropTypes from 'prop-types';

export default function NewTestPlanModalScratch(props) {
    return (
    <Modal className={styles.ModalEngagInfo} isOpen={props.modalOpen}>
        <h2>Fill in New Engagement Info</h2>
        <div style={{alignItems:borderLeft}}>
        <SmallTextInput name='Engagement Name' value={props.selectedRow.name}/>
        <SmallTextInput name='Customer' value={props.selectedRow.customer}/>
        <SmallTextInput name='SFDC'/>
        <BigTextInput name='Engagement Description' value={props.selectedRow.details}/>
        </div>
        <CPButton text='Back' onClick={props.onBack}/>
        <CPButton text='Create'/>
    </Modal>
  );
}

NewTestPlanModalScratch.propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    onBack: PropTypes.bool.isRequired,
    onClickNext:PropTypes.func.isRequired,
    testPlanOrEngagement: PropTypes.string.isRequired,
}

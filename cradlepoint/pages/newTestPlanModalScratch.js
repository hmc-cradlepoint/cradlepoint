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
        <h2>Fill in New Test Plan Info</h2>
        <div style={{alignItems:borderLeft}}>
        <SmallTextInput name='Subject' value={props.selectedRow.name}/>
        {/* TODO: change to file input later */}
        <SmallTextInput name='Topology' value={props.selectedRow.topology}/>
        <BigTextInput name='Description' value={props.selectedRow.description}/>
        <BigTextInput name='Device Configuration' value={props.selectedRow.deviceConfig}/>
        {/* TODO: change to dropdown later */}
        <SmallTextInput name='Status' value={props.selectedRow.status}/>
        <SmallTextInput name='Current TPEs' value={props.selectedRow.currentTPEs}/>
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

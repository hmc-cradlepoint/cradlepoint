import React from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css';
import { SmallTextInput, BigTextInput } from "../../components/fields/Text";
import { borderLeft } from "@mui/system";
import PropTypes from 'prop-types';
import UploadComponents from "../../components/UploadComponents";

export default function NewTestPlanModalScratch(props) {
    return (
    <Modal className={styles.ModalEngagInfo} isOpen={props.isOpen}>
        <h2>Fill in New Test Plan Info</h2>
        <div style={{alignItems:borderLeft}}>
          <SmallTextInput name='Subject'/>
          {/* TODO: change to file input later */}
          <SmallTextInput name='Topology'/>
          <BigTextInput name='Description'/>
          <BigTextInput name='Device Configuration'/>
          {/* TODO: change to dropdown later */}
          <SmallTextInput name='Status'/>
          <SmallTextInput name='Current TPEs'/>
        </div>
        <div style={{display: "flex", flexDirection: "row"}}>
          <CPButton text='Cancel' onClick={props.onBack}/>
          <CPButton text='Create'/>
        </div>
    </Modal>
  );
}

NewTestPlanModalScratch.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onBack: PropTypes.bool.isRequired,
    onClickNext:PropTypes.func.isRequired,
    testPlanOrEngagement: PropTypes.string.isRequired,
}

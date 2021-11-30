import React from "react";
import Modal from 'react-modal';
import CPButton from "../components/button/CPButton";
import styles from '../styles/Modal.module.css'
import PropTypes from 'prop-types';
import { Field, Formik} from 'formik';
import DropDown from "../components/fields/DropDown";
import { SmallTextInput, BigTextInput } from "../components/fields/Text";
import { borderLeft } from "@mui/system";

export default function ResultModalForm(props) {
    const options = [ 'passed', 'unknown',  'failed'];
    
  return (
      <Modal className={styles.Modal} isOpen={props.modalOpen}>
        <h2>Add New Result to Test</h2>
        <div style={{alignItems:borderLeft}}>
        <div style={{display:"flex"}}> 
            <p>Result Status:    </p>
            <DropDown name={"Result Status"} 
                options={options}/>
            </div>
        <BigTextInput name='Detail Description' value={props.selectedRow.details}/>
        </div>
        <CPButton text='Back' onClick={props.onBack}/>
        <CPButton text='Create'/>
      </Modal>
  );
}

ResultModalForm.propTypes = {
  onClose: PropTypes.bool.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  onClickNext:PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
}


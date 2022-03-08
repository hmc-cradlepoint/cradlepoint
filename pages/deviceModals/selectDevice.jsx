import React from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { makeStyles } from '@mui/styles';
import {CheckBoxTable} from "../../components/tables/Table"
import {LibraryBOMColumns } from "../../util/tableColumns";
import styling from '../../styles/tableStyling';

export default function SelectDeviceModal(props) {
  console.log(props)
  const useStyles = makeStyles(styling);
  
  const classes = useStyles();

  let selectedRowData = [];
  function updateSelection(ids){
    const selectedIDs = new Set(ids);
    selectedRowData = props.modalData.filter((row) =>
        selectedIDs.has(row._id.toString()));
    console.log(selectedRowData);
  }

  return (
    <>
      <Modal className={styles.Modal} isOpen={props.modalOpen}>
        <h2>Add new device(s) </h2>
        <CheckBoxTable rows={props.modalData} columns={LibraryBOMColumns} className={classes.root}
                onSelectionModelChange={(ids)=>{updateSelection(ids)}} 
        />
        <CPButton text='Cancel' onClick={()=>{props.onBack();}}/>
        <CPButton text='Next' onClick={()=>{
          props.setSelectedRows(selectedRowData);
          props.onClickNext("select_quantity");
          }
          }/>
      </Modal>
    </>
  );
}

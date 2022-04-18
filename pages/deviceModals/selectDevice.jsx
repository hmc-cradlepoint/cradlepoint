import React from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { makeStyles } from '@mui/styles';
import {CheckBoxTable} from "../../components/tables/Table"
import {LibraryBOMColumns } from "../../util/tableColumns";
import styling from '../../styles/tableStyling';

export default function SelectDeviceModal(props) {
  const useStyles = makeStyles({styling});
  const classes = useStyles(props);

  let selectedIDs = new Set(props.selectedIDs)

  function updateSelection(ids){
    selectedIDs = new Set();
    ids.forEach(id => selectedIDs.add(id));
  }
  
  return (
    <>
      <Modal className={styles.Modal} isOpen={props.modalOpen}>
        <h2>Add new device(s) </h2>
        <CheckBoxTable rows={props.modalData} columns={LibraryBOMColumns} className={classes.root}
                onSelectionModelChange={(ids)=>{updateSelection(ids)}} 
        />
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <CPButton text='Cancel' onClick={()=>{props.onBack();}}/>
          <CPButton text='Next' onClick={()=>{
              props.setSelectedIDs(selectedIDs);
              props.onClickNext("select_quantity");
            }
          }/>
        </div>
      </Modal>
    </>
  );
}

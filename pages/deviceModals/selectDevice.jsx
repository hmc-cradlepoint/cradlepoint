import React from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { makeStyles } from '@mui/styles';
import {CheckBoxTable} from "../../components/tables/Table"
import {LibraryBOMColumns } from "../../util/tableColumns";
import styling from '../../styles/tableStyling';

/**
 * 
 * @param {*} props 
 *    - modalOpen: boolean of whether modal is visible
 *    - onClickNext: called when user is done with this modal
 *    - onBack: close modal without submitting
 *    - modalData: the library devices
 *    - selectedIDs: keep track of the ids of the devices that are selected 
 *        (if user goes to the next modal (selectQuantityModal) and decide to come back to modify their selection,
 *         the selected devices remain selected)
 *    - setSelectedIds: function to update the selectedIds state variable in TestCaseDetails Page
 * 
 * @returns the Select Device Modal which allows users to select devices from the library to add to their BOM
 */
export default function SelectDeviceModal(props) {
  // Styling
  const useStyles = makeStyles({styling});
  const classes = useStyles(props);

  // variable to keep track of the ids of the selected devices
  let selectedIDs = new Set(props.selectedIDs)

  /**
   * Updates the selectIDs variable whenever there is change is selection in the checkbox table
   * @param {*} ids the ids that are selected
   * 
   */
  function updateSelection(ids){
    selectedIDs = new Set();
    ids.forEach(id => selectedIDs.add(id));
  }
  
  return (
    <>
      <Modal className={styles.Modal} isOpen={props.modalOpen}>
        <h2>Add new device(s) </h2>
        {/* The table of library devices with checkboxes */}
        <CheckBoxTable rows={props.modalData} columns={LibraryBOMColumns} className={classes.root}
                onSelectionModelChange={(ids)=>{updateSelection(ids)}} 
        />

        {/* Buttons */}
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

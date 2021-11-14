import React from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { makeStyles } from '@mui/styles';
import {PlainTable, CheckBoxTable} from "../../components/tables/Table"
import { BOMRows, LibraryBOMColumns } from "../../util/tableColumns";


export default function SelectDevice(props) {
  const useStyles = makeStyles({
    root: {
      '& .header': {
        backgroundColor: '#FCAC1C',
      },
      '& .MuiDataGrid-iconSeparator': {
        display: 'None'
      },
      '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
        borderRight: `2px solid #f0f0f0`,
      },

    },
  });

const classes = useStyles();


  return (
    <>
      <Modal className={styles.Modal} isOpen={props.modalOpen}>
        <h2>Add new device(s) to the summary BOM</h2>
        <CheckBoxTable rows={BOMRows} columns={LibraryBOMColumns} className={classes.root} 
        />
        <CPButton text='Cancel' onClick={props.onBack}/>
        <CPButton text='Next' onClick={()=>props.onClickNext("select_quantity")}/>
      </Modal>
    </>
  );
}

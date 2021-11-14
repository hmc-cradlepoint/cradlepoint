import React from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { makeStyles } from '@mui/styles';
import {PlainTable} from "../../components/tables/Table"

function NewTestCaseClone(props) {
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

const testCaseColumns = [
    { field: 'id', headerName: 'id', headerClassName: 'header', flex: 1},
    { field: 'subject', headerName: 'Subject', headerClassName: 'header', flex: 1},
    { field: 'description', headerName: 'Description', headerClassName: 'header', sortable:false, flex: 2, minWidth: 200},
  ];

// TODO: make rows not hard coded (delete later)
const rows = [
    {id: 1, subject: 'Test case 1', description: 'This is a detail description of the test case'},
    {id: 2, subject: 'Test case 2', description: 'This is a detail description of the test case'},
    {id: 3, subject: 'Test case 3', description: 'This is a detail description of the test case'},
    {id: 4, subject: 'Test case 4', description: 'This is a detail description of the test case'},
    {id: 5, subject: 'Test case 5', description: 'This is a detail description of the test case'},
    {id: 6, subject: 'Test case 6', description: 'This is a detail description of the test case'},
    {id: 7, subject: 'Test case 7', description: 'This is a detail description of the test case'}
  ]

  return (
    <>
      <Modal className={styles.Modal} isOpen={props.modalOpen}>
        <h2>Choose an Existing Test Case to Clone from</h2>
        <PlainTable rows={rows} columns={testCaseColumns} className={classes.root} 
        onRowClick={item=>{console.log("row clicked");
                    console.log(item);
                    props.onClickNext("clone_selected", item.id)
                  }
                    }/>
        <CPButton text='Back' onClick={props.onBack}/>
      </Modal>
    </>
  );
}

export default NewTestCaseClone;
import React, { useState } from 'react';
import Modal from 'react-modal';
import { PlainTable } from "../components/tables/Table";
import { makeStyles } from '@mui/styles';
import styles from '../styles/Modal.module.css'
import CPButton from '../components/button/CPButton';
import PropTypes from 'prop-types';
import {engagementColumns, testPlanColumns, testCaseColumns, engagementRows, testPlanRows, testCaseRows} from '../util/tableColumns'


export default function NewModalClone(props) {
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

  function renderColumns(type){
    switch (type){
      case "Engagement":
        return engagementColumns.concat([{ 
          field: 'button', 
          flex: 1,
          minWidth: 100,
          headerName: 'Actions',
          headerClassName: 'header',
          align: 'center',
          renderCell: () => (
            <CPButton text="clone" onClick={()=>console.log("clone_selected")}/>
          )
        }]); 
      case "Test Plan":
        return testPlanColumns.concat([
        { 
          field: 'button', 
          flex: 1,
          minWidth: 100,
          headerName: 'Actions',
          headerClassName: 'header',
          align: 'center',
          // TODO: figure out how to get row ID from render cell function
          renderCell: () => (
            <CPButton text="clone" onClick={() => {props.onClickNext("clone_selected")}}/>
          )
        }
        ]);
        
      case "Test Case":
        return testCaseColumns.concat([
          { 
            field: 'button', 
            flex: 1,
            minWidth: 100,
            headerName: 'Actions',
            headerClassName: 'header',
            align: 'center',
            // TODO: figure out how to get row ID from render cell function
            renderCell: () => (
              <CPButton text="clone" onClick={() => {props.onClickNext("clone_selected")}}/>
            )
          }
          ]);
    }
  }

  // TODO: delete later when integrated
  function renderRows(type){
    switch (type){
      case "Engagement":
        return engagementRows;
      case "Test Plan":
        return testPlanRows;
      case "Test Case":
        return testCaseRows;
    }
  }
  return (
    <Modal className={styles.Modal} isOpen={props.modalOpen}>
        <h2>Choose an Existing {props.type} to Clone</h2>
        <PlainTable 
            rows={renderRows(props.type)} 
            columns={renderColumns(props.type)} 
            className={classes.root}/> 
        <CPButton text='Back' onClick={props.onBack}/>
    </Modal>
  );
}

NewModalClone.propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    onBack: PropTypes.bool.isRequired,
    onClickNext:PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
}

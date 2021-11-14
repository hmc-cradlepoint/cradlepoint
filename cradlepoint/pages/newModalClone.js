import React, { useState } from 'react';
import Modal from 'react-modal';
import { PlainTable } from "../components/tables/Table";
import { makeStyles } from '@mui/styles';
import styles from '../styles/Modal.module.css'
import CPButton from '../components/button/CPButton';
import PropTypes from 'prop-types';


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

const engagementColumns = [
    { field: 'id', headerName: 'id', headerClassName: 'header', flex: 1, hide: true},
    { field: 'name', headerName: 'Name', headerClassName: 'header', flex: 1},
    { field: 'status', headerName: 'Status', headerClassName: 'header', flex: 1},
    { field: 'details', headerName: 'Details', headerClassName: 'header', sortable:false, flex: 2, hide: true, minWidth: 200},
    { field: 'sysEng', headerName: 'SEng', headerClassName: 'header', flex: 1},
    { field: 'pocEng', headerName: 'POC Eng', headerClassName: 'header', flex: 1},
    { field: 'customer', headerName: 'Customer', headerClassName: 'header', flex: 1},
    { field: 'sfdc', headerName: 'SFDC', headerClassName: 'header', flex: 1},
    { field: 'dateCreated', headerName: 'Date Created', headerClassName: 'header', flex: 1},
    { 
      field: 'button', 
      flex: 1,
      minWidth: 100,
      headerName: 'Actions',
      headerClassName: 'header',
      align: 'center',
      renderCell: () => (
        <CPButton text="clone" onClick={()=>console.log("cloned")}/>
      )
    }
  ];

const testPlanColumns = [
    { field: 'id', headerName: 'ID', headerClassName: 'header', flex: 1, hide: true},
    { field: 'subject', headerName: 'Subject', headerClassName: 'header', flex: 1},
    { field: 'topology', headerName: 'Topology', headerClassName: 'header', flex: 1},
    { field: 'description', headerName: 'Description', headerClassName: 'header', flex: 2},
    { field: 'deviceConfig', headerName: 'Device Config', headerClassName: 'header', flex: 1},
    { field: 'status', headerName: 'Status', headerClassName: 'header', flex: 1},
    { field: 'currentTPEs', headerName: 'Current TPEs', headerClassName: 'header', flex: 1},
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
  ];

    // TODO: make rows not hard coded (delete later)
const tempRows = [
    {id: 1, name: 'Engagement 1', status: 'Pending', details: ' ', sysEng: 'John Rogers',	pocEng: 'Paul Switchport', customer: 'ABC Bus Company', sfdc: 'https://cradlepoint.lightning.force.com/lightning/r/Opportunity/0063800000qtILXAA2/view', dateCreated: '10/01/2021'},
    {id: 2, name: 'Engagement 2', status: 'Assigned', details: ' ', sysEng: 'Michael Smith', pocEng: 'George Packets', customer: 'Big Finance', sfdc: 'https://cradlepoint.lightning.force.com/lightning/r/Opportunity/0063800000qtILXAA2/view', dateCreated: '10/02/2021'},
    {id: 3, name: 'Engagement 3', status: 'POC testing complete', details: ' ', sysEng: 'Don Lee', pocEng: 'Ron State', customer: 'SensorCo', sfdc: 'https://cradlepoint.lightning.force.com/lightning/r/Opportunity/0063800000qtILXAA2/view', dateCreated: '10/03/2021'},
    {id: 4, name: 'Engagement 4', status: 'POC testing outcome', details: ' ', sysEng: 'Jim Black', pocEng: 'Jason Dumps', customer: 'Burgerz-R-us', sfdc: 'https://cradlepoint.lightning.force.com/lightning/r/Opportunity/0063800000qtILXAA2/view', dateCreated: '10/04/20201'},
    {id: 5, name: 'Engagement 5', status: 'POC approved', details: ' ', sysEng: 'Don Lee', pocEng: 'Paul Switchport', customer: 'SensorCo', sfdc: 'https://cradlepoint.lightning.force.com/lightning/r/Opportunity/0063800000qtILXAA2/view', dateCreated: '10/05/20201'},
    {id: 6, name: 'Engagement 6', status: 'Archieved', details: ' ', sysEng: 'Jim Black', pocEng: 'George Packets', customer: 'Burgerz-R-us', sfdc: 'https://cradlepoint.lightning.force.com/lightning/r/Opportunity/0063800000qtILXAA2/view', dateCreated: '10/06/20201'}
    ];  

  return (
    <Modal className={styles.Modal} isOpen={props.modalOpen}>
        <h2>Choose an Existing {props.testPlanOrEngagement === 'TEST_PLAN' ? "Test Plan" : "Engagement"} to Clone</h2>
        <PlainTable rows={tempRows} 
            columns={props.testPlanOrEngagement === 'TEST_PLAN' ? testPlanColumns : engagementColumns} 
            className={classes.root}/> 
        <CPButton text='Back' onClick={props.onBack}/>
    </Modal>
  );
}

NewModalClone.propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    onBack: PropTypes.bool.isRequired,
    onClickNext:PropTypes.func.isRequired,
    testPlanOrEngagement: PropTypes.string.isRequired,
}

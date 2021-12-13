import React, {useState} from "react";
import Modal from 'react-modal';
import CPButton from "../components/button/CPButton";
import styles from '../styles/Modal.module.css';
import {PlainTable} from '../components/tables/Table';
import { engagementColumns, testPlanColumns, testCaseColumns, testColumns } from '../util/tableColumns';
import { makeStyles } from '@mui/styles';
import {flowType, modalType, modalFormType} from '../util/modalUtils';

import EngagementModalForm from './ModalForms/EngagementModalForm';
import TestPlanModalForm from './ModalForms/TestPlanModalForm';
import TestCaseModalForm from './ModalForms/TestCaseModalForm';
import TestModalForm from './ModalForms/TestModalForm';
import styling from '../styles/tableStyling';

export default function CreateNewModalFlow(props) {
  const [modal, setModalType] = useState(modalType.START);

  function CloneModal() {
    const useStyles = makeStyles(styling);
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
              <CPButton text="clone" onClick={()=>setModalType(modalType.CLONE)}/>
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
              <CPButton text="clone" onClick={() => {setModalType(modalType.CLONE)}}/>
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
                <CPButton text="clone" onClick={() => {setModalType(modalType.CLONE)}}/>
              )
            }
            ]);
        case "Test":
          return testColumns.concat([
            { 
              field: 'button', 
              flex: 1,
              minWidth: 100,
              headerName: 'Actions',
              headerClassName: 'header',
              align: 'center',
              // TODO: figure out how to get row ID from render cell function
              renderCell: () => (
                <CPButton text="clone" onClick={() => {setModalType(modalType.CLONE)}}/>
              )
            }
            ]);
      }
    }

    return (
      <Modal className={styles.Modal} isOpen={true}>
          <h2>Choose an Existing {props.type} to Clone</h2>
          <PlainTable 
              rows={props.modalData}
              columns={renderColumns(props.type)}
              className={classes.root}/> 
          <CPButton text='Back' onClick={() => setModalType(modalType.START)}/>
      </Modal>
    );
  }

  function StartModal() {
    return (
        <Modal className={styles.Modal} isOpen={props.modalOpen && modal === modalType.START}>
          <h2>Create New {props.type}</h2>
          <CPButton text='From scratch' className="ModalButton" onClick={() => setModalType(modalType.SCRATCH)}/>
          <CPButton text={'From exisiting ' + props.type + ' (Clone)'} onClick={()=>setModalType(modalType.CLONE)}/>
          <CPButton text='Cancel' onClick={props.onClose}/>
        </Modal>
    );
  }

  function ScratchModal() {
    switch (props.type) {
      case flowType.ENGAGEMENT:
        return <EngagementModalForm modalFormType={modalFormType.NEW} isOpen={true} onBack={() => setModalType(modalType.START)}/>
      case flowType.TEST_PLAN:
        return <TestPlanModalForm modalFormType={modalFormType.NEW} isOpen={true} onBack={() => setModalType(modalType.START)}/>
      case flowType.TEST_CASE:
        return <TestCaseModalForm modalFormType={modalFormType.NEW} isOpen={true} onBack={() => setModalType(modalType.START)}/>
      case flowType.TEST:
        return <TestModalForm modalFormType={modalFormType.NEW} isOpen={true} onBack={() => setModalType(modalType.START)} />
      }
  }

  switch (modal) {
    case modalType.START:
      return <StartModal />;
    case modalType.SCRATCH:
      return <ScratchModal />;
    case modalType.CLONE:
      return <CloneModal />;
  }
}

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
  const [cloneData, setCloneData] = useState(null);
  const [isClone, setIsClone] = useState(false);

  function CloneModal() {
    const useStyles = makeStyles({styling});
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
            renderCell: (data) => (
              <CPButton text="clone" onClick={() => {setCloneData(data.row);
                                                      setModalType(modalType.SCRATCH);
                                                      console.log(data)
                                                      }}/>
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
              renderCell: (data) => (
                <CPButton text="clone" onClick={() => {setCloneData(data.row);
                                                        setModalType(modalType.SCRATCH);
                                                        console.log(data)
                                                        }}/>
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
              renderCell: () => (
                <CPButton text="clone" onClick={() => {setModalType(modalType.CLONE)}}/>
              )
            }
            ]);
      }
    }

    function renderRows(type){
      switch (type){
        case "Engagement":
          return props.modalData.allEngagements;
        case "Test Plan":
          return props.modalData.allTestPlans;
        case "Test Case":
          return props.modalData.allTestCases;
        case "Test":
          return props.modalData.allTests;
      }
    }
    return (
      <Modal className={styles.Modal} isOpen={true}>
          <h2>Choose an Existing {props.type} to Clone</h2>
          <PlainTable 
              // rows={props.modalData}
              rows={renderRows(props.type)}
              columns={renderColumns(props.type)}
              className={classes.root}/> 
          <CPButton text='Back' onClick={() => setModalType(modalType.START)}/>
      </Modal>
    );
  }

  function StartModal() {
    return (
      <Modal className={styles.content} overlayClassName={styles.overlay} isOpen={props.modalOpen && modal === modalType.START}>
          <h2>Create New {props.type}</h2>
          <CPButton text='From scratch' className="ModalButton" onClick={() => {setIsClone(false);setModalType(modalType.SCRATCH); setScratchIsOpen(true);}}/>
          <CPButton text={'From exisiting ' + props.type + ' (Clone)'} onClick={()=>{setIsClone(true);setModalType(modalType.CLONE)}}/>
          <CPButton text='Cancel' onClick={props.onClose}/>
        </Modal>
    );
  }

  const [scratchIsOpen, setScratchIsOpen] = useState(true);
  

  function ScratchModal() {
    switch (props.type) {
      case flowType.ENGAGEMENT:
        return <EngagementModalForm modalFormType={modalFormType.NEW} 
                                    isOpen={scratchIsOpen} 
                                    onBack={() => setModalType(modalType.START)} 
                                    onClose={()=> {setScratchIsOpen(false); setModalType(modalType.START); props.onClose();}}/>
      case flowType.TEST_PLAN:
        return <TestPlanModalForm engagementId={props.modalData.engagement._id}
                                  modalFormType={modalFormType.NEW} 
                                  cloneData={cloneData}
                                  isClone={isClone}
                                  isOpen={scratchIsOpen} 
                                  onBack={() => setModalType(modalType.START)}
                                  onClose={()=> {setScratchIsOpen(false); 
                                                setModalType(modalType.START); 
                                                props.onClose();
                                                setCloneData(null);}}/>
      case flowType.TEST_CASE:
        return <TestCaseModalForm testPlanId={props.modalData.testPlanData._id} 
                                  modalFormType={modalFormType.NEW} 
                                  cloneData={cloneData}
                                  isClone={isClone}
                                  isOpen={scratchIsOpen} 
                                  onBack={() => setModalType(modalType.START)}
                                  onClose={()=> {setScratchIsOpen(false); 
                                                  setModalType(modalType.START); 
                                                  props.onClose();
                                                  setCloneData(null);}} 
                                  />
      case flowType.TEST:
        return <TestModalForm testCaseId={props.modalData.testCase._id} 
                              modalFormType={modalFormType.NEW} 
                              isOpen={scratchIsOpen} 
                              onBack={() => setModalType(modalType.START)}
                              onClose={()=> {setScratchIsOpen(false); props.onClose();}} 
                              />
      }
  }
  
  switch (modal) {
    case modalType.START:
      return <StartModal />;
    case modalType.SCRATCH:
      return <ScratchModal/>;
    case modalType.CLONE:
      return <CloneModal/>;
  }
}

import React from "react";
import {flowType, modalFormType} from '../util/modalUtils';
import EngagementModalForm from './ModalForms/EngagementModalForm';
import TestPlanModalForm from './ModalForms/TestPlanModalForm';
import TestCaseModalForm from './ModalForms/TestCaseModalForm';
import TestModalForm from './ModalForms/TestModalForm';

export default function EditModalFlow(props) {

  function getModal() {
    switch (props.type) {
      case flowType.ENGAGEMENT:
        return <EngagementModalForm modalFormType={modalFormType.EDIT} data={props.data} isOpen={props.modalOpen} onBack={props.onClose}/>
      case flowType.TEST_PLAN:
        return <TestPlanModalForm modalFormType={modalFormType.EDIT} data={props.data} isOpen={props.modalOpen} onBack={props.onClose}/>
      case flowType.TEST_CASE:
        return <TestCaseModalForm modalFormType={modalFormType.EDIT} data={props.data} isOpen={props.modalOpen} onBack={props.onClose}/>
      case flowType.TEST:
        return <TestModalForm modalFormType={modalFormType.EDIT} data={props.data} isOpen={props.modalOpen} onBack={props.onClose} />
      }
  }
    return (
      getModal()
    );
  }

  
  



import React from "react";
import {flowType, modalFormType} from '../util/modalUtils';
import EngagementModalForm from './ModalForms/EngagementModalForm';
import TestPlanModalForm from './ModalForms/TestPlanModalForm';
import TestCaseModalForm from './ModalForms/TestCaseModalForm';
import TestModalForm from './ModalForms/TestModalForm';
import ResultModalForm from "./ResultModalForm";

export default function EditModalFlow(props) {

  function getModal() {
    switch (props?.type) {
      case flowType.ENGAGEMENT:
        return <EngagementModalForm modalFormType={modalFormType.EDIT} 
                                    data={props?.data} 
                                    isOpen={props?.modalOpen} 
                                    onBack={props?.onClose}
                                    onClose={props?.onClose}/>
      case flowType.TEST_PLAN:
        return <TestPlanModalForm modalFormType={modalFormType.EDIT} 
                                  data={props?.data} 
                                  engagementId={props?.data.engagementId}
                                  isOpen={props?.modalOpen} 
                                  onBack={props?.onClose}
                                  onClose={props?.onClose}/>
      case flowType.TEST_CASE:
        return <TestCaseModalForm modalFormType={modalFormType.EDIT} 
                                  data={props?.data} 
                                  testPlanId={props?.data.testPlanId}
                                  isOpen={props?.modalOpen} 
                                  onBack={props?.onClose} 
                                  onClose={props?.onClose}/>
      case flowType.TEST:
        return <TestModalForm modalFormType={modalFormType.EDIT} 
                              data={props?.data} 
                              testCaseId={props?.data.testCaseId}
                              isOpen={props?.modalOpen} 
                              // Note that this is NOT duplicating because for createModalFlow onBack and onClose are different
                              // The TestModalForm will call both
                              onBack={props?.onClose} 
                              onClose={props?.onClose}/>
      case flowType.RESULT:
        return <ResultModalForm modalFormType={modalFormType.EDIT} 
                                data={props?.data} 
                                isOpen={props?.modalOpen} 
                                onBack={props?.onClose} />
      default:
        console.log('Not valid flow type')
        return <div>Something went wrong here</div>
      }
  }
    return (
      getModal()
    );
  }

  
  



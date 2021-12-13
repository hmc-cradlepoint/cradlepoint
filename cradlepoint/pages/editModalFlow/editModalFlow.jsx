import React, {useState} from "react";
import {flowType} from './utils';

import EngagementModalForm from '../EngagementModalForm';
import TestPlanModalForm from '../TestPlanModalForm';
import TestCaseModalForm from '../TestCaseModalForm';
import TestModalForm from '../TestModalForm';

export default function EditModalFlow(props) {

  function getModal() {
    switch (props.type) {
      case flowType.ENGAGEMENT:
        return <EngagementModalForm data={props.data} isOpen={props.modalOpen} onBack={props.onClose}/>
      case flowType.TEST_PLAN:
        return <TestPlanModalForm data={props.data} isOpen={props.modalOpen} onBack={props.onClose}/>
      case flowType.TEST_CASE:
        return <TestCaseModalForm data={props.data} isOpen={props.modalOpen} onBack={props.onClose}/>
      case flowType.TEST:
        return <TestModalForm data={props.data} isOpen={props.modalOpen} onBack={props.onClose} />
      }
  }
    return (
      getModal()
    );
  }

  
  



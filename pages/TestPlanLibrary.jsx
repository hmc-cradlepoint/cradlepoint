import React, { useState, useEffect } from 'react';
import PlainScreen from "../components/baseScreen/PlainScreen";
import { PlainTable } from "../components/tables/Table";
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import { testPlanColumns } from '../util/tableColumns';
import CreateNewModalFlow from './createNewModalFlow';
import { flowType } from '../util/modalUtils';
import styling from '../styles/tableStyling';

 {/* TODO: create new modal flow for libraries are not working yet. Add test plan to library api is not yet implemented */}
export default function TestPlanLibrary(props) {
    // Styling
    const useStyles = makeStyles({styling});
    const classes = useStyles();

    // Test plan table columns
    const testPlanColumnsWithActions = testPlanColumns.concat([
        { 
          field: 'button', 
          flex: 1,
          minWidth: 100,
          headerName: 'Actions',
          headerClassName: 'header',
          align: 'center',
          renderCell: () => (
            <CPButton text="View"/>
          )
        }
      ]);

    // controls create new modal flow
    const [createNewFlow, setCreateNewFlow] = useState(false);

    return(
      <>
         {/* TODO: create new modal flow for libraries are not working yet */}
        <CreateNewModalFlow type={flowType.TEST_PLAN} modalOpen={createNewFlow} onClose={() => setCreateNewFlow(false)} />
        <PlainScreen>
            <CPButton 
              text="Create New Test Plan"
              onClick={() => setCreateNewFlow(true)}
            />
            <PlainTable rows={props.testPlansData} columns={testPlanColumnsWithActions} className={classes.root}/>

      </PlainScreen>
      </>
    )
}

import {getLibraryTestPlans} from "./api/getLibraryTestPlans";
/**
 * 
 * @param {*} context 
 * @returns props that includes all library test plans
 */
export async function getServerSideProps(context) {
  try {
    // get the library test plans
    const testPlansData = await getLibraryTestPlans();
    return {
      props: {testPlansData}, // will be passed to the page component as props
    }
  }
  catch(err) {
      throw err;
  }

} 

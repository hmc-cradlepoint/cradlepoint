import React, { useState, useEffect } from 'react';
import PlainScreen from "../components/baseScreen/PlainScreen";
import { PlainTable } from "../components/tables/Table";
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import { testCaseColumns, testCaseRows } from '../util/tableColumns';
import CreateNewModalFlow from './createNewModalFlow';
import { flowType } from '../util/modalUtils';
import styling from '../styles/tableStyling';

 {/* TODO: create new modal flow for libraries are not working yet. Add test case to library api is not yet implemented */}
export default function TestCaseLibrary(props) {
    // Styling
    const useStyles = makeStyles({styling});
    const classes = useStyles();

    // Test case table columns
    const testCaseColumnsWithActions = testCaseColumns.concat([
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
        <CreateNewModalFlow type={flowType.TEST_CASE} modalOpen={createNewFlow} onClose={() => setCreateNewFlow(false)} />
        <PlainScreen>
            <CPButton 
              text="Create New Test Case"
              onClick={() => setCreateNewFlow(true)}
            />
            <PlainTable rows={props.testCasesData} columns={testCaseColumnsWithActions} className={classes.root}/>
        </PlainScreen>
      </>
    )
}

import {getLibraryTestCases} from "./api/getLibraryTestCases";
/**
 * 
 * @param {*} context 
 * @returns props that includes all library test cases
 */
export async function getServerSideProps(context) {
  try {
    const res = await getLibraryTestCases();
    const testCasesData = await res.map((testCase => {
        return {
            "_id": testCase._id,
            "name": (testCase.name != "")?testCase.name:"N/A",
            "description": (testCase.description != "")?testCase.description:"N/A",
            "percentPassed":"__%",
            "config": (testCase.config != "")?testCase.config:"N/A",
        }
    }));
    return {
      props: {testCasesData}, // will be passed to the page component as props
    }
  }
  catch(err) {
      throw err;
  }

} 

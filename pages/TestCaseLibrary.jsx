import React, { useState, useEffect } from 'react';
import PlainScreen from "../components/baseScreen/PlainScreen";
import { PlainTable } from "../components/tables/Table";
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import { testCaseColumns, testCaseRows } from '../util/tableColumns';
import CreateNewModalFlow from './createNewModalFlow';
import { flowType } from '../util/modalUtils';
import styling from '../styles/tableStyling';

export default function TestCaseLibrary(props) {

    const useStyles = makeStyles({styling});
    const classes = useStyles();

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

export async function getServerSideProps(context) {
  try {
    const res = await fetch(`${process.env.HOST}/api/getLibraryTestCases`);
    const testCasesData = await res.json().then((data) => data.map((testCase => {
        return {
            "_id": testCase._id,
            "name": (testCase.name != "")?testCase.name:"N/A",
            "description": (testCase.description != "")?testCase.description:"N/A",
            "percentPassed":"__%",
            "config": (testCase.config != "")?testCase.config:"N/A",
        }
    })));
    return {
      props: {testCasesData}, // will be passed to the page component as props
    }
  }
  catch(err) {
      throw err;
  }

} 

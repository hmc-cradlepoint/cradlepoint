import React, { useState, useEffect } from 'react';
import PlainScreen from "../components/baseScreen/PlainScreen";
import { PlainTable } from "../components/tables/Table";
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import { testColumns } from '../util/tableColumns';
import CreateNewModalFlow from './createNewModalFlow';
import { flowType } from '../util/modalUtils';
import styling from '../styles/tableStyling';

 {/* TODO: create new modal flow for libraries are not working yet. Add test to library api is not yet implemented */}
export default function TestLibrary(props) {
    // Styling
    const useStyles = makeStyles({styling});
    const classes = useStyles();

    // Test table columns
    const testColumnsWithActions = testColumns.concat([
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
        <CreateNewModalFlow type={flowType.TEST} modalOpen={createNewFlow} onClose={() => setCreateNewFlow(false)} />
        <PlainScreen>
            <CPButton 
              text="Create New Test"
              onClick={() => setCreateNewFlow(true)}
            />
            <PlainTable rows={props.testsData} columns={testColumnsWithActions} className={classes.root}/>
        </PlainScreen>
      </>
    )
}

import {getLibraryTests} from "./api/getLibraryTests";
/**
 * 
 * @param {*} context 
 * @returns props that includes all library tests
 */
export async function getServerSideProps(context) {
  try {
    const res = await getLibraryTests();
    const testsData = await res.map((test => {
        return {
            "_id": test._id,
            "name": (test.name != "")?test.name:"N/A",
            "description": (test.description != "")?test.description:"N/A",
        }
    }));
    return {
      props: {testsData}, // will be passed to the page component as props
    }
  }
  catch(err) {
      throw err;
  }

} 

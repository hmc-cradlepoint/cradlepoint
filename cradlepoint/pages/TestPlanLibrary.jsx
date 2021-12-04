import React, { useState, useEffect } from 'react';
import PlainScreen from "../components/baseScreen/PlainScreen";
import { PlainTable } from "../components/tables/Table";
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import { testPlanColumns, testPlanRows } from '../util/tableColumns';
import CreateNewModalFlow from './createNewModalFlow/createNewModalFlow';
import { flowType } from './createNewModalFlow/utils';

// TODO: adjust scaling and font of the page
export default function TestPlanLibrary(props) {
    // TODO: have a consistent style for all the pages (delete later)
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

    const testPlanColumnsWithActions = testPlanColumns.concat([
        { 
          field: 'button', 
          flex: 1,
          minWidth: 100,
          headerName: 'Actions',
          headerClassName: 'header',
          align: 'center',
          renderCell: () => (
            <CPButton text="DETAILS"/>
          )
        }
      ]);

    const [createNewFlow, setCreateNewFlow] = useState(false);

    return(
      <>
        <CreateNewModalFlow type={flowType.TEST_PLAN} modalOpen={createNewFlow} onClose={() => setCreateNewFlow(false)} />
        <PlainScreen>
            <CPButton 
              text="Create New Test Plan"
              onClick={() => setCreateNewFlow(true)}
            />
            {/* TODO: get rows from database */}
            <PlainTable rows={testPlanRows} columns={testPlanColumnsWithActions} className={classes.root}/>

      </PlainScreen>
      </>
    )
}
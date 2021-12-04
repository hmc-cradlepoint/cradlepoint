import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import PlainScreen from "../components/baseScreen/PlainScreen";
import { useRouter } from 'next/router'
import { PlainTable } from "../components/tables/Table";
import CPButton from '../components/button/CPButton';
import CreateNewModalFlow from './createNewModalFlow/createNewModalFlow';
import { flowType } from './createNewModalFlow/utils';
import { engagementColumns, engagementRows } from '../util/tableColumns';
import styling from '../styles/tableStyling';

export default function HomeScreen(props) {
    const router = useRouter();
    const useStyles = makeStyles(styling);
    const classes = useStyles();

    function handleNavigation(id) {
      router.push("/3EngagementDetails");
      console.log("/3EngagementDetails/" + id);
    }

    const engagementColumnsWithActions = engagementColumns.concat([
        { 
          field: 'button', 
          flex: 1,
          minWidth: 100,
          headerName: 'Actions',
          headerClassName: 'header',
          align: 'center',
          renderCell: (params) => (
            <CPButton text="DETAILS" onClick={() => handleNavigation(params.id)}/>
          )
        }
      ]);

    const [createNewFlow, setCreateNewFlow] = useState(false);
  
    return(
      <div >
        <CreateNewModalFlow type={flowType.ENGAGEMENT} modalOpen={createNewFlow} onClose={() => setCreateNewFlow(false)} />
        <PlainScreen>
        <h1>Home</h1>
          <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
              <h2>Engagements</h2>
              <CPButton 
              text="Create New Engagement"
              onClick={() => setCreateNewFlow(true)}
            />
          </div>
          <PlainTable rows={engagementRows} columns={engagementColumnsWithActions} className={classes.root}/>
      </PlainScreen>
      </div>
    )
}

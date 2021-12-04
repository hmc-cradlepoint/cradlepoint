import React, {useState} from 'react';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable } from '../components/tables/Table';
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import { testPlanColumns, BOMColumns, testPlanRows, BOMRows } from '../util/tableColumns';
import styles from '../styles/EngagementDetails.module.css';
import EditEDDescription from './engagementDetailsModals/editEDDescriptions';
import CreateNewModalFlow from './createNewModalFlow/createNewModalFlow';
import { flowType } from './createNewModalFlow/utils';

export default function EngagementDetails() {

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

    const [editDescriptionModal, setEditDescriptionModal] = useState(false);
    const [createNewFlow, setCreateNewFlow] = useState(false);

    //   TODO: style the active test plan
    const testPlanColWithButton = testPlanColumns.concat([
    { 
        field: 'button', 
        headerName: 'Actions',
        headerClassName: 'header',
        align: 'center',
        renderCell: () => (
        <>
            <CPButton text="EDIT"/>
            <CPButton text="SET ACTIVE"/>
        </>
        ),
        flex: 1.5
    }
    ]);

    const activeTestPlan = [
        {id: "1", subject: "subject", topology: "topology", description: "lorem ipsum dolores et", coverage: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
    ]

    const activeTestPlanCol = testPlanColumns.concat([
    { 
        field: 'button', 
        headerName: 'Actions',
        headerClassName: 'header',
        align: 'center',
        renderCell: () => (
        <>
            <CPButton text="EDIT"/>
        </>
        ),
        flex: 1
    }
    ]);

    const BOMColumnsWithButton = BOMColumns.concat([
        { 
            field: 'button', 
            headerName: 'Actions',
            headerClassName: 'header',
            align: 'center',
            renderCell: () => (
            <span>
                <CPButton text="EDIT"/>
            </span>
            ),
            flex: 1
        }
    ]);

    function testPlans() {
        // Test plans table component
        return (
            <div className={styles.tableContainer} style={{paddingTop: 50}}>
                <div className={styles.tableButtonRow}>
                    <h2>Test Plans</h2>
                    <CPButton text="Add New" onClick={() => setCreateNewFlow(true)}/>
                </div>
                <h3>Active test plan: </h3>
                <PlainTable rows={activeTestPlan} columns={activeTestPlanCol} className={classes.root} height={175}/>
                <br />
                <h3>Archived test plans: </h3>
                <PlainTable rows={testPlanRows} columns={testPlanColWithButton} className={classes.root}/>
            </div>
        )
    }

    function BOMSummary() {
        // Summary of BOM Elements component
        return (
            <div className={styles.tableContainer} style={{paddingTop: 50}}>
                <h2>Summary of Bill of Materials Elements (of active test plan)</h2>
                <PlainTable rows={BOMRows} columns={BOMColumnsWithButton} className={classes.root}/>
            </div>
        )
    }

    function description() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Detailed Description</h2>
                <p>A description in detail</p>
                {/* <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p> */}
            </div>
        )
    }

    function details() {
        return(
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Details</h2>
                {/* TODO: populate this data with actual data */}
                <p><b>ID:</b> 1923718<br/><b>Client:</b> Harvey Mudd<br/> <b>SFDC:</b> https://www.salesforce.com<br/><b>Status:</b> In Progress<br/><b>System Engineer:</b> Matt Tran<br/><b>POC Engineer:</b> Jessica Kwok</p>
            </div>
        )
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
        <CreateNewModalFlow type={flowType.TEST_PLAN} modalOpen={createNewFlow} onClose={() => setCreateNewFlow(false)} />
        <EditEDDescription modalOpen={editDescriptionModal} onBack={() => setEditDescriptionModal(false)} />
        <SplitScreen
            topChildren={
            <div>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <h1>Engagement Details</h1>
                    <CPButton text="Edit Descriptions" onClick={() => setEditDescriptionModal(true)}/>
                </div>
            </div>
            }
            leftSection={details()}
            rightSection={description()}
            bottomChildren={
                <div>
                {testPlans()}
                {BOMSummary()}
                </div>
            }
        />
        </div>
    )
}

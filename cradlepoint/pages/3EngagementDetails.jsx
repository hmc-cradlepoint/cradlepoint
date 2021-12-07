import React, {useState} from 'react';
import { useRouter } from 'next/router';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable } from '../components/tables/Table';
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import { testPlanColumns, BOMColumns, testPlanRows, BOMRows } from '../util/tableColumns';
import styles from '../styles/EngagementDetails.module.css';
import EditEDDescription from './engagementDetailsModals/editEDDescriptions';
import CreateNewModalFlow from './createNewModalFlow/createNewModalFlow';
import { flowType } from './createNewModalFlow/utils';
import styling from '../styles/tableStyling';

export default function EngagementDetails(props) {
    const router = useRouter();

    const useStyles = makeStyles(styling);
    const classes = useStyles();

    const [editDescriptionModal, setEditDescriptionModal] = useState(false);
    const [createNewFlow, setCreateNewFlow] = useState(false);

    function handleEditNavigation(id) {
        router.push("/4TestPlanDetails?_id=" + id);
    }

    //   TODO: style the active test plan
    const testPlanColWithButton = testPlanColumns.concat([
    { 
        field: 'button', 
        headerName: 'Actions',
        headerClassName: 'header',
        align: 'center',
        renderCell: (params) => (
        <>
            <CPButton text="EDIT" onClick={() => handleEditNavigation(params.id)}/>
            <CPButton text="SET ACTIVE"/>
        </>
        ),
        flex: 1.5
    }
    ]);
    
    const activeTestPlanCol = testPlanColumns.concat([
    { 
        field: 'button', 
        headerName: 'Actions',
        headerClassName: 'header',
        align: 'center',
        renderCell: (params) => (
        <>
            <CPButton text="EDIT" onClick={() => handleEditNavigation(params.id)}/>
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
                <PlainTable rows={props.activeTestPlan} columns={activeTestPlanCol} className={classes.root} height={175}/>
                <br />
                <h3>Archived test plans: </h3>
                <PlainTable rows={props.archivedTestPlans} columns={testPlanColWithButton} className={classes.root}/>
            </div>
        )
    }

    function BOMSummary() {
        // Summary of BOM Elements component
        return (
            <div className={styles.tableContainer} style={{paddingTop: 50}}>
                <h2>Summary of Bill of Materials Elements (of active test plan)</h2>
                <PlainTable rows={props.activeTestPlan[0].summaryBOM} columns={BOMColumnsWithButton} className={classes.root} getRowId={(row) => row.deviceId}/>
            </div>
        )
    }

    function description() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Detailed Description</h2>
                <p>{props.engagement.engagementDetails}</p>
            </div>
        )
    }

    function details() {
        return(
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Details</h2>
                <p><b>ID:</b> {props.engagement._id}<br/>
                <b>Client:</b> {props.engagement.customer}<br/> 
                <b>SFDC:</b> {props.engagement.SFDC}<br/>
                <b>Status:</b> {props.engagement.statusCode}<br/>
                <b>System Engineer:</b> {props.engagement.SEDetails[0].firstName} {props.engagement.SEDetails[0].lastName}<br/>
                <b>POC Engineer:</b> {props.engagement.POC_Eningeer_details[0].firstName} {props.engagement.POC_Eningeer_details[0].lastName}</p>
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

export async function getServerSideProps(context) {
    try {
        const engagement = await (await fetch(`${process.env.HOST}/api/getEngagement?_id=${context.query._id}`)).json()
        if (engagement.len == 0) {
            return {
              notFound: true,
            }
          }
          const archivedTestPlans = await (await fetch(`${process.env.HOST}/api/getTestPlansByEngagementId?engagementId=${context.query._id}`)).json();
          const activeTestPlan = await (await fetch(`${process.env.HOST}/api/getTestPlan?_id=${engagement[0].testPlanId}`)).json();
          return {
            props: {engagement: engagement[0],
                    activeTestPlan: activeTestPlan,
                    archivedTestPlans: archivedTestPlans }, // will be passed to the page component as props
          }
    }
    catch(err) {
        throw err;
    }

  } 

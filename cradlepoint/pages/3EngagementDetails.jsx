import React, { useState } from 'react';
import { useRouter } from 'next/router';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable } from '../components/tables/Table';
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import { testPlanColumns, BOMColumns, testPlanRows, BOMRows } from '../util/tableColumns';
import styles from '../styles/EngagementDetails.module.css';
import EditModalFlow from './editModalFlow';
import CreateNewModalFlow from './createNewModalFlow';
import { flowType } from '../util/modalUtils';
import styling from '../styles/tableStyling';
import { useNavContext } from '../context/AppWrapper';
import NavDir from '../components/navDir';

export default function EngagementDetails(props) {
    const router = useRouter();
    const refreshData = ( () => {
        router.replace(router.asPath);
    })

    const { directory, dispatch } = useNavContext();

    const useStyles = makeStyles(styling);
    const classes = useStyles();

    const [editModalFlow, setEditModalFlow] = useState(false);
    const [createNewFlow, setCreateNewFlow] = useState(false);

    function handleEditNavigation(id) {
        const nextPage = "/4TestPlanDetails?_id=" + id;
        const payload = {title: "Test Plan Details", url: nextPage};
        router.push(nextPage);
        dispatch({type: "ADD_PAGE", payload: payload});
    }

    async function setTestPlanActive(selectedTestPlanId){
        let data ={
            "engagementId": props.engagement._id,
            "testPlanId": selectedTestPlanId
        }
        try{
        const d = JSON.stringify(data);
        const res = await fetch('/api/setTestPlanActive', {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(d)
            },
            body: d
        })
        console.log("RES:", res)
        } catch (err){
        console.log("Error:",err)
        }

        refreshData();
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
            <CPButton text="View" onClick={() => handleEditNavigation(params.id)}/>
            <CPButton text="Set Active" onClick={() => {setTestPlanActive(params.id) }}/>
            <CPButton text="Delete"/>
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
            <CPButton text="View" onClick={() => handleEditNavigation(params.id)}/>
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
            <div style={{display: "flex", flexDirection: "row"}}>
                <CPButton text="View"/>
                <CPButton text="Delete"/>
            </div>
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
                <PlainTable rows={props.activeTestPlan ?? []} columns={activeTestPlanCol} className={classes.root} height={175}/>
                <br />
                <h3>Archived test plans: </h3>
                <PlainTable rows={props.archivedTestPlans ?? []} columns={testPlanColWithButton} className={classes.root}/>
            </div>
        )
    }

    function BOMSummary() {
        // Summary of BOM Elements component
        return (
            <div className={styles.tableContainer} style={{paddingTop: 50}}>
                <h2>Summary of Bill of Materials Elements (of active test plan)</h2>
                <PlainTable rows={props.activeTestPlan?.summaryBOM ??[]} columns={BOMColumnsWithButton} className={classes.root} getRowId={(row) => row.deviceId}/>
            </div>
        )
    }

    function description() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Detailed Description</h2>
                <p>{props.engagement.description}</p>
            </div>
        )
    }

    function details() {
        return(
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Details</h2>
                <p><b>ID:</b> {props.engagement._id}<br/>
                <b>Client:</b> {props.engagement.customer}<br/> 
                <b>SFDC:</b> <a href={props.engagement.SFDC}><u style={{color: "darkblue"}}>SFDC link</u></a> <br/>
                <b>Status:</b> {props.engagement.statusCode}<br/>
                <b>System Engineer:</b> {props.engagement.SEDetails[0].firstName} {props.engagement.SEDetails[0].lastName}<br/>
                <b>POC Engineer:</b> {props.engagement.POC_Eningeer_details[0].firstName} {props.engagement.POC_Eningeer_details[0].lastName}</p>
            </div>
        )
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
        <CreateNewModalFlow modalData={props} type={flowType.TEST_PLAN} modalOpen={createNewFlow} onClose={() => {setCreateNewFlow(false); refreshData();}} />
        <EditModalFlow data={props.engagement} type={flowType.ENGAGEMENT} modalOpen={editModalFlow} onClose={() => {setEditModalFlow(false); refreshData();}} />
        <SplitScreen
            topChildren={
            <div>
                <NavDir pages={directory} />
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <h1>Engagement Details</h1>
                    <CPButton text="Edit" onClick={() => setEditModalFlow(true)}/>
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
            return { notFound: true }
        }
        const archivedTestPlans = await (await fetch(`${process.env.HOST}/api/getTestPlansByEngagementId?engagementId=${context.query._id}`)).json();
        const activeTestPlan = (engagement[0] && engagement[0].testPlanId)? await (await fetch(`${process.env.HOST}/api/getTestPlan?_id=${engagement[0].testPlanId}`)).json(): null
        const allTestPlans = await (await fetch(`${process.env.HOST}/api/getLibraryTestPlans`)).json();
    
        return {
            props: {
                engagement: engagement[0],
                activeTestPlan,
                archivedTestPlans,
                allTestPlans,
            },
        }
    }
    catch(err) {
        throw err;
    }

  } 

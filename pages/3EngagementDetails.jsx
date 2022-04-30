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
import DeleteModalForm from './ModalForms/DeleteModalForm';
import { flowType } from '../util/modalUtils';
import styling from '../styles/tableStyling';
import { useNavContext } from '../context/AppWrapper';
import NavDir from '../components/navDir';

/**
 * 
 * @param {*} props passed in from getServerSideProps() function on the bottom of this document, see this function for details
 * @returns Engagement Details Page as a div, along with modals that are default to invisible
 */
export default function EngagementDetails(props) {
    const router = useRouter();
    const refreshData = (() => {
        router.replace(router.asPath);
    })

    // navigation
    const { directory, dispatch } = useNavContext();
    function handleEditNavigation(id) {
        const nextPage = "/4TestPlanDetails?_id=" + id;
        const payload = { title: "Test Plan Details", url: nextPage };
        router.push(nextPage);
        dispatch({ type: "ADD_PAGE", payload: payload });
    }

    // styling
    const useStyles = makeStyles({ styling });
    const classes = useStyles();

    // Delete: variables and functions used
    let paramId; // stores id of test plan that needs to be deleted
    let engagementId; // stores id of parent engagement
    const getParams = (id, engagementId) => {
        paramId = id;
        engagementId = engagementId;
    }

    const [deleteModal, setDeleteModal] = useState(false);
    
    // helper passed into the deleteModal
    const handleDelete = () => {
        deleteData("/api/deleteTestPlan", paramId, engagementId);
        setDeleteModal(false);
    }    

    /**
     * 
     * @param {*} route the api route to delete a test plan
     * @param {*} resId the id of the test plan to be deleted
     * @param {*} parentEngagementId the id of the parent engagement
     * 
     * calls deleteTestPlan api
     */
    async function deleteData(route, resId, parentEngagementId) {
        let data = {
            "_id": resId,
            "parentEngagementId": parentEngagementId,
        }
        try {
            const res = await fetch(route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            console.log("RES:", res)
        } catch (err) {
            console.log("Error:", err)
            throw err
        }
        refreshData();
    }
 

    // controls edit engagement modal flow
    const [editModalFlow, setEditModalFlow] = useState(false);
    // controls create new test plan modal flows
    const [createNewFlow, setCreateNewFlow] = useState(false);

    /**
     * sets an archived test plan to active
     * @param {*} newActiveTestPlanId id of test plan that needs to be set active
     * calls ActivateTestPlan api
     */
    async function setActiveTestPlan(newActiveTestPlanId) {
        let data = {
            "engagementId": props.engagement._id,
            "testPlanId": newActiveTestPlanId
        }
      
        try {
            const d = JSON.stringify(data);
            const res = await fetch('/api/edit/ActivateTestPlan', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(d)
                },
                body: d
            })
            console.log("RES:", res)
        } catch (err) {
            console.log("Error:", err)
            throw err
        }

        refreshData();
    }

    //  Test Plan table columns
    const testPlanColWithButton = testPlanColumns.concat([
    { 
        field: 'button', 
        headerName: 'Actions',
        headerClassName: 'header',
        align: 'center',
        renderCell: (params) => (
        <>
            <CPButton text="View" onClick={() => handleEditNavigation(params.id)}/>
            <CPButton text="Set Active" onClick={() => {setActiveTestPlan(params.id) }}/>
            <CPButton text="Delete" onClick={() => {setDeleteModal(true)}}/>
            {getParams(params.id, params.engagementId)}
        </>
        ),
        flex: 1.5
    }
    ]);

    // Active Test Plan table columns
    const activeTestPlanCol = testPlanColumns.concat([
        {
            field: 'button',
            headerName: 'Actions',
            headerClassName: 'header',
            align: 'center',
            renderCell: (params) => (
                <>
                    <CPButton text="View" onClick={() => handleEditNavigation(params.id)} />
                </>
            ),
            flex: 1
        }
    ]);
   
    // Child components for the page
    /**
     * @returns a div containing the test plan tables and add new button
     */
    function testPlans() {
        return (
            <div className={styles.tableContainer} style={{ paddingTop: 50 }}>
                <div className={styles.tableButtonRow}>
                    <h2>Test Plans</h2>
                    <CPButton text="Add New" onClick={() => setCreateNewFlow(true)} />
                </div>
                <h3>Active test plan: </h3>
                <PlainTable rows={props.activeTestPlan ?? []} columns={activeTestPlanCol} className={classes.root} height={175} />
                <br />
                <h3>Archived test plans: </h3>
                <PlainTable rows={props.archivedTestPlans ?? []} columns={testPlanColWithButton} className={classes.root} />
            </div>
        )
    }

    /**
     * 
     * @returns a div containing the summary BOM table of the active test plan
     */
    function BOMSummary() {
        return (
            <div className={styles.tableContainer} style={{ paddingTop: 50 }}>
                <h2>Summary of Bill of Materials Elements (of active test plan)</h2>
                <PlainTable rows={props.summaryBOM} columns={BOMColumns} className={classes.root} getRowId={(row) => row.deviceId} />
            </div>
        )
    }

    /**
     * 
     * @returns a div dispalying a description of the engagement
     */
    function description() {
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <h2>Detailed Description</h2>
                <p>{props.engagement.description}</p>
            </div>
        )
    }

    /**
     * 
     * @returns a div displaying all the fields of an Engagement
     */
    function details() {
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <h2>Details</h2>
                <p><b>Name:</b> {props.engagement.name}<br />
                    <b>Client:</b> {props.engagement.customer}<br />
                    <b>SFDC:</b> <a href={props.engagement.SFDC}><u style={{ color: "darkblue" }}>SFDC link</u></a> <br />
                    <b>Status:</b> {props.engagement.statusCode}<br />
                    <b>System Engineer:</b> {props.engagement.SE} <br />
                    <b>POC Engineer:</b> {props.engagement.POC_Engineer}</p>
            </div>
        )
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
        {/* Pop-up modals that are controlled by state variables */}
        <CreateNewModalFlow modalData={props} type={flowType.TEST_PLAN} modalOpen={createNewFlow} onClose={() => {setCreateNewFlow(false); refreshData();}} />
        <EditModalFlow data={props.engagement} type={flowType.ENGAGEMENT} modalOpen={editModalFlow} onClose={() => {setEditModalFlow(false); refreshData();}} />
        <DeleteModalForm isOpen={deleteModal} onBack={() => setDeleteModal(false)} handleDelete={() => handleDelete()}/>
        
        {/* The actual screen */}
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

import { getTestPlansByEngagementId } from "./api/getTestPlansByEngagementId";
import { getTestPlan } from "./api/getTestPlan";
import { getEngagement } from "./api/getEngagement";
import { getLibraryTestPlans } from "./api/getLibraryTestPlans";
/**
 * 
 * @param {*} context 
 * @returns retrives all the necessary props to load the page
 */
export async function getServerSideProps(context) {
    // get details of a specific engagment
    try {
        let engagement = await getEngagement(context.query._id);
        if (engagement.len == 0) {
            // TODO: Display custom page for case where engagement not found
            return { notFound: true }
        }
        engagement = engagement[0];

        // get all the test plans and summaryBOM of that engagement
        const archivedTestPlans = await getTestPlansByEngagementId(context.query._id);
        const allTestPlans = await getLibraryTestPlans();
        const activeTestPlan = (engagement.testPlanId) ? await getTestPlan(engagement.testPlanId) : [];
        let summaryBOM = (activeTestPlan[0]) ? activeTestPlan[0].summaryBOM : [];

        // if engagement contains a test plan with an empty summary BOM, set summaryBOM to an empty list
        if (engagement.testPlanId){
            // Fix issue where an empty summaryBOM is [{}] instead of []
            if (JSON.stringify(summaryBOM) === '[{}]') {
                summaryBOM = [];
            };
        };

        return {
            props: {
                engagement, // the specific engagement and all its fields
                activeTestPlan, // the active test plan
                archivedTestPlans, // the archived test plans
                summaryBOM, // the summaryBOM of the active test plan
                allTestPlans, // library test plans, needed for modal to add new test plan 
            },
        }
    }
    catch (err) {
        throw err;
    }

} 

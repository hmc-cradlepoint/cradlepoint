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
    const refreshData = (() => {
        router.replace(router.asPath);
    })

    const { directory, dispatch } = useNavContext();

    const deleteAPIRoute = {
        BOM: "/api/deleteTestCaseBOM",
        TEST_CASE: "/api/deleteTestPlan",
    }

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


    const useStyles = makeStyles({ styling });
    const classes = useStyles();

    const [editModalFlow, setEditModalFlow] = useState(false);
    const [createNewFlow, setCreateNewFlow] = useState(false);

    function handleEditNavigation(id) {
        const nextPage = "/4TestPlanDetails?_id=" + id;
        const payload = { title: "Test Plan Details", url: nextPage };
        router.push(nextPage);
        dispatch({ type: "ADD_PAGE", payload: payload });
    }

    async function setActiveTestPlan(newActiveTestPlanId) {
        let data = {
            "engagementId": props.engagement._id,
            "testPlanId": newActiveTestPlanId
        }
        console.log("data:", data);
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

    //   TODO: style the active test plan
    const testPlanColWithButton = testPlanColumns.concat([
        {
            field: 'button',
            headerName: 'Actions',
            headerClassName: 'header',
            align: 'center',
            renderCell: (params) => (
                <>
                    <CPButton text="View" onClick={() => handleEditNavigation(params.id)} />
                    <CPButton text="Set Active" onClick={() => { setActiveTestPlan(params.id) }} />
                    <CPButton text="Delete" onClick={() => { deleteData(deleteAPIRoute.TEST_PLAN, params.id, props.engagement._id) }} />
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
                    <CPButton text="View" onClick={() => handleEditNavigation(params.id)} />
                </>
            ),
            flex: 1
        }
    ]);

    // TODO: Potential rework to include TestCaseName
    // const SummaryBOMColumns = BOMColumns.concat([
    //     { 
    //         field: 'button', 
    //         headerName: 'Actions',
    //         headerClassName: 'header',
    //         align: 'center',
    //         renderCell: () => (
    //         <div style={{display: "flex", flexDirection: "row"}}>
    //             <CPButton text="View"/>
    //         </div>
    //         ),
    //         flex: 1
    //     }
    // ]);

    function testPlans() {
        // Test plans table component
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


    function BOMSummary() {
        // Summary of BOM component
        return (
            <div className={styles.tableContainer} style={{ paddingTop: 50 }}>
                <h2>Summary of Bill of Materials Elements (of active test plan)</h2>
                <PlainTable rows={props.summaryBOM} columns={BOMColumns} className={classes.root} getRowId={(row) => row.deviceId} />
            </div>
        )
    }

    function description() {
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <h2>Detailed Description</h2>
                <p>{props.engagement.description}</p>
            </div>
        )
    }

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
        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
            <CreateNewModalFlow modalData={props} type={flowType.TEST_PLAN} modalOpen={createNewFlow} onClose={() => { setCreateNewFlow(false); refreshData(); }} />
            <EditModalFlow data={props.engagement} type={flowType.ENGAGEMENT} modalOpen={editModalFlow} onClose={() => { setEditModalFlow(false); refreshData(); }} />
            <SplitScreen
                topChildren={
                    <div>
                        <NavDir pages={directory} />
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <h1>Engagement Details</h1>
                            <CPButton text="Edit" onClick={() => setEditModalFlow(true)} />
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

export async function getServerSideProps(context) {
    try {
        let engagement = await getEngagement(context.query._id);
        if (engagement.len == 0) {
            // TODO: Display custom page for case where engagement not found
            return { notFound: true }
        }
        engagement = engagement[0];
        const archivedTestPlans = await getTestPlansByEngagementId(context.query._id);
        const allTestPlans = await getLibraryTestPlans();
        const activeTestPlan = (engagement.testPlanId) ? await getTestPlan(engagement.testPlanId) : [];
        let summaryBOM = (activeTestPlan[0]) ? activeTestPlan[0].summaryBOM : [];
        if (engagement.testPlanId){
            // Fix issue where an empty summaryBOM is [{}] instead of []
            if (JSON.stringify(summaryBOM) === '[{}]') {
                summaryBOM = [];
            };
        };
        return {
            props: {
                engagement,
                activeTestPlan,
                archivedTestPlans,
                summaryBOM,
                allTestPlans,
            },
        }
    }
    catch (err) {
        throw err;
    }

} 

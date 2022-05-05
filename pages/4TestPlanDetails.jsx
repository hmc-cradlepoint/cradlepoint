import React, {useState} from 'react';
import { useRouter } from 'next/router';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable } from '../components/tables/Table';
import CPButton from '../components/button/CPButton';
import EditModalFlow from './editModalFlow';
import CreateNewModalFlow from './createNewModalFlow';
import { makeStyles } from '@mui/styles';
import styles from '../styles/EngagementDetails.module.css';
import styling from '../styles/tableStyling';
import DeleteModalForm from './ModalForms/DeleteModalForm';

import { BOMColumns, testCaseColumns} from '../util/tableColumns';
import { flowType } from '../util/modalUtils';
import NavDir from '../components/navDir';
import { useNavContext } from '../context/AppWrapper';

/**
 * 
 * @param {*} props passed in from getServerSideProps() function on the bottom of this document, see this function for details
 * @returns Test Plan Details Page as a div, along with modals that are default to invisible
 */
export default function TestPlanDetails(props) {
    const router = useRouter();
    const refreshData = ( () => {
        router.replace(router.asPath);
    })

    // Navigation
    const { directory, dispatch } = useNavContext();
    function handleNavigation(id) {
        const nextPage = "/5TestCaseDetails?_id=" + id;
        const payload = {title: "Test Case Details", url: nextPage};
        router.push(nextPage);
        dispatch({type: "ADD_PAGE", payload: payload});
    }

    // Styling
    const useStyles = makeStyles({styling});
    const classes = useStyles();

    
    // Delete: variables and functions used
    // ----------------------------------------------
    let paramId;
    const getParams = (id) => {
        paramId = id;
    }

    const [deleteModal, setDeleteModal] = useState(false);
    const handleDelete = () => {
        deleteData("/api/deleteTestCase", paramId);
        setDeleteModal(false);
    }

    /**
     * 
     * @param {*} route the api route to delete a test case
     * @param {*} resId the id of the test case to be deleted
     * calls deleteTestCase api
     */
    async function deleteData(route, resId) {
        let data = {
            "_id": resId,
            "parentTestPlanId": props.testPlanData._id,
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
            console.log("Error:",err)
        }
        refreshData();
    }
    // ----------------------------------------------

    // controls edit test plan modal flows
    const [editModalFlow, setEditModalFlow] = useState(false);
    // controls create new test case modal flows
    const [createNewFlow, setCreateNewFlow] = useState(false);
  
    // Test case table columns
    const testCaseColumnsWithActions = testCaseColumns.concat([
    { 
        field: 'button', 
        headerName: 'Actions',
        headerClassName: 'header',
        align: 'center',
        renderCell: (params) => (
        <div style={{display: "flex", flexDirection: "row"}}>
            <CPButton text="View" onClick={() => handleNavigation(params.id)}/>
            <CPButton text="Delete" onClick={() => {setDeleteModal(true)}}/>
            {getParams(params.id)}
        </div>
        ),
        flex: 2
    }
    ]);

    // Child components for the page
    // ----------------------------------------------
    /**
     * @returns a div containing the test case tables and add new button
     */
    function testCases() {
        return (
            <div className={styles.tableContainer} style={{paddingTop: 50}}>
                <div className={styles.tableButtonRow}>
                    <h2>Test Cases of Current Plan</h2>
                    <CPButton text="Add New" onClick={() => setCreateNewFlow(true)}/>
                </div>
                <PlainTable rows={props.testCasesData} columns={testCaseColumnsWithActions} className={classes.root}/>
            </div>
        )
    }

     /**
     * 
     * @returns a div containing the summary BOM table of the current test plan
     */
    function BOMSummary() {
        return (
            <div className={styles.tableContainer} style={{paddingTop: 50}}>
                <div className={styles.tableButtonRow}>
                    <h2>Summary of Bill of Materials</h2>
                </div>
                <PlainTable rows={props.testPlanData.summaryBOM} columns={BOMColumns} className={classes.root} 
                getRowId={(row) => row._id}/>
            </div>
        )
    }

     /**
     * 
     * @returns a div dispalying a description of the engagement
     */
      function description() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Detailed Description</h2>
                <p>{props.testPlanData.description}</p>
            </div>
        )
    }

    /**
     * 
     * @returns a div displaying all the fields of a test plan
     */
    function details() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Details</h2>
                <p>Name: {props.testPlanData.name}</p>
                <p>Active: {(props.testPlanData.isActive).toString()}</p>
                <p>Device Config: {props.testPlanData.deviceConfig}</p>
                <p>Coverage:</p>
                <p>Version: {props.testPlanData.version}</p>
                <p>Date Created: {props.testPlanData.createdOn}</p>
                <p>Authors: {props.testPlanData.authors}</p>
                <p>Customer feedback: {props.testPlanData.customerFeedback}</p>
            </div>
        )
    }
    // ----------------------------------------------
   
    return (
        <>
        {/* Pop-up Modals */}
        <CreateNewModalFlow modalData={props} type={flowType.TEST_CASE} modalOpen={createNewFlow} onClose={() => {setCreateNewFlow(false); refreshData();}} />
        <EditModalFlow data={props.testPlanData} type={flowType.TEST_PLAN} modalOpen={editModalFlow} onClose={() => {setEditModalFlow(false); refreshData();}} />
        <DeleteModalForm isOpen={deleteModal} onBack={() => setDeleteModal(false)} handleDelete={() => handleDelete()}/>
        {/* The actual page */}
        <SplitScreen
            topChildren={
                <>
                    <NavDir pages={directory} />
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <h1>Test Plan Details</h1>
                        <CPButton text="Edit"
                        onClick={()=> setEditModalFlow(true) }/>
                    </div>
                </>
                }
            leftSection={details()}
            rightSection={description()}
            bottomChildren={
                <div>
                {testCases()}
                {BOMSummary()}
                </div>
            }
        />
        </>
    )
}

import {getTestPlan} from "./api/getTestPlan";
import {getTestCasesByTestPlan} from "./api/getTestCasesByTestPlan";
import {getLibraryTestCases} from "./api/getLibraryTestCases";


export async function getServerSideProps(context) {
    /* 
       Gets Data for Test Plan Details
       TODO: Error Check await call
       TODO: Refactor out fetch call
    */
    const res = await getTestPlan(context.query._id);
    const testPlanData = res.length == 1 ? res[0]:[];
     // TODO: this is a "sketchy" quickfix to situation where testPlan summary BOM has no device
    // the getTestPlan query will return BOM as BOM: [{}]
    // this line replaces it to BOM: []
    if (!('deviceId' in testPlanData.summaryBOM[0])){
        testPlanData.summaryBOM = [];
    }
    /* 
       Gets Data for Test Cases Table
       TODO: Error Check await call
       TODO: Refactor out fetch call
    */
    const res2 = await getTestCasesByTestPlan(context.query._id);
    const testCasesData = await res2.map((testCase => {
        return {
            "_id": testCase._id,
            "name": (testCase.name != "")?testCase.name:"N/A",
            "description": (testCase.description != "")?testCase.description:"N/A",
            "config": (testCase.config != "")?testCase.config:"N/A",
            "topology": testCase.topology,
            // Other Fields not displayed:
            // "percentPassed":"__%",
            // "testPlanId"
            // "BOM"
        }
    }));

    const allTestCases = await getLibraryTestCases();
   
    return {
      props: {
          testPlanData, // the specific test plan and all its fields
          testCasesData, // the test cases that belong to the test plan
          allTestCases, // library test cases for the create new test case modal
        },
    }
  }

import React, {useState} from 'react';
import { useRouter } from 'next/router';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable } from '../components/tables/Table';
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import styles from '../styles/EngagementDetails.module.css';
import { resultColumns } from '../util/tableColumns';
import ResultModalForm from './ResultModalForm';
import styling from '../styles/tableStyling';
import EditModalFlow from './editModalFlow';
import {flowType, modalFormType} from '../util/modalUtils';
import NavDir from '../components/navDir';
import { useNavContext } from '../context/AppWrapper';
import DeleteModalForm from './ModalForms/DeleteModalForm';

/**
 * 
 * @param {*} props passed in from getServerSideProps() function on the bottom of this document, see this function for details
 * @returns Test Details Page as a div, along with modals that are default to invisible
 */
export default function TestDetails(props) {
    const router = useRouter();
    const refreshData = ( () => {
        router.replace(router.asPath);
    })

    // navigation
    const { directory, dispatch } = useNavContext();
    function handleNavigation(id) {
        const nextPage = "/7ResultDetails?_id="+id;
        const payload = {title: "Result Details", url: nextPage};
        router.push(nextPage);
        dispatch({type: "ADD_PAGE", payload: payload});
    }

    // styling
    const useStyles = makeStyles({styling});
    const classes = useStyles();



    // Delete: variables and functions used
    // ----------------------------------------------
    let resId; // stores id of result that needs to be deleted
    let parentTestId; // stores id of parent test
    
    // function called in result table
    const getParams = (id, testDataId) => {
        resId = id;
        parentTestId = testDataId;
    }

    // state variable to control delete modal visibility
    const [deleteModal, setDeleteModal] = useState(false);
    
    // helper passed into the deleteModal to call delete api
    const handleDelete = () => {
        deleteResult(resId, parentTestId);
        setDeleteModal(false);
        refreshData();
    }

    /**
     * 
     * @param {*} resId the id of the result to be deleted
     * @param {*} parentTestid the id of the parent test
     * 
     * calls deleteResult api
     */
    async function deleteResult(resId, parentTestId) {
        let data = {
            "_id": resId,
            "parentTestId": parentTestId,
        }
        try {
            const res = await fetch('/api/deleteResult', {
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
    }
    // ----------------------------------------------


    // controls edit test modal flow
    const [editModalFlow, setEditModalFlow] = useState(false);
    // controls create new result modal flows
    const [resultModalOpen, setResultModalOpen] = useState(false);
    

    // Result table columns
    const resultWithActions = resultColumns.concat([
    { 
        field: 'button', 
        headerName: 'Actions',
        headerClassName: 'header',
        align: 'center',
        renderCell: (params) => (
        <div style={{display: "flex", flexDirection: "row"}}>
            <CPButton text="View" onClick={() => handleNavigation(params.id)}/>
            <CPButton text="Delete" onClick={() => {setDeleteModal(true)}}/>
            {getParams(params.id, props.testData._id)}
        </div>
        ),
        flex: 2
    }
    ]);


    // Child components for the page
    // ----------------------------------------------
    /**
     * @returns a div containing the results tables and add new button
     */
    function results() {
        // Test table component
        return (
            <div className={styles.tableContainer} style={{paddingTop: 50}}>
                <div className={styles.tableButtonRow}>
                    <h2>Results</h2>
                    <CPButton text="Add New"
                            onClick={() => {setResultModalOpen(true)}}
                    />
                </div>
                <PlainTable rows={props.resultsData} columns={resultWithActions} className={classes.root}/>
            </div>
        )
    }

    /**
     * 
     * @returns a div dispalying a description of the test
     */
       function description() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Detailed Description</h2>
                <p>{props.testData.description}</p>
            </div>
        )
    }

    /**
     * 
     * @returns a div displaying all the text fields of a test
     */
    function details() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <p>Name: {props.testData.name}</p>
                <p>Most Recent Result Status: {props.testData.resultStatus?? "Unknown"}</p>
            </div>
        )
    }
    // ----------------------------------------------
  

    
    return (
        <div>
            {/* Pop-up modals that are controlled by state variables */}
            <EditModalFlow 
                data={props.testData} 
                type={flowType.TEST} 
                modalOpen={editModalFlow} 
                onClose={() => {setEditModalFlow(false); refreshData();}} 
            />
            <ResultModalForm
                data={{testId: props.testData._id}}
                isOpen={resultModalOpen} 
                modalFormType={modalFormType.NEW}
                onBack={() => {
                  setResultModalOpen(false); 
                  refreshData();}}
            />
            <DeleteModalForm 
                isOpen={deleteModal} 
                onBack={() => setDeleteModal(false)} 
                handleDelete={() => handleDelete()}
            />

        {/* The actual screen */}
        <SplitScreen
            topChildren={
                <>
                <NavDir pages={directory} />
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <h1>Test Details</h1>
                    <CPButton text="Edit"
                    onClick={()=>setEditModalFlow(true)}/>
                </div>
                </>
            }
            leftSection={details()}
            rightSection={description()}
            bottomChildren={
                <div>
                {results()}
                </div>
            }
        />
        </div> 
 
    )
}

import {getTest} from "./api/getTest";
import {getResults} from "./api/getResults";
/**
 * 
 * @param {*} context 
 * @returns retrives all the necessary props to load the page
 */
export async function getServerSideProps(context) {
    /* 
       Gets Data for Test Details
       TODO: Error Check await call
       TODO: Refactor out fetch call
    */
    const res = await getTest(context.query._id);
    const testData = res[0];

    /* 
       Gets Data for Test Results
       TODO: Error Check await call
       TODO: Refactor out fetch call
    */
    const res2 = await getResults(context.query._id);
 
    const resultsData = res2.map((result => {
        return {
            "_id": result._id,
            "evidence": result.evidence?result.evidence:"",
            "description": result.description?result.description:"",
            "resultStatus": result.resultStatus?result.resultStatus:"unknown",
            "createdOn": result.createdOn?result.createdOn:""
            // "POCApproval": (result.POCApproval != "")?result.POCApproval:"N/A",
            // "SEApproval": (result.SEApproval != "")?result.SEApproval:"N/A",
            // Other Fields not displayed:
            // "testId"
        }
    }));
    
    return {
      props: {testData, resultsData}, // will be passed to the page component as props
    }
  }
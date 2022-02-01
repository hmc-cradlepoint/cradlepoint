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


export default function TestDetails(props) {
    const router = useRouter();
    const refreshData = ( () => {
        router.replace(router.asPath);
    })

    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [editModalFlow, setEditModalFlow] = useState(false);
    
    const useStyles = makeStyles(styling);
    const classes = useStyles();

    function handleNavigation(id) {
        router.push("/7ResultDetails?_id="+id);
    }

    const resultWithActions = resultColumns.concat([
    { 
        field: 'button', 
        headerName: 'Actions',
        headerClassName: 'header',
        align: 'center',
        renderCell: (params) => (
        <div style={{display: "flex", flexDirection: "row"}}>
            <CPButton text="View" onClick={() => handleNavigation(params.id)}/>
            <CPButton text="Delete"/>
        </div>
        ),
        flex: 2
    }
    ]);


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


    
    function details() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <p>Name: {props.testData.name}</p>
                <p>Most Recent Result Status: {props.testData.resultStatus?? "unknown"}</p>
            </div>
        )
        // TODO: add result status in test schema so it can display the result status of the latest result
    }
    function description() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Detailed Description</h2>
                <p>{props.testData.details}</p>
            </div>
        )
    }

    return (
        <div>
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
            ></ResultModalForm>

        <SplitScreen
            topChildren={
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <h1>Test Details</h1>
                <CPButton text="Edit"
                onClick={()=>setEditModalFlow(true)}/>
                </div>}
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

export async function getServerSideProps(context) {
    /* 
       Gets Data for Test Details
       TODO: Error Check await call
       TODO: Refactor out fetch call
    */
    const res = await fetch(`${process.env.HOST}/api/getTest?_id=`+context.query._id);
    const testData = await res.json().then((data) => data[0]);

    /* 
       Gets Data for Test Results
       TODO: Error Check await call
       TODO: Refactor out fetch call
    */
    const res2 = await fetch(`${process.env.HOST}/api/getResults?testId=`+context.query._id);
 
    const resultsData = await res2.json().then((data) => data.map((result => {
        return {
            "_id": result._id,
            "evidence": result.evidence?result.evidence:"",
            "details": result.details?result.details:"",
            "resultStatus": result.resultStatus?result.resultStatus:"unknown",
            "createdOn": result.createdOn?result.createdOn:""
            // "POCApproval": (result.POCApproval != "")?result.POCApproval:"N/A",
            // "SEApproval": (result.SEApproval != "")?result.SEApproval:"N/A",
            // Other Fields not displayed:
            // "testId"
        }
    })));
    
    return {
      props: {testData, resultsData}, // will be passed to the page component as props
    }
  }
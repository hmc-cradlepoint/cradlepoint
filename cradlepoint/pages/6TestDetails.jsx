import React, {useState} from 'react';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable } from '../components/tables/Table';
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import styles from '../styles/EngagementDetails.module.css';
import { resultColumns } from '../util/tableColumns';
import ResultModalForm from './ResultModalForm';
import styling from '../styles/tableStyling';
import EditModalFlow from './editModalFlow';
import { flowType } from '../util/modalUtils';


export default function TestDetails(props) {
    const useStyles = makeStyles(styling);
    const classes = useStyles();

    const resultWithActions = resultColumns.concat([
    { 
        field: 'button', 
        headerName: 'Actions',
        headerClassName: 'header',
        align: 'center',
        renderCell: (params) => (
        <div style={{display: "flex", flexDirection: "row"}}>
            <CPButton text="Details"/>
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
                            onClick={() => {updateModal("result");}}
                    />
                </div>
                <PlainTable rows={props.resultsData} columns={resultWithActions} className={classes.root}/>
            </div>
        )
    }




    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [editModalFlow, setEditModalFlow] = useState(false);
    const emptyRow = {subject: '', description: ''};
    const [selectedRow, setSelectedRow] = useState(emptyRow); 

    function updateModal(modalType){
      switch(modalType){
        case "result":
            setResultModalOpen(true)
            break;
      }
    }

    
    function details() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <p>Name: {props.testData.name}</p>
            </div>
        )
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
            <EditModalFlow data={props.testData} type={flowType.TEST} modalOpen={editModalFlow} onClose={() => setEditModalFlow(false)} />
            
            <ResultModalForm
              isOpen={resultModalOpen} 
              onClickNext={updateModal}
              onBack={()=> setResultModalOpen(false)}
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
            "evidence": (result.evidence != "")?result.evidence:"N/A",
            "details": (result.details != "")?result.details:"N/A",
            "POCApproval": (result.POCApproval != "")?result.POCApproval:"N/A",
            "SEApproval": (result.SEApproval != "")?result.SEApproval:"N/A",
            // Other Fields not displayed:
            // "testId"
        }
    })));
    return {
      props: {testData, resultsData}, // will be passed to the page component as props
    }
  }
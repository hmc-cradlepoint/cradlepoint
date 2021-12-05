import React, {useState} from 'react';
import { useRouter } from 'next/router';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable, CheckBoxTable} from '../components/tables/Table';
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import SelectDeviceModal from './deviceModals/selectDevice';
import SelectQuantityModal from './deviceModals/selectQuantity';
import CreateNewModalFlow from './createNewModalFlow/createNewModalFlow';
import styles from '../styles/EngagementDetails.module.css';
import { BOMColumns, BOMRows, testCaseRows, testCaseColumns} from '../util/tableColumns';
import { flowType } from './createNewModalFlow/utils';

export default function TestPlanDetails(props) {
    const router = useRouter();
    const [createNewFlow, setCreateNewFlow] = useState(false);

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

    function handleNavigation(id) {
        router.push("/5TestCaseDetails");
        console.log("/5TestCaseDetails/" + id);
    }

    const testCaseColumnsWithActions = testCaseColumns.concat([
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


    const BOMColumnsWithAction = BOMColumns.concat([
        { 
            field: 'button', 
            headerName: 'Actions',
            headerClassName: 'header',
            align: 'center',
            renderCell: () => {
                return (
                    <div style={{display: "flex", flexDirection: "row"}}> 
                    <CPButton text="View"/>
                    <CPButton text="Delete"/>
                    </div>
                )
            },
            flex: 1
        }
    ]);


    function testCases() {
        // Test case table component
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

    function BOMSummary() {
        // Summary of BOM Elements component
        return (
            <div className={styles.tableContainer} style={{paddingTop: 50}}>
                <div className={styles.tableButtonRow}>
                    <h2>Summary of Bill of Materials</h2>
                    <CPButton text="Add New"
                        onClick={() => {updateModal("select_device")}}
                    />
                </div>
                <PlainTable rows={props.BOM_entries} columns={BOMColumnsWithAction} className={classes.root}/>
            </div>
        )
    }

    const [selectDeviceModalOpen, setSelectDeviceModalOpen] = useState(false);
    const [selectQuantityModalOpen, setSelectQuantityModalOpen] = useState(false);
    
    function updateModal(modalType) {
      switch(modalType){
        case "select_device":
            setSelectDeviceModalOpen(true)
            break;
        case "select_quantity":
            setSelectQuantityModalOpen(true)
            break;
      }
    }
    
    function details() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Details</h2>
                <p>Name: {props.name}</p>
                <p>Active: {(props.isActive).toString()}</p>
                <p>Device Config: {props.deviceConfig}</p>
                <p>Coverage:</p>
                <p>Version: {props.version}</p>
                <p>Date Created: {props.createdOn}</p>
                <p>Authors: {props.authors}</p>
                <p>Customer feedback: {props.customerFeedback}</p>
            </div>
        )
    }

    function description() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Detailed Description</h2>
                <p>{props.detailedDescription}</p>
            </div>
        )
    }

    return (
        <>
        <SelectDeviceModal
            modalOpen={selectDeviceModalOpen} 
            onClickNext={updateModal}
            onBack={()=> setSelectDeviceModalOpen(false)}
        />
        <SelectQuantityModal
            modalOpen={selectQuantityModalOpen} 
            onClickNext={updateModal}
            onBack={()=> setSelectQuantityModalOpen(false)}
        />
        <CreateNewModalFlow type={flowType.TEST_CASE} modalOpen={createNewFlow} onClose={() => setCreateNewFlow(false)} />
        <SplitScreen
            topChildren={
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <h1>Test Plan Details</h1>
                <CPButton text="Edit"
                onClick={()=>{
                    console.log("clicked")
                    updateModal("edit");}}/>
                </div>}
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

export async function getServerSideProps(context) {
    /* 
       Gets Data for Test Plan Details
       TODO: Error Check await call
       TODO: Refactor out fetch call
    */
    const res = await fetch(`${process.env.HOST}/api/getTestPlan?testPlanId=`+context.query.TestPlanId);
    const testPlanData = await res.json().then((data) => {
        return {...data[0], };
    });

    /* 
       Gets Data for BOM Table
       TODO: Error Check await call
       TODO: Refactor out fetch call
    */
    var BOM_entries = [];
    for(var i = 0; i < testPlanData.summaryBOM.length; i++) {
        const deviceRes = await fetch(`${process.env.HOST}/api/getDevice?deviceId=`
        +testPlanData.summaryBOM[i].deviceId);
        const deviceData = await deviceRes.json();
        const BOM_entry = { 
            ...deviceData[0],
            "isOptional": testPlanData.summaryBOM[i].isOptional,
            "quantity": testPlanData.summaryBOM[i].quantity,
        };
        BOM_entries.push(BOM_entry);
    }

    /* 
       Gets Data for Test Cases Table
       TODO: Error Check await call
       TODO: Refactor out fetch call
    */
    const res2 = await fetch(`${process.env.HOST}/api/getTestCasesByTestPlan?testPlanId=`+context.query.TestPlanId);
    const testCasesData = await res2.json().then((data) => data.map((testCase => {
        return {
            "_id": testCase._id,
            "name": (testCase.name != "")?testCase.name:"N/A",
            "description": (testCase.name != "")?testCase.name:"N/A",
            "percentPassed":"__%",
            "config": (testCase.config != "")?testCase.config:"N/A",
            // Other Fields not displayed:
            // "timeEstimate"
            // "testPlanId"
            // "BOM"
        }
    })));
    return {
      props: {...testPlanData, testCasesData, BOM_entries}, // will be passed to the page component as props
    }
  }
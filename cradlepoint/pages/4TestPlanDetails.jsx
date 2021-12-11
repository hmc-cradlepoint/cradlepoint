import React, {useState} from 'react';
import { useRouter } from 'next/router';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable } from '../components/tables/Table';

import CPButton from '../components/button/CPButton';
import SelectDeviceModal from './deviceModals/selectDevice';
import SelectQuantityModal from './deviceModals/selectQuantity';
import CreateNewModalFlow from './createNewModalFlow/createNewModalFlow';

import { makeStyles } from '@mui/styles';
import styles from '../styles/EngagementDetails.module.css';
import styling from '../styles/tableStyling';

import { BOMColumns, BOMRows, testCaseRows, testCaseColumns} from '../util/tableColumns';
import { flowType } from './createNewModalFlow/utils';

export default function TestPlanDetails(props) {
    const router = useRouter();
    const [createNewFlow, setCreateNewFlow] = useState(false);
    
    const useStyles = makeStyles(styling);
    const classes = useStyles();

    function handleNavigation(id) {
        router.push("/5TestCaseDetails?_id=" + id);
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
                <PlainTable rows={props.testPlanData.summaryBOM} columns={BOMColumnsWithAction} className={classes.root} 
                getRowId={(row) => row.deviceId}/>
            </div>
        )
    }

    const [selectDeviceModalOpen, setSelectDeviceModalOpen] = useState(false);
    const [selectQuantityModalOpen, setSelectQuantityModalOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState({});
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

    function description() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Detailed Description</h2>
                <p>{props.testPlanData.detailedDescription}</p>
            </div>
        )
    }

    return (
        <>
        <SelectDeviceModal
            modalOpen={selectDeviceModalOpen} 
            onClickNext={updateModal}
            onBack={()=> setSelectDeviceModalOpen(false)}
            modalData={props.allDevices}
            selectRows={(sRows) => setSelectedRows(sRows)}
        />
        <SelectQuantityModal
            modalOpen={selectQuantityModalOpen} 
            onClickNext={updateModal}
            selectedRowData={selectedRows}
            onBack={()=> setSelectQuantityModalOpen(false)}
        />
        <CreateNewModalFlow modalData={props.allTestCases} type={flowType.TEST_CASE} modalOpen={createNewFlow} onClose={() => setCreateNewFlow(false)} />
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
    const res = await fetch(`${process.env.HOST}/api/getTestPlan?_id=`+context.query._id);
    const testPlanData = await res.json().then((data) => data[0]);

    /* 
       Gets Data for Test Cases Table
       TODO: Error Check await call
       TODO: Refactor out fetch call
    */
    const res2 = await fetch(`${process.env.HOST}/api/getTestCasesByTestPlan?testPlanId=`+context.query._id);
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

    const allTestCases = await (await fetch(`${process.env.HOST}/api/getLibraryTestCases`)).json();
    const allDevices = await (await fetch(`${process.env.HOST}/api/getAllDevices`)).json();

    return {
      props: {
          testPlanData, 
          testCasesData,
          allTestCases,
          allDevices,
        },
    }
  }
import React, {useState} from 'react';
import { useRouter } from 'next/router';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable } from '../components/tables/Table';
import CPButton from '../components/button/CPButton';
import SelectDeviceModal from './deviceModals/selectDevice';
import SelectQuantityModal from './deviceModals/selectQuantity';
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

export default function TestPlanDetails(props) {
    const router = useRouter();
    const refreshData = ( () => {
        router.replace(router.asPath);
    })

    let paramId;
    let testPlanId;
    const getParams = (id, testPlanId) => {
        paramId = id;
        testPlanId = testPlanId;
    }

    const [deleteModal, setDeleteModal] = useState(false);
    const handleDelete = () => {
        deleteData(deleteAPIRoute.TEST_CASE, paramId, testPlanId);
        setDeleteModal(false);
    }

    const [createNewFlow, setCreateNewFlow] = useState(false);
    const [editModalFlow, setEditModalFlow] = useState(false);
    const useStyles = makeStyles({styling});
    const classes = useStyles();

    const { directory, dispatch } = useNavContext();

    const deleteAPIRoute = {
        BOM: "/api/deleteTestCaseBOM",
        TEST_CASE: "/api/deleteTestCase",
    }

    async function deleteData(route, resId, parentTestPlanId) {
        let data = {
            "_id": resId,
            "parentTestPlanId": parentTestPlanId,
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


    function handleNavigation(id) {
        const nextPage = "/5TestCaseDetails?_id=" + id;
        const payload = {title: "Test Case Details", url: nextPage};
        router.push(nextPage);
        dispatch({type: "ADD_PAGE", payload: payload});
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
            <CPButton text="Delete" onClick={() => {setDeleteModal(true)}}/>
            {getParams(params.id, props.testPlanData._id)}
        </div>
        ),
        flex: 2
    },
    ]);


    // TODO: (optional) Add buttons / additional fields to sumamryBOM
    // const SummaryBOMColumns = BOMColumns.concat([
    //     { 
    //         field: 'button', 
    //         headerName: 'Actions',
    //         headerClassName: 'header',
    //         align: 'center',
    //         renderCell: () => {
    //             return (
    //                 <div style={{display: "flex", flexDirection: "row"}}> 
    //                 <CPButton text="View"/>
    //                 </div>
    //             )
    //         },
    //         flex: 1
    //     }
    // ]);


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
                </div>
                <PlainTable rows={props.testPlanData.summaryBOM} columns={BOMColumns} className={classes.root} 
                getRowId={(row) => row._id}/>
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

    async function handleUploadDocument(filename) {
        let newData = {
          ...props.testPlanData, 
          "deviceConfig": filename,
        }
    
        let endPoint = '/api/editTestPlan';
        let method = 'PUT';
    
        try{
          const d = JSON.stringify(newData);
          const res = await fetch(endPoint, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(d)
            },
            body: d
          })
          console.log("RES:", res)
          refreshData();
        } catch (err){
          console.log("Error:",err)
        }
      }
    
    function details() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Details</h2>
                <p>Name: {props.testPlanData.name}</p>
                <p>Active: {(props.testPlanData.isActive).toString()}</p>
                <p>Device Config:</p> 
                    <UploadComponents 
                        filename = {`device_config_${props.testPlanData._id}`} 
                        downloadLink = {props.configLink} 
                        updateDocument = {handleUploadDocument}
                    />
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
                <p>{props.testPlanData.description}</p>
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
            selectedRows={selectedRows}
            onBack={()=> setSelectQuantityModalOpen(false)}
        />
        <CreateNewModalFlow modalData={props} type={flowType.TEST_CASE} modalOpen={createNewFlow} onClose={() => {setCreateNewFlow(false); refreshData();}} />
        <EditModalFlow data={props.testPlanData} type={flowType.TEST_PLAN} modalOpen={editModalFlow} onClose={() => {setEditModalFlow(false); refreshData();}} />
        <DeleteModalForm isOpen={deleteModal} onBack={() => setDeleteModal(false)} handleDelete={() => handleDelete()}/>
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
import {getAllDevices} from "./api/getAllDevices";
import {getLibraryTestCases} from "./api/getLibraryTestCases";
import UploadComponents from '../components/UploadComponents';
import {downloadUrl} from "./api/downloadUrl"


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
    const configLink = await downloadUrl(testPlanData?.deviceConfig)

    /* 
       Gets Data for Test Cases Table
       TODO: Error Check await call
       TODO: Refactor out fetch call
    */
    const res2 = await getTestCasesByTestPlan(context.query._id);
    const testCasesData = await Promise.all(res2.map(( async (testCase) => {
        const config = await downloadUrl(testCase.config)
        const topology = await downloadUrl(testCase.topology)
        return {
            "_id": testCase._id,
            "name": (testCase.name != "")?testCase.name:"N/A",
            "description": (testCase.description != "")?testCase.description:"N/A",
            "config": config,
            "topology": topology,
            // Other Fields not displayed:
            // "percentPassed":"__%",
            // "testPlanId"
            // "BOM"
        }
    })));
    console.log(testCasesData)

    const allTestCases = await getLibraryTestCases();
    const allDevices = await getAllDevices();
   
 
    return {
      props: {
          testPlanData, 
          testCasesData,
          allTestCases,
          allDevices,
          configLink
        },
    }
  }

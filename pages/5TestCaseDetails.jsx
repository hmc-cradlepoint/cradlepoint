import React, {useState} from 'react';
import { useRouter } from 'next/router';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable} from '../components/tables/Table';
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import SelectDeviceModal from './deviceModals/selectDevice';
import SelectQuantityModal from './deviceModals/selectQuantity';
import EditModalFlow from './editModalFlow';
import CreateNewModalFlow from './createNewModalFlow';
import styles from '../styles/EngagementDetails.module.css';
import { BOMColumns, testColumns} from '../util/tableColumns';
import { flowType } from '../util/modalUtils';
import styling from '../styles/tableStyling';
import NavDir from '../components/navDir';
import { useNavContext } from '../context/AppWrapper';
import DeleteModalForm from './ModalForms/DeleteModalForm';

// TODO: allow for editing BOM
// TODO: BOM can make code version editable
// TODO: summary BOM can remove code version field
export default function TestCaseDetails(props) {
    const router = useRouter();
    const refreshData = ( () => {
        router.replace(router.asPath);
    })

    // For delete purposes
    let paramTest, paramBom;

    const getTestParams = (row) => {
        paramTest = row;
    }

    const getBomParams = (row) => {
        paramBom = row;
    }

    const [deleteModal, setDeleteModal] = useState(false);
    // for delete purpose, should hold a list of 2 elements [apiRoute, selectedRow]
    const [routeParam, setRouteParam] = useState();

    const handleDelete = () => {
        deleteData(routeParam);
        setDeleteModal(false);
    }

    const useStyles = makeStyles({styling});
    const classes = useStyles();

    const { directory, dispatch } = useNavContext();
    const [selectedIDs, setSelectedIDs] = useState(new Set());
   
    const deleteAPIRoute = {
        BOM: "/api/deleteTestCaseBOM",
        TEST: "/api/deleteTest",
    }

    async function deleteData(routeParam) {
        let data = {
            ...routeParam[1],
            "parentTestCaseId": props.testCase._id,
        }
      
        const route = routeParam[0];
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
        const nextPage = "/6TestDetails?_id="+id;
        const payload = {title: "Test Details", url: nextPage};
        router.push(nextPage);
        dispatch({type: "ADD_PAGE", payload: payload});
    }
    
    const [createNewFlow, setCreateNewFlow] = useState(false);
    const [editModalFlow, setEditModalFlow] = useState(false);
    const testColumnsWithActions = testColumns.concat([
    { field: 'resultStatus', headerName: 'Result Status', headerClassName: 'header', flex: 1},
    { 
        field: 'button', 
        headerName: 'Actions',
        headerClassName: 'header',
        align: 'center',
        renderCell: (params) => (
        <div style={{display: "flex", flexDirection: "row"}}>
            <CPButton text="View" onClick={() => handleNavigation(params.id)}/>
            <CPButton text="Delete" onClick={() => {setRouteParam([deleteAPIRoute.TEST, paramTest]);
                                                    setDeleteModal(true);}}/>
            {getTestParams(params.row)}
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
            renderCell: (params) => {
                return (
                    <div style={{display: "flex", flexDirection: "row"}}> 
                    <CPButton text="Edit" onClick={() => {updateModal("edit");
                                                            setSelectedIDs(new Set([params.id]))
                                                        }}/>
                    <CPButton text="Delete" onClick={() => {setRouteParam([deleteAPIRoute.BOM, paramBom]);
                                                            setDeleteModal(true);}}/>
                        {getBomParams(params.row)}
                    </div>
                )
            },
            flex: 1
        },
        // { 
        //     field: 'codeVersion', headerName: 'Code Version', headerClassName: 'header', flex: 1, 
        //     valueGetter: (params) => {
        //         return params.row.device.codeVersion;
        //     }
        // }
    ]);


    function tests() {
        // Test table component
        return (
            <div className={styles.tableContainer} style={{paddingTop: 50}}>
                <div className={styles.tableButtonRow}>
                    <h2>Tests</h2>
                    <CPButton text="Add New" onClick={() => {
                        setCreateNewFlow(true)}} />
                </div>
                <PlainTable rows={props.tests} columns={testColumnsWithActions} className={classes.root}/>
            </div>
        )
    }


    function BOM() {
        // BOM Elements component
        return (
            <div className={styles.tableContainer} style={{paddingTop: 50}}>
                <div className={styles.tableButtonRow}>
                    <h2>Bill of Materials</h2>
                    <CPButton text="Add New"
                        onClick={() => {updateModal("select_device")}}
                    />
                </div>
                <PlainTable rows={props.testCase.BOM} columns={BOMColumnsWithAction} className={classes.root} getRowId={(row) => row._id}/>
            </div>
        )
    }

    const [selectDeviceModalOpen, setSelectDeviceModalOpen] = useState(false);
    const [selectQuantityModalOpen, setSelectQuantityModalOpen] = useState(false);
    const [bomEditMode, setBomEditMode] = useState(false);

    async function updateModal(modalType){
      switch(modalType){
        case "select_device":
            setSelectDeviceModalOpen(true)
            break;
        case "select_quantity":
            setBomEditMode(false);
            setSelectQuantityModalOpen(true)
            break;
        case "edit":
            setBomEditMode(true);
            setSelectQuantityModalOpen(true)
            break;
      }
    }

    function details() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <p>Subject: {props.testCase.name}</p>
                <p>Topology: {props.testCase.topology}</p>
                <p>Config: {props.testCase.config}</p>
                {/* <p>Percent of Tests Passed: TBD</p> */}
            </div>
        )
    }
    function description() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Detailed Description</h2>
                <p>{props.testCase.description}</p>
            </div>
        )
    }

    
    
    return (
        <div>
            <CreateNewModalFlow modalData={props} type={flowType.TEST} modalOpen={createNewFlow} onClose={() => {setCreateNewFlow(false);refreshData();}} />
            <EditModalFlow data={props.testCase} type={flowType.TEST_CASE} modalOpen={editModalFlow} onClose={() => {setEditModalFlow(false); refreshData();}} />
            <DeleteModalForm isOpen={deleteModal} onBack={() => setDeleteModal(false)} handleDelete={() => handleDelete()}/>
            <SelectDeviceModal
              modalOpen={selectDeviceModalOpen} 
              onClickNext={updateModal}
              onBack={()=> {setSelectDeviceModalOpen(false);}}
              modalData={props.libraryDevices}
              selectedIDs={selectedIDs}
              setSelectedIDs={setSelectedIDs}
            />
            
            <SelectQuantityModal
              modalOpen={selectQuantityModalOpen} 
              selectedIDs={selectedIDs}
              testCase={props.testCase}
              editMode={bomEditMode}
              libraryDevices={props.libraryDevices}
              onClickNext={updateModal}
              onBack={()=> setSelectQuantityModalOpen(false)}
              onClose={()=> {setSelectDeviceModalOpen(false);
                            setSelectQuantityModalOpen(false);
                            setSelectedIDs(new Set());
                            refreshData();}}
            />
        
        <SplitScreen
            topChildren={
                <>
                <NavDir pages={directory} />
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <h1>Test Case Details</h1>
                    <CPButton text="Edit"
                    onClick={() => setEditModalFlow(true)}/>
                </div>
                </>
            }
            leftSection={details()}
            rightSection={description()}
            bottomChildren={
                <div>
                {tests()}
                {BOM()}
                </div>
            }
        />
        </div> 
 
    )
}

import {getTestCase} from "./api/getTestCase";
import {getTests} from "./api/getTests";
import {getLibraryTests} from "./api/getLibraryTests";
import {getAllDevices} from "./api/getAllDevices";

export async function getServerSideProps(context) {
    try {
        const testCase = await getTestCase(context.query._id);
        const tests = await getTests(context.query._id);
        // TODO: getAllDevices api
        const libraryDevices = await getAllDevices()
        const allTests = await getLibraryTests();
        
        if (testCase.len == 0) {
            return { notFound: true }
        }
        // TODO: this is a "sketchy" quickfix to situation where testCase BOM has no device
        // the getTestCase query will return BOM as BOM: [{}]
        // this line replaces it to BOM: []
        if (!('deviceId' in testCase[0].BOM[0])){
            testCase[0].BOM = [];
        }
          return {
            props: {
                testCase: testCase[0],
                tests,
                libraryDevices,
                allTests
            },
        }
    }
    catch(err) {
        throw err;
    }
}

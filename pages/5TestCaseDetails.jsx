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

/**
 * 
 * @param {*} props passed in from getServerSideProps() function on the bottom of this document, see this function for details
 * @returns Test Case Details Page as a div, along with modals that are default to invisible
 */
export default function TestCaseDetails(props) {
    const router = useRouter();
    const refreshData = ( () => {
        router.replace(router.asPath);
    })

    // Navigation
    const { directory, dispatch } = useNavContext();
    function handleNavigation(id) {
        const nextPage = "/6TestDetails?_id="+id;
        const payload = {title: "Test Details", url: nextPage};
        router.push(nextPage);
        dispatch({type: "ADD_PAGE", payload: payload});
    }

    // Styling
    const useStyles = makeStyles({styling});
    const classes = useStyles();


    /**
     * Delete: variables and functions used
     * Note that there are 2 delete paths in this page: delete test, delete a BOM device
     */   
    // ----------------------------------------------
    let paramTest, paramBom;

    // stores the test row that is selected to be deleted
    const getTestParams = (row) => {
        paramTest = row;
    }

    // stores the BOM device row that is selected to be deleted
    const getBomParams = (row) => {
        paramBom = row;
    }

    const [deleteModal, setDeleteModal] = useState(false);
    
    // stores a list of 2 elements [apiRoute, selectedRow]
    const [routeParam, setRouteParam] = useState();

    const handleDelete = () => {
        deleteData(routeParam);
        setDeleteModal(false);
    }
  
    const deleteAPIRoute = {
        BOM: "/api/deleteTestCaseBOM",
        TEST: "/api/deleteTest",
    }

    /**
     * 
     * @param {*} routeParam in the form of [apiRoute, selectedRow]
     * calls deleteTestCaseBOM or deleteTest depending on the apiRoute
     */
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
    // ----------------------------------------------

    // controls edit test case modal flows
    const [editModalFlow, setEditModalFlow] = useState(false);
    // controls create new test modal flows
    const [createNewFlow, setCreateNewFlow] = useState(false);
    // controls edit and create new device flow (see doc for details)
    const [selectDeviceModalOpen, setSelectDeviceModalOpen] = useState(false);
    const [selectQuantityModalOpen, setSelectQuantityModalOpen] = useState(false);
    const [bomEditMode, setBomEditMode] = useState(false);

    /**
     * 
     * @param {*} modalType specify which device modal flow 
     * updates the state variables depending on the model type
     * including opening/closing the correct modal(s)
     * 
     * note: this function is passed as onClickNext argument to the selectDeviceModal
     */
    async function updateModal(modalType){
      switch(modalType){
        // triggered by clicking on Add New button in the page above the BOM table
        case "select_device":
            setSelectDeviceModalOpen(true)
            break;
        // triggered by Next button in the selectDeviceModal
        case "select_quantity":
            setBomEditMode(false);
            setSelectQuantityModalOpen(true)
            break;
        // triggered by Edit button in the page in the BOM table
        case "edit":
            setBomEditMode(true);
            setSelectQuantityModalOpen(true)
            break;
      }
    }

    // variable used for create new device modal flow or edit device modal flow(see docs for detail)
    // for create new: stores the device ids that are selected in the SelectedDeivceModal and pass to SelectQuantity Modal
    // for edit device: stores the id of the BOM entry that user wants to edit and pass to SelectQuantity Modal
    const [selectedIDs, setSelectedIDs] = useState(new Set());
   
    // Test table columns
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


    // BOM table columns
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
        // TODO: unimplemented for all the modals and schema
        // { 
        //     field: 'codeVersion', headerName: 'Code Version', headerClassName: 'header', flex: 1, 
        //     valueGetter: (params) => {
        //         return params.row.device.codeVersion;
        //     }
        // }
    ]);


    // Child components for the page
    // ----------------------------------------------
    /**
     * @returns a div containing the test tables and add new button
     */
    function tests() {
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


     /**
     * 
     * @returns a div containing the BOM table of the test case
     */
    function BOM() {
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

    /**
     * 
     * @returns a div dispalying a description of the test case
     */
         function description() {
            return (
                <div style={{display: "flex", flexDirection: "column"}}>
                    <h2>Detailed Description</h2>
                    <p>{props.testCase.description}</p>
                </div>
            )
        }


    /**
     * 
     * @returns a div displaying all the text fields of the test case
     */
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
    // ----------------------------------------------

    return (
        <div>
            {/* Pop-up modals that are controlled by state variables */}
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
            //   onClickNext={updateModal}
              onBack={()=> setSelectQuantityModalOpen(false)}
              onClose={()=> {setSelectDeviceModalOpen(false);
                            setSelectQuantityModalOpen(false);
                            setSelectedIDs(new Set());
                            refreshData();}}
            />
        {/* The actual screen */}
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
/**
 * 
 * @param {*} context 
 * @returns retrives all the necessary props to load the page
 * automatically called and return is served as param for the page
 */

export async function getServerSideProps(context) {
    try {
        const testCase = await getTestCase(context.query._id);
        const tests = await getTests(context.query._id);
        const libraryDevices = await getAllDevices()
        const allTests = await getLibraryTests();
        
        if (testCase.len == 0) {
            // TODO: Display custom page for case where test case not found
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

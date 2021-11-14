import React, {useState} from 'react';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable, CheckBoxTable} from '../components/tables/Table';
import { makeStyles } from '@mui/styles';
import { CPButton, HorizontalButton } from '../components/button/CPButton';
import NewTestCaseModalInfo from './testPlanModals/newTestCaseInfo';
import NewTestCaseModal from './testPlanModals/newTestCase';
import NewTestCaseModalClone from './testPlanModals/newTestCaseClone';
import EditTestPlanInfo from './testPlanModals/editTestPlanInfo';
import SelectDeviceModal from './deviceModals/selectDevice';
import SelectQuantityModal from './deviceModals/selectQuantity';
import styles from '../styles/EngagementDetails.module.css';

export default function TestPlanDetails() {

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

    const testCaseRows = [
        // TODO: hardcoded data until API ready
        {id: "1", subject: "my test case 1", description: "lorem ipsum dolores et", coverage: "95%"},
        {id: "2", subject: "my test case 2", description: "lorem ipsum dolores et", coverage: "10%"}
    ];

    const testCaseLibraryRows = [
        // TODO: hardcoded data until API ready
        {id: 1, subject: 'Test case 1', description: 'This is a detail description of the test case'},
        {id: 2, subject: 'Test case 2', description: 'This is a detail description of the test case'},
        {id: 3, subject: 'Test case 3', description: 'This is a detail description of the test case'},
        {id: 4, subject: 'Test case 4', description: 'This is a detail description of the test case'},
        {id: 5, subject: 'Test case 5', description: 'This is a detail description of the test case'},
        {id: 6, subject: 'Test case 6', description: 'This is a detail description of the test case'},
        {id: 7, subject: 'Test case 7', description: 'This is a detail description of the test case'}
    ];

    const testCaseColumns = [
    { field: 'id', headerName: 'ID', headerClassName: 'header', flex: 1},
    { field: 'subject', headerName: 'Subject', headerClassName: 'header', flex: 1},
    { field: 'description', headerName: 'Description', headerClassName: 'header', flex: 2},
    { field: 'coverage', headerName: 'Coverage', headerClassName: 'header', flex: 1}, //calculated from tests
    // { field: 'topology', headerName: 'Coverage', headerClassName: 'header', flex: 1}, 
    // { field: 'configs', headerName: 'Device Configs', headerClassName: 'header', flex: 2},
    { 
        field: 'button', 
        headerName: 'Actions',
        headerClassName: 'header',
        align: 'center',
        renderCell: (params) => (
        <div style={{display: "flex", flexDirection: "column"}}>
            <CPButton text="View Details"/>
            <CPButton text="Delete"/>
        </div>
        ),
        flex: 2
    }
    ];

    const BOMRows = [
        // TODO: hardcoded data until API ready
        {id: "1", deviceName: "Router", optional: "False", quantity: "50", physicalOrSoftware: "Physical", codeVer: "none", SKU: "323123"},
        {id: "2", deviceName: "Router", optional: "False", quantity: "50", physicalOrSoftware: "Physical", codeVer: "none", SKU: "323123"},
        {id: "3", deviceName: "Router", optional: "False", quantity: "50", physicalOrSoftware: "Physical", codeVer: "none", SKU: "323123"},
        {id: "4", deviceName: "Router", optional: "False", quantity: "50", physicalOrSoftware: "Physical", codeVer: "none", SKU: "323123"},
        {id: "5", deviceName: "Router", optional: "False", quantity: "50", physicalOrSoftware: "Physical", codeVer: "none", SKU: "323123"},
        {id: "6", deviceName: "Router", optional: "False", quantity: "50", physicalOrSoftware: "Physical", codeVer: "none", SKU: "323123"},
        {id: "7", deviceName: "Router", optional: "False", quantity: "50", physicalOrSoftware: "Physical", codeVer: "none", SKU: "323123"},
        {id: "8", deviceName: "Router", optional: "False", quantity: "50", physicalOrSoftware: "Physical", codeVer: "none", SKU: "323123"},
        {id: "9", deviceName: "Router", optional: "False", quantity: "50", physicalOrSoftware: "Physical", codeVer: "none", SKU: "323123"},
    ];

    const BOMColumns = [
        { field: 'id', headerName: 'ID', headerClassName: 'header', flex: 1},
        { field: 'deviceName', headerName: 'Device Name', headerClassName: 'header', flex: 1},
        { field: 'optional', headerName: 'Optional', headerClassName: 'header', flex: 1},
        { field: 'quantity', headerName: 'Quantity', headerClassName: 'header', flex: 1},
        { field: 'physicalOrSoftware', headerName: 'Physical/Software', headerClassName: 'header', flex: 1},
        { field: 'codeVer', headerName: 'Code Version', headerClassName: 'header', flex: 1},
        { field: 'SKU', headerName: 'SKU', headerClassName: 'header', flex: 1},
        { 
            field: 'button', 
            headerName: 'Actions',
            headerClassName: 'header',
            align: 'center',
            renderCell: () => (
            <div style={{display: "flex", flexDirection: "column"}}> 
                <CPButton text="Edit"/>
                <CPButton text="Delete"/>
            </div>
            ),
            flex: 1
        }
    ];


    function testCases() {
        // Test plans table component
        return (
            <div className={styles.tableContainer} style={{paddingTop: 50}}>
                <div className={styles.tableButtonRow}>
                    <h2>Test Cases of Current Plan</h2>
                    <CPButton text="Add New"
                            onClick={() => {updateModal("select");
                                    console.log(selectModalOpen);
                                }}
                    />
                </div>
                <PlainTable rows={testCaseRows} columns={testCaseColumns} className={classes.root}/>
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
                        onClick={() => {updateModal("select_device");
                    }}
                    />
                </div>
                <PlainTable rows={BOMRows} columns={BOMColumns} className={classes.root}/>
            </div>
        )
    }



    const [selectModalOpen, setSelectModalOpen] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [cloneModalOpen, setCloneModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const emptyRow = {subject: '', description: ''};
    const [selectedRow, setSelectedRow] = useState(emptyRow);   
    const [selectDeviceModalOpen, setSelectDeviceModalOpen] = useState(false);
    const [selectQuantityModalOpen, setSelectQuantityModalOpen] = useState(false);
    
    function updateModal(modalType,rowId=0){
      // console.log(input);
      // setModalType(input);
      console.log("modalOpen called with ");
      console.log(modalType);
      switch(modalType){
        case "select":
            setSelectModalOpen(true);
            break;
        case "scratch":
            setSelectedRow(emptyRow);
            setInfoModalOpen(true)
            break;
        case "clone":
            setCloneModalOpen(true)
            break;
        case "clone_selected":
            setCloneModalOpen(false)
            setInfoModalOpen(true)
            const selectedRowData = (testCaseLibraryRows.filter((row) => rowId===row.id))[0];
            setSelectedRow(selectedRowData);
            break;
        case "edit":
            setEditModalOpen(true)
            break;
        case "select_device":
            setSelectDeviceModalOpen(true)
            break;
        case "select_quantity":
            setSelectQuantityModalOpen(true)
            break;
        default:
            setSelectModalOpen(false)
            setInfoModalOpen(false)
            setCloneModalOpen(false)
            setEditModalOpen(false)
            setSelectDeviceModalOpen(false)
            setSelectQuantityModalOpen(false)
      }
    }

    
    function details() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Details</h2>
                <p>Subject: </p>
                <p>Active: (Boolean)</p>
                <p>Device Config: </p>
                <p>Coverage: </p>
                <p>Version: </p>
                <p>Date Created: </p>
                <p>Authors: </p>
                <p>Customer feedback</p>
            </div>
        )
    }
    function description() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <h2>Detailed Description</h2>
                <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
            </div>
        )
    }

    return (
        <div>
            <NewTestCaseModal
              modalOpen={selectModalOpen} 
              onClickNext={updateModal}
              onClose={()=> setSelectModalOpen(false)}></NewTestCaseModal>

            <NewTestCaseModalInfo
              modalOpen={infoModalOpen} 
              onBack={()=> setInfoModalOpen(false)}
              selectedRow={selectedRow}
              ></NewTestCaseModalInfo>

            <NewTestCaseModalClone
              modalOpen={cloneModalOpen} 
              onClickNext={updateModal}
              onBack={()=> setCloneModalOpen(false)}
              ></NewTestCaseModalClone>

            <EditTestPlanInfo
              modalOpen={editModalOpen} 
              onClickNext={updateModal}
              onBack={()=> setEditModalOpen(false)}
              selectedRow={selectedRow}
              ></EditTestPlanInfo>

            <SelectDeviceModal
              modalOpen={selectDeviceModalOpen} 
              onClickNext={updateModal}
              onBack={()=> setSelectDeviceModalOpen(false)}
              ></SelectDeviceModal>
            
            <SelectQuantityModal
              modalOpen={selectQuantityModalOpen} 
              onClickNext={updateModal}
              onBack={()=> setSelectQuantityModalOpen(false)}
              ></SelectQuantityModal>
        
        <SplitScreen
            topChildren={
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <h1>Test Plan Details</h1>
                <CPButton text="Edit Descriptions"
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
        </div> 
 
    )
}

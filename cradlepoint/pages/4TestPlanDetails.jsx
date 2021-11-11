import React, {useState} from 'react';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable } from '../components/tables/Table';
import { makeStyles } from '@mui/styles';
import { CPButton, HorizontalButton } from '../components/button/CPButton';
import NewTestCaseModalInfo from './testCaseModals/newTestCaseInfo';
import NewTestCaseModal from './testCaseModals/newTestCase';
import NewTestCaseModalClone from './testCaseModals/newTestCaseClone';
import EditTestCaseModalInfo from './testCaseModals/editTestCaseInfo';
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
        <p >
            <HorizontalButton text="Edit Info"
                onClick={()=>{
                    console.log(params.row)
                    const selectedRowData = params.row;
                    setSelectedRow(selectedRowData);
                    updateModal("edit");
            }}/>
            <HorizontalButton text="View Details"/>
            <HorizontalButton text="Delete"/>
        </p>
        ),
        flex: 1
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
            <p >
                <HorizontalButton text="Edit"/>
                <HorizontalButton text="Delete"/>
            </p>
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
                    <CPButton text="Add New"/>
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
        default:
            setSelectModalOpen(false)
            setInfoModalOpen(false)
            setCloneModalOpen(false)
      }
    }

    
    function description() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <p>Subject: </p>
                <p>Active: (Boolean)</p>
                <p>Details: </p>
                <p>Device Config: </p>
                <p>Coverage: </p>
                <p>Version: </p>
                <p>Date Created: </p>
                <p>Authors: </p>
                <p>Customer feedback</p>
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

            <EditTestCaseModalInfo
              modalOpen={editModalOpen} 
              onClickNext={updateModal}
              onBack={()=> setEditModalOpen(false)}
              selectedRow={selectedRow}
              ></EditTestCaseModalInfo>
        
        <SplitScreen
            topChildren={<h1>Test Plan Details</h1>}
            leftSection={description()}
            // rightSection={testCaseTimeEstimates()}
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

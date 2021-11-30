import React, {useState} from 'react';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable, CheckBoxTable} from '../components/tables/Table';
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import NewTestCaseModalInfo from './testCaseInfoModal';
// import EditTestPlanInfo from './editTestPlanInfo';
import SelectDeviceModal from './deviceModals/selectDevice';
import SelectQuantityModal from './deviceModals/selectQuantity';
import CreateNewModal from './createNewModal';
import NewModalClone from './newModalClone';
import styles from '../styles/EngagementDetails.module.css';
import { BOMColumns, BOMRows, testCaseRows, testCaseColumns} from '../util/tableColumns';

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

    const testCaseColumnsWithActions = testCaseColumns.concat([
    { 
        field: 'button', 
        headerName: 'Actions',
        headerClassName: 'header',
        align: 'center',
        renderCell: (params) => (
        <div style={{display: "flex", flexDirection: "row"}}>
            <CPButton text="View"/>
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
                    <CPButton text="Add New"
                            onClick={() => {updateModal("select");
                                    console.log(selectModalOpen);
                                }}
                    />
                </div>
                <PlainTable rows={testCaseRows} columns={testCaseColumnsWithActions} className={classes.root}/>
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
                <PlainTable rows={BOMRows} columns={BOMColumnsWithAction} className={classes.root}/>
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
            const selectedRowData = (testCaseRows.filter((row) => rowId===row.id))[0];
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
            <CreateNewModal
              type={'Test Case'}
              modalOpen={selectModalOpen} 
              onClickNext={updateModal}
              onClose={()=> setSelectModalOpen(false)}/>

            <NewTestCaseModalInfo
              modalOpen={infoModalOpen} 
              onBack={()=> setInfoModalOpen(false)}
              selectedRow={selectedRow}
              ></NewTestCaseModalInfo>

            <NewModalClone
              type={'Test Case'}
              modalOpen={cloneModalOpen} 
              onClickNext={updateModal}
              onBack={()=> setCloneModalOpen(false)}
              />

            {/* <EditTestPlanInfo
              modalOpen={editModalOpen} 
              onClickNext={updateModal}
              onBack={()=> setEditModalOpen(false)}
              selectedRow={selectedRow}
              ></EditTestPlanInfo> */}

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
        </div> 
 
    )
}

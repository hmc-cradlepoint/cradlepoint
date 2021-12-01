import React, {useState} from 'react';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable, CheckBoxTable} from '../components/tables/Table';
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import SelectDeviceModal from './deviceModals/selectDevice';
import SelectQuantityModal from './deviceModals/selectQuantity';
import CreateNewModalFlow from './createNewModalFlow/createNewModalFlow';
import styles from '../styles/EngagementDetails.module.css';
import { BOMColumns, BOMRows, testRows, testColumns} from '../util/tableColumns';
import { flowType } from './createNewModalFlow/utils';

export default function TestCaseDetails() {
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
    
    const [createNewFlow, setCreateNewFlow] = useState(false);

    const testColumnsWithActions = testColumns.concat([
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


    const BOMColumnsWithAction = BOMColumns.concat([
        { 
            field: 'button', 
            headerName: 'Actions',
            headerClassName: 'header',
            align: 'center',
            renderCell: () => {
                return (
                    <div style={{display: "flex", flexDirection: "row"}}> 
                    <CPButton text="Edit"/>
                    <CPButton text="Delete"/>
                    </div>
                )
            },
            flex: 1
        }
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
                <PlainTable rows={testRows} columns={testColumnsWithActions} className={classes.root}/>
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
                <PlainTable rows={BOMRows} columns={BOMColumnsWithAction} className={classes.root}/>
            </div>
        )
    }

    const [selectDeviceModalOpen, setSelectDeviceModalOpen] = useState(false);
    const [selectQuantityModalOpen, setSelectQuantityModalOpen] = useState(false);

    function updateModal(modalType){
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
                <p>Subject: </p>
                <p>Percent of Tests Passed: </p>
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
            <CreateNewModalFlow type={flowType.TEST} modalOpen={createNewFlow} onClose={() => setCreateNewFlow(false)} />
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
                <h1>Test Case Details</h1>
                <CPButton text="Edit"
                onClick={()=>{
                    console.log("clicked")
                    updateModal("edit");}}/>
                </div>}
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

import React, {useState} from 'react';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable, CheckBoxTable} from '../components/tables/Table';
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import styles from '../styles/EngagementDetails.module.css';
import { BOMColumns, BOMRows, testRows, testColumns, resultColumns, resultRows} from '../util/tableColumns';
import ResultModalForm from './ResultModalForm';
import TestModalForm from './TestModalForm';

export default function TestDetails() {

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
                <PlainTable rows={resultRows} columns={resultWithActions} className={classes.root}/>
            </div>
        )
    }




    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false); 
    const emptyRow = {subject: '', description: ''};
    const [selectedRow, setSelectedRow] = useState(emptyRow); 

    function updateModal(modalType){
      switch(modalType){
        case "result":
            setResultModalOpen(true)
            break;
        case "edit":
            setEditModalOpen(true)
            break;
        default:
            setResultModalOpen(false)
            setEditModalOpen(false)
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
            <TestModalForm
              isOpen={editModalOpen} 
              onClickNext={updateModal}
              onBack={()=> setEditModalOpen(false)}
            //   TODO: should pass in the current test detail to populate the pop-up
              selectedRow={selectedRow}
              ></TestModalForm>

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
                onClick={()=>{
                    updateModal("edit");}}/>
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

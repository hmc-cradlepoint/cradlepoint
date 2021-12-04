import React, {useState} from 'react';
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
                    <CPButton text="Add New" onClick={() => setCreateNewFlow(true)}/>
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
                        onClick={() => {updateModal("select_device")}}
                    />
                </div>
                <PlainTable rows={BOMRows} columns={BOMColumnsWithAction} className={classes.root}/>
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
                <p>Subject: ??? No Database Field ???</p>
                <p>Active: {(props.isActive).toString()}</p>
                <p>Device Config: {props.deviceConfig}</p>
                <p>Coverage: Calculate on FrontEnd</p>
                <p>Version: {props.version}</p>
                <p>Date Created: {props.createdOn}</p>
                <p>Authors: {props.authors}</p>
                <p>Customer feedback: {props.customerFeedback}</p>
            </div>
        )
    }

    function description() {
        console.log();
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
    // TODO: Refactor - Fetching is bad code, docs say to not do this.
    const res = await fetch(`${process.env.HOST}/api/getTestPlan?testPlanId=`+context.query.TestPlanId);
    const data = await res.json()
    const testPlanData = data[0];
    if (!testPlanData) {
      return {
        notFound: true,
      }
    };
    const res2 = await fetch(`${process.env.HOST}/api/getTestCasesByTestPlan?testPlanId=`+context.query.TestPlanId);
    const testCasesData = await res2.json();
    console.log("TestCases:", testCasesData);
    const BOMSummaryData = testCasesData.map((testCase) => testCase.BOM );
    // console.log("BOM:", BOMSummaryData);
    // TODO: extract BOM's from testCasesData, and display in summary BOM
    return {
      props: {...testPlanData, testCasesData}, // will be passed to the page component as props
    }
  }
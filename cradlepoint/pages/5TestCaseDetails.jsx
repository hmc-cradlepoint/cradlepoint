import React, {useState} from 'react';
import { useRouter } from 'next/router';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable, CheckBoxTable} from '../components/tables/Table';
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

export default function TestCaseDetails(props) {
    const router = useRouter();
    const refreshData = ( () => {
        router.replace(router.asPath);q
    })

    const useStyles = makeStyles(styling);
    const classes = useStyles();

    const { directory, dispatch } = useNavContext();

    function handleNavigation(id) {
        const nextPage = "/6TestDetails?_id="+id;
        const payload = {title: "Test Details", url: nextPage};
        router.push(nextPage);
        dispatch({type: "ADD_PAGE", payload: payload});
    }
    
    const [createNewFlow, setCreateNewFlow] = useState(false);
    const [editModalFlow, setEditModalFlow] = useState(false);
    const testColumnsWithActions = testColumns.concat([
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
                <PlainTable rows={props.testCase.BOM} columns={BOMColumnsWithAction} className={classes.root} getRowId={(row) => row.deviceId}/>
            </div>
        )
    }

    const [selectDeviceModalOpen, setSelectDeviceModalOpen] = useState(false);
    const [selectQuantityModalOpen, setSelectQuantityModalOpen] = useState(false);
    
    // let selectedRowData = [];
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
                <p>Subject: {props.testCase.name}</p>
                <p>Topology: {props.testCase.topology}</p>
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

    const [selectedRows, setSelectedRows] = useState({});

    return (
        <div>
            <CreateNewModalFlow modalData={props.allTests} type={flowType.TEST} modalOpen={createNewFlow} onClose={() => setCreateNewFlow(false)} />
            <EditModalFlow data={props.testCase} type={flowType.TEST_CASE} modalOpen={editModalFlow} onClose={() => {setEditModalFlow(false); refreshData();}} />
            <SelectDeviceModal
              modalOpen={selectDeviceModalOpen} 
              onClickNext={updateModal}
              onBack={()=> setSelectDeviceModalOpen(false)}
              selectRows={(sRows) => setSelectedRows(sRows)}
            />
            
            <SelectQuantityModal
              modalOpen={selectQuantityModalOpen} 
              selectedRowData={selectedRows}
              onClickNext={updateModal}
              onBack={()=> setSelectQuantityModalOpen(false)}
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

export async function getServerSideProps(context) {
    try {
        const testCase = await (await fetch(`${process.env.HOST}/api/getTestCase?_id=${context.query._id}`)).json()
        const tests = await (await fetch(`${process.env.HOST}/api/getTests?testCaseId=${context.query._id}`)).json()
        // TODO: getLibraryTests api
        // const allTests = await (await fetch(`${process.env.HOST}/api/getLibraryTest`)).json()
        
        if (testCase.len == 0) {
            return { notFound: true }
        }
          return {
            props: {
                testCase: testCase[0],
                tests,
                allTests: []
            },
        }
    }
    catch(err) {
        throw err;
    }
}

import React from 'react';
import SplitScreen from '../components/baseScreen/SplitScreen';
import { PlainTable } from '../components/tables/Table';
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';

import styles from '../styles/EngagementDetails.module.css';

export default function EngagementDetails() {

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

    const testPlanRows = [
        // TODO: hardcoded data until API ready
        {id: "1", subject: "subject", topology: "topology", status: "pass", description: "lorem ipsum dolores et", coverage: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
        {id: "2", subject: "subject", topology: "topology", status: "pass", description: "lorem ipsum dolores et", coverage: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
        {id: "3", subject: "subject", topology: "topology", status: "pass", description: "lorem ipsum dolores et", coverage: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
        {id: "4", subject: "subject", topology: "topology", status: "pass", description: "lorem ipsum dolores et", coverage: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
        {id: "5", subject: "subject", topology: "topology", status: "pass", description: "lorem ipsum dolores et", coverage: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
        {id: "6", subject: "subject", topology: "topology", status: "pass", description: "lorem ipsum dolores et", coverage: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
        {id: "7", subject: "subject", topology: "topology", status: "pass", description: "lorem ipsum dolores et", coverage: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
        {id: "8", subject: "subject", topology: "topology", status: "pass", description: "lorem ipsum dolores et", coverage: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
        {id: "9", subject: "subject", topology: "topology", status: "pass", description: "lorem ipsum dolores et", coverage: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
        {id: "10", subject: "subject", topology: "topology", status: "pass", description: "lorem ipsum dolores et", coverage: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
    ];

    const testPlanColumns = [
    { field: 'id', headerName: 'ID', headerClassName: 'header', flex: 1},
    { field: 'subject', headerName: 'Subject', headerClassName: 'header', flex: 1},
    { field: 'topology', headerName: 'Topology', headerClassName: 'header', flex: 1},
    { field: 'status', headerName: 'Status', headerClassName: 'header', flex: 1},
    { field: 'description', headerName: 'Description', headerClassName: 'header', flex: 2},
    { field: 'coverage', headerName: 'Coverage', headerClassName: 'header', flex: 1},
    { field: 'customerFeedback', headerName: 'Customer Feedback', headerClassName: 'header', flex: 2},
    { field: 'authors', headerName: 'Authors', headerClassName: 'header', flex: 1},
    { field: 'version', headerName: 'Version', headerClassName: 'header', flex: 1},
    { field: 'dateCreated', headerName: 'Date Created', headerClassName: 'header', flex: 1},
    { field: 'deviceConfigs', headerName: 'Device Configs', headerClassName: 'header', flex: 2},
    { 
        field: 'button', 
        headerName: 'Actions',
        headerClassName: 'header',
        align: 'center',
        renderCell: () => (
        <span>
            <CPButton text="EDIT"/>
        </span>
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
            <span>
                <CPButton text="EDIT"/>
            </span>
            ),
            flex: 1
        }
    ];

    const TestPlanTimeEstimatesRows = [
        {id: 1, name: "Router testing", status: "good", timeEst: "1 hour"},
        {id: 2, name: "Router testing", status: "good", timeEst: "1 hour"},
        {id: 3, name: "Router testing", status: "good", timeEst: "1 hour"},
        {id: 4, name: "Router testing", status: "good", timeEst: "1 hour"},
        {id: 5, name: "Router testing", status: "good", timeEst: "1 hour"},
        {id: 6, name: "Router testing", status: "good", timeEst: "1 hour"},
    ]

    const TestPlanTimeEstimatesColumns = [
        { field: 'id', headerName: 'ID', headerClassName: 'header', flex: 1},
        { field: 'name', headerName: 'Name', headerClassName: 'header', flex: 2},
        { field: 'status', headerName: 'Status', headerClassName: 'header', flex: 1.5},
        { field: 'timeEst', headerName: 'Time Est.', headerClassName: 'header', flex: 2},
    ];

    function testPlans() {
        // Test plans table component
        return (
            <div className={styles.tableContainer} style={{paddingTop: 50}}>
                <div className={styles.tableButtonRow}>
                    <h2>Test Plans</h2>
                    <CPButton text="Add New"/>
                </div>
                <PlainTable rows={testPlanRows} columns={testPlanColumns} className={classes.root}/>
            </div>
        )
    }

    function BOMSummary() {
        // Summary of BOM Elements component
        return (
            <div className={styles.tableContainer} style={{paddingTop: 50}}>
                <div className={styles.tableButtonRow}>
                    <h2>Summary of Bill of Materials Elements</h2>
                    <CPButton text="Add New"/>
                </div>
                <PlainTable rows={BOMRows} columns={BOMColumns} className={classes.root}/>
            </div>
        )
    }

    function testPlanTimeEstimates() {
        // Test plan time estimates table
        return (
            <div className={styles.tableContainer}>
                <h2>Test Plan Time Estimates</h2>
                <PlainTable rows={TestPlanTimeEstimatesRows} columns={TestPlanTimeEstimatesColumns} className={classes.root}/>
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
        <SplitScreen
            topChildren={<h1>Engagement Details</h1>}
            leftSection={description()}
            rightSection={testPlanTimeEstimates()}
            bottomChildren={
                <div>
                {testPlans()}
                {BOMSummary()}
                </div>
            }
        />
    )
}

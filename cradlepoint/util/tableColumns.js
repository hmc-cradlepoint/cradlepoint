const engagementColumns = [
    { field: 'id', headerName: 'id', headerClassName: 'header', flex: 1, hide: true},
    { field: 'name', headerName: 'Name', headerClassName: 'header', flex: 1},
    { field: 'status', headerName: 'Status', headerClassName: 'header', flex: 1},
    { field: 'details', headerName: 'Details', headerClassName: 'header', sortable:false, flex: 2, hide: true, minWidth: 200},
    { field: 'sysEng', headerName: 'SEng', headerClassName: 'header', flex: 1},
    { field: 'pocEng', headerName: 'POC Eng', headerClassName: 'header', flex: 1},
    { field: 'customer', headerName: 'Customer', headerClassName: 'header', flex: 1},
    { field: 'sfdc', headerName: 'SFDC', headerClassName: 'header', flex: 1},
    { field: 'dateCreated', headerName: 'Date Created', headerClassName: 'header', flex: 1}
  ];

const testPlanColumns = [
    { field: 'id', headerName: 'ID', headerClassName: 'header', flex: 1, hide: true},
    { field: 'subject', headerName: 'Subject', headerClassName: 'header', flex: 1},
    { field: 'topology', headerName: 'Topology', headerClassName: 'header', flex: 1},
    { field: 'description', headerName: 'Description', headerClassName: 'header', flex: 2},
    { field: 'deviceConfig', headerName: 'Device Config', headerClassName: 'header', flex: 1},
    { field: 'status', headerName: 'Status', headerClassName: 'header', flex: 1},
    { field: 'currentTPEs', headerName: 'Current TPEs', headerClassName: 'header', flex: 1},
  ];
 
const testCaseColumns = [
    { field: 'id', headerName: 'id', headerClassName: 'header', flex: 1},
    { field: 'subject', headerName: 'Subject', headerClassName: 'header', flex: 1},
    { field: 'description', headerName: 'Description', headerClassName: 'header', sortable:false, flex: 2, minWidth: 200},
    { field: 'percentPassed', headerName: 'Percent Passed', headerClassName: 'header', flex: 1},
    { field: 'topology', headerName: 'Topology', headerClassName: 'header', flex: 1},
    { field: 'configs', headerName: 'Device Configs', headerClassName: 'header', flex: 1}
];

const testColumns = [
    { field: 'id', headerName: 'id', headerClassName: 'header', flex: 1},
    { field: 'subject', headerName: 'Subject', headerClassName: 'header', flex: 1},
    { field: 'description', headerName: 'Description', headerClassName: 'header', sortable:false, flex: 2, minWidth: 200},
    { field: 'resultStatus', headerName: 'Result Status', headerClassName: 'header', flex: 1},
];

const BOMColumns = [
    { field: 'id', headerName: 'ID', headerClassName: 'header', flex: 1},
    { field: 'deviceName', headerName: 'Device Name', headerClassName: 'header', flex: 1},
    { field: 'optional', headerName: 'Optional', headerClassName: 'header', flex: 1},
    { field: 'quantity', headerName: 'Quantity', headerClassName: 'header', flex: 1},
    { field: 'physicalOrSoftware', headerName: 'Physical/Software', headerClassName: 'header', flex: 1},
    { field: 'codeVer', headerName: 'Code Version', headerClassName: 'header', flex: 1},
    { field: 'SKU', headerName: 'SKU', headerClassName: 'header', flex: 1}];

const LibraryBOMColumns = [
    { field: 'id', headerName: 'ID', headerClassName: 'header', flex: 1},
    { field: 'deviceName', headerName: 'Device Name', headerClassName: 'header', flex: 1},
    { field: 'physicalOrSoftware', headerName: 'Physical/Software', headerClassName: 'header', flex: 1},
    { field: 'SKU', headerName: 'SKU', headerClassName: 'header', flex: 1}];


const resultColumns = [
    { field: 'id', headerName: 'id', headerClassName: 'header', flex: 1},
    { field: 'description', headerName: 'Description', headerClassName: 'header', sortable:false, flex: 2, minWidth: 200},
    { field: 'resultStatus', headerName: 'Result Status', headerClassName: 'header', flex: 1},
    { field: 'evidence', headerName: 'Evidence', headerClassName: 'header', flex: 1},
];


//   TODO: delete later (hardcoded rows)
// ---------------------------------------------------------------------------------------
const engagementRows = [
    {id: 1, name: 'Engagement 1', status: 'Pending', details: ' ', sysEng: 'John Rogers',	pocEng: 'Paul Switchport', customer: 'ABC Bus Company', sfdc: 'https://cradlepoint.lightning.force.com/lightning/r/Opportunity/0063800000qtILXAA2/view', dateCreated: '10/01/2021'},
    {id: 2, name: 'Engagement 2', status: 'Assigned', details: ' ', sysEng: 'Michael Smith', pocEng: 'George Packets', customer: 'Big Finance', sfdc: 'https://cradlepoint.lightning.force.com/lightning/r/Opportunity/0063800000qtILXAA2/view', dateCreated: '10/02/2021'},
    {id: 3, name: 'Engagement 3', status: 'POC testing complete', details: ' ', sysEng: 'Don Lee', pocEng: 'Ron State', customer: 'SensorCo', sfdc: 'https://cradlepoint.lightning.force.com/lightning/r/Opportunity/0063800000qtILXAA2/view', dateCreated: '10/03/2021'},
    {id: 4, name: 'Engagement 4', status: 'POC testing outcome', details: ' ', sysEng: 'Jim Black', pocEng: 'Jason Dumps', customer: 'Burgerz-R-us', sfdc: 'https://cradlepoint.lightning.force.com/lightning/r/Opportunity/0063800000qtILXAA2/view', dateCreated: '10/04/20201'},
    {id: 5, name: 'Engagement 5', status: 'POC approved', details: ' ', sysEng: 'Don Lee', pocEng: 'Paul Switchport', customer: 'SensorCo', sfdc: 'https://cradlepoint.lightning.force.com/lightning/r/Opportunity/0063800000qtILXAA2/view', dateCreated: '10/05/20201'},
    {id: 6, name: 'Engagement 6', status: 'Archieved', details: ' ', sysEng: 'Jim Black', pocEng: 'George Packets', customer: 'Burgerz-R-us', sfdc: 'https://cradlepoint.lightning.force.com/lightning/r/Opportunity/0063800000qtILXAA2/view', dateCreated: '10/06/20201'}
  ];

const testPlanRows = [
    {id: "1", subject: "subject", topology: "topology", description: "lorem ipsum dolores et", percentPassed: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
    {id: "2", subject: "subject", topology: "topology", description: "lorem ipsum dolores et", percentPassed: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
    {id: "3", subject: "subject", topology: "topology", description: "lorem ipsum dolores et", percentPassed: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
    {id: "4", subject: "subject", topology: "topology", description: "lorem ipsum dolores et", percentPassed: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
    {id: "5", subject: "subject", topology: "topology", description: "lorem ipsum dolores et", percentPassed: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
    {id: "6", subject: "subject", topology: "topology", description: "lorem ipsum dolores et", percentPassed: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
    {id: "7", subject: "subject", topology: "topology", description: "lorem ipsum dolores et", percentPassed: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
    {id: "8", subject: "subject", topology: "topology", description: "lorem ipsum dolores et", percentPassed: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
    {id: "9", subject: "subject", topology: "topology", description: "lorem ipsum dolores et", percentPassed: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
    {id: "10", subject: "subject", topology: "topology", description: "lorem ipsum dolores et", percentPassed: "95%", customerFeedback: "it's been great so far!", authors: "NW", version: "1.2", dateCreated: "05/11/2021", deviceConfigs: "some devices"},
]; 

const testCaseRows = [
    {id: 1, subject: 'Test case 1', description: 'This is a detail description of the test case', percentPassed:"10%"},
    {id: 2, subject: 'Test case 2', description: 'This is a detail description of the test case', percentPassed:"20%"},
    {id: 3, subject: 'Test case 3', description: 'This is a detail description of the test case', percentPassed:"30%"},
    {id: 4, subject: 'Test case 4', description: 'This is a detail description of the test case', percentPassed:"40%"},
    {id: 5, subject: 'Test case 5', description: 'This is a detail description of the test case', percentPassed:"50%"},
    {id: 6, subject: 'Test case 6', description: 'This is a detail description of the test case', percentPassed:"60%"},
    {id: 7, subject: 'Test case 7', description: 'This is a detail description of the test case', percentPassed:"70%"}
]; 

const testRows = [
    {id: 1, subject: 'Test 1', description: 'This is a detail description of the test', resultStatus: "Pass"},
    {id: 2, subject: 'Test 2', description: 'This is a detail description of the test', resultStatus: "Unknown"},
    {id: 3, subject: 'Test 3', description: 'This is a detail description of the test', resultStatus: "Fail"},
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

const resultRows = [
    {id: 1, subject: 'Result 1', description: 'This is a detail description of the result', resultStatus: "Pass", evidence: ""},
    {id: 2, subject: 'Result 2', description: 'This is a detail description of the result', resultStatus: "Unknown", evidence: ""},
    {id: 3, subject: 'Result 3', description: 'This is a detail description of the result', resultStatus: "Fail", evidence: ""},
];

export {engagementColumns, testPlanColumns, testCaseColumns, testColumns, BOMColumns, LibraryBOMColumns, resultColumns, 
    engagementRows, testPlanRows, testCaseRows, testRows, BOMRows, resultRows}
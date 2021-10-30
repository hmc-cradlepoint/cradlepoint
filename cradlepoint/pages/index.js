import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';

import PlainScreen from '../components/baseScreen/PlainScreen';
import SplitScreen from '../components/baseScreen/SplitScreen';
import CPButton from '../components/button/CPButton';

export default function Home() {
  const columnWButtons = [
    { field: 'device', headerName: 'Device', headerClassName: 'header', width: 200 },
    { field: 'qty', headerName: 'Quantity', headerClassName: 'header', width: 150 },
    { field: 'reqs', headerName: 'Requirements', headerClassName: 'header', width: 400, sortable:false},
    { field: 'hardware', headerName: 'Physical/Virtual', headerClassName: 'header', width: 200 },
    { 
      field: 'button', 
      headerName: 'Edit',
      headerClassName: 'header',
      width: 110,
      align: 'center',
      renderCell: () => (
        <CPButton text="EDIT"/>
      )
    }
  ];

  const columns = [
    { field: 'device', headerName: 'Device', headerClassName: 'header', width: 200 },
    { field: 'qty', headerName: 'Quantity', headerClassName: 'header', width: 150 },
    { field: 'reqs', headerName: 'Requirements', headerClassName: 'header', width: 400, sortable:false},
    { field: 'hardware', headerName: 'Physical/Virtual', headerClassName: 'header', width: 200 },
  ];

  const rows = [
    { id: 1, device: 'CR4250', qty: 3, reqs: "None", hardware: "Physical" },
    { id: 2, device: 'E300', qty: 2, reqs: "None", hardware: "Physical" },
    { id: 3, device: 'Switch', qty: 1, reqs: "None", hardware: "Physical" },
    { id: 4, device: 'PC for clients (if possible)', qty: 1, reqs: "None", hardware: "Virtual" },
    { id: 5, device: 'A120', qty: 1, reqs: "None", hardware: "Virtual" },
    { id: 6, device: 'B330', qty: 1, reqs: "None", hardware: "Virtual" },
  ];

  function customCheckbox() {
    return {
      '& .MuiCheckbox-root svg': {
        width: 14,
        height: 14,
        backgroundColor: 'transparent',
        border: `1px solid #d9d9d9`,
        borderRadius: 2,
      },
      '& .MuiCheckbox-root svg path': {
        display: 'none',
      },
      '& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
        backgroundColor: '#FCAC1C',
        borderColor: '#FCAC1C',
      },
      '& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after': {
        position: 'absolute',
        display: 'table',
        border: '2px solid #fff',
        borderTop: 0,
        borderLeft: 0,
        transform: 'rotate(40deg) translate(-50%,-50%)',
        transition: 'all .2s cubic-bezier(.12,.4,.29,1.46) .1s',
        opacity: 1,
        content: '""',
        top: '50%',
        left: '36%',
        width: 5,
        height: 10,
      },
      '& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after': {
        width: 12,
        height: 4,
        backgroundColor: '#FCAC1C',
        transform: 'none',
        top: '45%',
        left: '31%',
        border: 1,
        content: '-',
        borderColor: '#FCAC1C'
      },
    };
  }
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
      ... customCheckbox()
    },
  });

  const classes = useStyles();
  return (
    <>
      <PlainScreen>
        <CPButton text="I'm at Cradlepoint Button!"/>
      </PlainScreen>
      <SplitScreen
        leftSection={
          <h1>test</h1>
        }
        rightSection={
          <h1>test2</h1>
        }
      />
    <div className="container">
      <Head>
        <title>Cradlepoint POC Web App</title>
        <meta name="description" content="Home Screen of Web App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Example table w/ edit buttons - MUI/Data-Grid</h1>
      <div style={{ height: 400, width: '100%' }} className={classes.root}>
        <DataGrid
          rows={rows}
          columns={columnWButtons}
          pageSize={5}
          rowsPerPageOptions={[5]}
          
        />
      </div>

      <h1>Example table w/ pagination - MUI/Data-Grid</h1>
      <div style={{ height: 400, width: '100%' }} className={classes.root}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          
        />
      </div>

      <h1>Example table w/ checkbox - MUI/Data-Grid</h1>
      <div style={{ height: 400, width: '100%' }} className={classes.root}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          onSelectionModelChange={(id) => console.log(id)}
        />
      </div>

    </div>
    </>
  )
}

export async function getServerSideProps(context) {

  let isConnected;
  try {
    const client = await clientPromise
    isConnected = true;
  } catch(e) {
    console.log(e);
    isConnected = false;
  }

  return {
    props: { isConnected },
  }
}
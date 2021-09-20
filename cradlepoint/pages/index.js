import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function Home() {
  const columns = [
    { field: 'device', headerName: 'Device', width: 200 },
    { field: 'qty', headerName: 'Quantity', width: 150 },
    { field: 'reqs', headerName: 'Requirements', width: 400 },
    { field: 'hardware', headerName: 'Physical/Virtual', width: 200 },
  ];

  const rows = [
    { id: 1, device: 'CR4250', qty: 3, reqs: "", hardware: "Physical" },
    { id: 2, device: 'E300', qty: 2, reqs: "", hardware: "Physical" },
    { id: 3, device: 'Switch', qty: 1, reqs: "", hardware: "Physical" },
    { id: 4, device: 'PC for clients (if possible)', qty: 1, reqs: "", hardware: "Virtual" },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Cradlepoint POC Web App</title>
        <meta name="description" content="Home Screen of Web App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Example menu bar [WIP]</h1>
      <Stack direction="row" spacing={4} paddingBottom={1} borderBottom="1px solid">
        <Button>HOME</Button>
        <Button>TEST PLAN</Button>
        <Button>BILL OF MATERIALS</Button>
        <Button>REVIEW</Button>
      </Stack>

      <h1>Example buttons - MUI/Buttons</h1>
      <Stack direction="row" spacing={2}>
        {/* styles will be cleaned up in actual implementation */}
        <Button variant="contained" style={{ borderRadius: 5, paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }} >Submit</Button>
        <Button variant="contained" disabled style={{ borderRadius: 5, paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }} >Submit</Button>

        <Button variant="contained" style={{ borderRadius: 5, paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }} >Edit</Button>
        <Button variant="contained" disabled style={{ borderRadius: 5, paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }} >Edit</Button>
      </Stack>

      <h1>Example table w/ pagination - MUI/Data-Grid</h1>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
    </div>
  )
}

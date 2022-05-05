import React, { useState, useEffect } from 'react';
import PlainScreen from "../components/baseScreen/PlainScreen";
import { PlainTable } from "../components/tables/Table";
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import {LibraryBOMColumns } from '../util/tableColumns';
import styling from '../styles/tableStyling';
import DeviceModalForm from './DeviceModalForm';
import styles from '../styles/EngagementDetails.module.css';



export default function DeviceLibrary(props) {
    // Styling
    const useStyles = makeStyles({styling});
    const classes = useStyles();

    // controls create new modal flow
    const [deviceModalOpen, setDeviceModalOpen] = useState(false);

    return(
        <div>
            <DeviceModalForm
              isOpen={deviceModalOpen}
              onBack={()=> setDeviceModalOpen(false)}
            ></DeviceModalForm>
            
            <PlainScreen>
              <div className={styles.tableContainer} style={{paddingTop: 50}}>
                  <div className={styles.tableButtonRow}>
                      <h2>Device Library</h2>
                      <CPButton text="Add New"
                              onClick={() => {setDeviceModalOpen(true);}}
                      />
                  </div>
                  <PlainTable rows={props.devicesData} columns={LibraryBOMColumns} className={classes.root}/>
              </div>
            </PlainScreen>
      </div>
    )
}

import {getAllDevices} from "./api/getAllDevices";
/**
 * 
 * @param {*} context 
 * @returns props that includes all library devices
 */
export async function getServerSideProps() {
  try {
    // const res = await fetch(`${process.env.HOST}/api/getAllDevices`);
    const devicesData = await getAllDevices();
    return {
      props: {devicesData}, // will be passed to the page component as props
    }
  }
  catch(err) {
      throw err;
  }

} 

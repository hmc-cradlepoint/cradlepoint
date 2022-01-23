import React, { useState, useEffect } from 'react';
import PlainScreen from "../components/baseScreen/PlainScreen";
import { PlainTable } from "../components/tables/Table";
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import {LibraryBOMColumns } from '../util/tableColumns';
import SelectDeviceModal from './deviceModals/selectDevice';
import SelectQuantityModal from './deviceModals/selectQuantity';
import styling from '../styles/tableStyling';

export default function DeviceLibrary(props) {
    const useStyles = makeStyles(styling);
    const classes = useStyles();

    const LibraryBOMColumnsWithActions = LibraryBOMColumns.concat([
        { 
          field: 'button', 
          flex: 1,
          minWidth: 100,
          headerName: 'Actions',
          headerClassName: 'header',
          align: 'center',
          renderCell: () => (
            <CPButton text="DETAILS"/>
          )
        }
      ]);

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

    return(
        <div>
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

            <PlainScreen>
                <CPButton 
                  text="Add New Device"
                  onClick={() => {updateModal("select_device")}}
                />
                <PlainTable rows={props.devicesData} columns={LibraryBOMColumnsWithActions} className={classes.root}/>
            </PlainScreen>
      </div>
    )
}

export async function getServerSideProps(context) {
  try {
    const res = await fetch(`${process.env.HOST}/api/getAllDevices`);
    const devicesData = await res.json();
    return {
      props: {devicesData}, // will be passed to the page component as props
    }
  }
  catch(err) {
      throw err;
  }

} 

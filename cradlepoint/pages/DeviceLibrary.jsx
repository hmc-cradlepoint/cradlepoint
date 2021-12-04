import React, { useState, useEffect } from 'react';
import PlainScreen from "../components/baseScreen/PlainScreen";
import { PlainTable } from "../components/tables/Table";
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import { BOMRows, LibraryBOMColumns } from '../util/tableColumns';
import SelectDeviceModal from './deviceModals/selectDevice';
import SelectQuantityModal from './deviceModals/selectQuantity';


export default function DeviceLibrary(props) {
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
                <PlainTable rows={BOMRows} columns={LibraryBOMColumnsWithActions} className={classes.root}/>
            </PlainScreen>
      </div>
    )
}
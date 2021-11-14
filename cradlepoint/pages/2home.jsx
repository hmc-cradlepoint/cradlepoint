import React, { useState, useEffect } from 'react';
import PlainScreen from "../components/baseScreen/PlainScreen";
import { PlainTable } from "../components/tables/Table";
import { makeStyles } from '@mui/styles';
import CPButton from '../components/button/CPButton';
import CreateNewModal from './createNewModal';
import NewEngagModalInfo from './newEngagModalInfo';
import NewModalClone from './newModalClone';
import { engagementColumns, engagementRows } from '../util/tableColumns';

// TODO: adjust scaling and font of the page
export default function HomeScreen(props) {
    // TODO: have a consistent style for all the pages (delete later)
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

    const engagementColumnsWithActions = engagementColumns.concat([
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

    const [selectModalOpen, setSelectModalOpen] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [cloneModalOpen, setCloneModalOpen] = useState(false);
    const emptyRow = {name: '', details: ' ', sysEng: '',	pocEng: '', customer: '', sfdc: ''};
    const [selectedRow, setSelectedRow] = useState(emptyRow);   
  
    
    function updateModal(modalType,rowId=0){
      if (modalType === "select"){
        setSelectModalOpen(true)
      } else if (modalType === "scratch"){
        setSelectedRow(emptyRow);
        setInfoModalOpen(true)
      } else if (modalType === "clone"){
        setCloneModalOpen(true)
      } else if (modalType === "clone_selected"){
        setCloneModalOpen(false)
        setInfoModalOpen(true)
        const selectedRowData = (rows.filter((row) => rowId===row.id))[0];
        setSelectedRow(selectedRowData);
      }
      else {
        setSelectModalOpen(false)
        setInfoModalOpen(false)
        setCloneModalOpen(false)
      }
    }

    return(
        <PlainScreen>
            <CPButton 
              text="Create New Engagement"
              onClick={() => 
                {updateModal("select");
                console.log(selectModalOpen);
                }
              }
            />
            {/* TODO: get rows from database */}
            <PlainTable rows={engagementRows} columns={engagementColumnsWithActions} className={classes.root}/>
            <CreateNewModal
              type={"Engagement"}
              modalOpen={selectModalOpen} 
              onClickNext={updateModal}
              onClose={()=> setSelectModalOpen(false)}
            />

            <NewEngagModalInfo
              type={"Engagement"}
              modalOpen={infoModalOpen} 
              onBack={()=> setInfoModalOpen(false)}
              selectedRow={selectedRow}
              
              />

            <NewModalClone
              type={"Engagement"}
              modalOpen={cloneModalOpen} 
              onClickNext={updateModal}
              onBack={()=> setCloneModalOpen(false)}
            />

      </PlainScreen>
    )
}
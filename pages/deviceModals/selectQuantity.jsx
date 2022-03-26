import React, {useState} from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { makeStyles } from '@mui/styles';
import {PlainTable, CheckBoxTable} from "../../components/tables/Table"
import Checkbox from '@mui/material/Checkbox';
import { Field, Formik} from 'formik';
import { LibraryBOMColumns } from "../../util/tableColumns";
import styling from '../../styles/tableStyling';
import { useRouter } from 'next/router'
import { render } from "react-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// TODO: quantity should be casted to a number somewhere (if edited, it is now automatically a string)
export default function SelectQuantityModal(props) {
  const useStyles = makeStyles({styling});
  const classes = useStyles();
  const router = useRouter();
  
  function formatData(row){
    row["deviceId"] = row["_id"];
    if (props.editMode){
      let rowInfo = props.editData.filter((r) => r.deviceId.toString()==row.deviceId)[0];
      row["quantity"] = rowInfo.quantity;
      row["isOptional"] = rowInfo.isOptional;
    } else {
      row["quantity"] = 1;
      row["isOptional"] = false;
    } 
    return row
  }


  let data = [];
  if (props.selectedIDs !=undefined & props.libraryDevices !=undefined){
    let selectedRows = props.libraryDevices.filter((row) => props.selectedIDs.has(row._id.toString()));
    data = selectedRows.map(r => formatData(r));
  }
  
  console.log("data ", data);

  function handleCommit(e){
    const array = data.map(r => {
      if (r._id==e.id){
        return {...r,[e.field]: e.value};
      } else{
        return {... r};
      }
    })
    data = array;
    console.log(data);
  }

  async function handleSubmitData() {
    data = data.map(d => (({deviceId, quantity, isOptional}) => ({deviceId, quantity, isOptional}))(d));
  
    let newData = {
      "devices": data,
      "testCaseId": props.testCaseId
    }
  
    let endPoint = '/api/editDeviceInBOM';
    let method = 'PUT';

    if (!props.editMode){
      endPoint = '/api/addDeviceToBOM';
      method = 'POST';
    } 
    console.log(endPoint, method, newData)
    try{
      const res = await fetch(endPoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })
      console.log(res);
    } catch (err){
      console.log("Error:",err)
    }
    
    props.onClose();
    
  }

  const notify = () => toast.error("Quantity must be at least 1", {
                      position: "top-center",
                      autoClose: 7000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined});

  return (
    <>
      <Modal className={styles.Modal} isOpen={props.modalOpen}>
        {/* Pop-up that warns user */}
        <ToastContainer />
        <h2>Enter quantity (double click on cell) and check box if optional</h2>
        <PlainTable rows={data} 
        columns={LibraryBOMColumns.concat([
          { 
            field: 'quantity', 
            flex: 1,
            headerName: 'Quantity (double-click to edit)',
            headerClassName: 'header',
            align: 'center',
            editable: true,
            type: "number",
          },
          { 
            field: 'optional', 
            flex: 1,
            headerName: 'Optional?',
            headerClassName: 'header',
            align: 'center',
            renderCell: (e) => {
              return (
                  <Checkbox 
                  style={{color:'#FCAC1C'}}
                  onChange={() => handleCommit({"id":e.id, "field": "isOptional", "value": !e.row.isOptional})}
                  checked={data.filter(r => (r._id==e.id))[0]?.isOptional??false}
                  />
              )
            }
          },
        ])} 
        className={classes.root} 
        onCellEditCommit={(e) => {
          console.log(e.field, e.value);
          if (e.field==="quantity"){
            const hasError = e.value <= 0;
            if (hasError) { 
              notify(); 
            } else {
              handleCommit(e);
            }
          }
          
        }}
        />
        
        
        <CPButton text='Back' onClick={props.onBack}/>
        <CPButton text='Add' onClick={handleSubmitData}/>
      </Modal>
    </>
  );
}

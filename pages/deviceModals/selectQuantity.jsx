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
import { ObjectID } from "bson";


export default function SelectQuantityModal(props) {
  const useStyles = makeStyles({styling});
  const classes = useStyles();
  const router = useRouter();
  
  function formatData(id){
    // editing an existing item in the BOM
    if (props.editMode){
      // the id variable passed in is the item _id in the BOM
      // find the row from the current BOM; this row stores _id, deviceId, isOptional, and quantity
      let row = props.testCase.BOM.find((r) => r._id.toString() === id);
      // find details about the specific device using deviceId from the libraryDevices; this stores deviceName
      // deviceType, and SKU
      let infoRow = props.libraryDevices.find((r) => r._id === row.deviceId.toString());
      // combine row and info row and return
      row["deviceName"] = infoRow["deviceName"];
      row["deviceType"] = infoRow["deviceType"];
      row["SKU"] = infoRow["SKU"];
      
      return row;
    }

    // if we are adding a new item to the BOM
    // the id variable passsed in is the deviceId of the selected device
    // find details about the specific device using deviceId from the libraryDevice
    let selectedRow = props.libraryDevices.find((r) => id === r._id.toString());
    let newRow = (({deviceName, deviceType, SKU}) => ({deviceName, deviceType, SKU}))(selectedRow);
    newRow["deviceId"] = selectedRow["_id"];
    newRow["_id"] = ObjectID().toString();
    // initialize quantity as 1 and isOptional as false
    newRow["quantity"] = 1;
    newRow["isOptional"] = false;
    
    return newRow;
  }



  let data = [];
  if (props.selectedIDs !=undefined & props.libraryDevices !=undefined){
      data = Array.from(props.selectedIDs).map(id => formatData(id));
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
    data = data.map(d => (({_id, deviceId, quantity, isOptional}) => ({_id, deviceId, quantity, isOptional}))(d));
  
    let newData = {
      "devices": data,
      "testCaseId": props.testCase._id,
      // passed in to update summaryBOM
      "testPlanId": props.testCase.testPlanId
    }
  
    let endPoint = '/api/editDeviceInBOM';
    let method = 'PUT';

    if (!props.editMode){
      endPoint = '/api/addDeviceToBOM';
      method = 'POST';
    } 
 
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
        <h2> Double click to edit quantity and check box if optional</h2>
        <PlainTable rows={data} 
        getRowId={(row) => row._id}
        columns={LibraryBOMColumns.concat([
          { 
            field: 'quantity', 
            flex: 1,
            headerName: 'Quantity',
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

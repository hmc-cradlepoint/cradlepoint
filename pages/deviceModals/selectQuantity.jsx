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

export default function SelectQuantityModal(props) {
  console.log(props)
  const useStyles = makeStyles(styling);
  const classes = useStyles();
  const router = useRouter();
  console.log("testCaseId", props.testCaseId)
  function initializeData(){
    let tempData = [];
    for (let i = 0; i<props.selectedRows.length;i++){
      let row = props.selectedRows[i];
      row["quantity"] = 1;
      row["isOptional"] = false;
      row["deviceId"] = row["_id"];
      tempData.push(row);
      // console.log("initialData", initialData)
    }
    return tempData;
  }
  
  let data = initializeData();
  
  function handleCommit(e){
    // TODO: need to error check that input is an integer greater than 0
    const array = data.map(r => {
      if (r._id===e.id){
        return {...r,[e.field]: e.value};
      } else{
        return {... r};
      }
    })
    data = array;
  }

  // TODO: should check for if device is already in BOM in 
  async function handleSubmitData() {
    data = data.map(d => (({deviceId, quantity, isOptional}) => ({deviceId, quantity, isOptional}))(d));
  
    let newData = {
      "devices": data,
      "testCaseId": props.testCaseId
    }
  
    try{
      const res = await fetch('/api/addDeviceToBOM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })
    } catch (err){
      console.log("Error:",err)
    }
    // props.onBack();
    
  }


  return (
    <>
      <Modal className={styles.Modal} isOpen={props.modalOpen}>
        <h2>Enter quantity for each device and whether they are optional</h2>
        {/* <PlainTable rows={props.selectedRows} columns={BOMColumnsWithFields} className={classes.root} /> */}
        <PlainTable rows={data} 
        columns={LibraryBOMColumns.concat([
          { 
            field: 'quantity', 
            flex: 1,
            headerName: 'Quantity (double-click to edit)',
            headerClassName: 'header',
            align: 'center',
            editable: true,

          },
          // TODO: to be implemented
          // { 
          //   field: 'optional', 
          //   flex: 1,
          //   headerName: 'Optional?',
          //   headerClassName: 'editableHeader',
          //   align: 'center',
          //   renderCell: (e) => {
          //     return (
          //         <Checkbox 
          //         style={{color:'#FCAC1C'}}
          //         onChange={handleCommit}
          //         />
          //     )
          //   }
          // },
        ])} 
        className={classes.root} 
        onCellEditCommit={handleCommit}
        />
        
        
        <CPButton text='Back' onClick={props.onBack}/>
        <CPButton text='Add' onClick={handleSubmitData}/>
      </Modal>
    </>
  );
}

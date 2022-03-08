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
  console.log("initialData", props.selectedRows);

  function initializeData(){
    let tempData = [];
    for (let i = 0; i<props.selectedRows.length;i++){
      let row = props.selectedRows[i];
      row["quantity"] = 1;
      row["optional"] = false;
      tempData.push(row);
      // console.log("initialData", initialData)
    }
    console.log("initializeData")
    return tempData;
  }
  
  let data = initializeData();
  
  console.log("data", data)
  function handleCommit(e){
    // TODO: need to error check that input is an integer greater than 0
    console.log("handle commit")
    console.log(e);
    const array = data.map(r => {
      if (r._id===e.id){
        return {...r,[e.field]: e.value};
      } else{
        return {... r};
      }
    })
    data = array;
    console.log("new data", data)
  }

  async function handleSubmitData() {
    for (let i =0; i<data.length; i++){
      try{
        // TODO: make add new device to a BOM api endpoint
        const res = await fetch('/api/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data[i]),
        })
      } catch (err){
        console.log("Error:",err)
      }
    }
    
    props.onBack();
    
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

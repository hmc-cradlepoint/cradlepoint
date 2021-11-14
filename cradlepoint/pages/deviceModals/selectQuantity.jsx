import React from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { makeStyles } from '@mui/styles';
import {PlainTable, CheckBoxTable} from "../../components/tables/Table"
import Checkbox from '@mui/material/Checkbox';
import { pink } from '@mui/material/colors';

import { Field, Formik} from 'formik';

export default function SelectQuantity(props) {
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

const deviceColumns = [
    { field: 'id', headerName: 'id', headerClassName: 'header', flex: 1, hide: true},
    { field: 'deivceName', headerName: 'Device Name', headerClassName: 'header', flex: 1},
    { field: 'physical', headerName: 'Physical', headerClassName: 'header', flex: 1},
    { field: 'sku', headerName: 'SKU', headerClassName: 'header', flex: 1},
    { 
      field: 'quantity', 
      flex: 1,
      headerName: 'Quantity',
      headerClassName: 'header',
      align: 'center',
      renderCell: () => {
          return (
              <Formik>
                  <Field name={'codeVersion'} value={1}/>
              </Formik>
          )
      }
    },
    { 
        field: 'codeVersion', 
        flex: 1,
        headerName: 'Code Version',
        headerClassName: 'header',
        align: 'center',
        renderCell: () => {
            return (
                <Formik>
                    <Field name={'codeVersion'} value={1}/>
                </Formik>
            )
        }
    },
    { 
        field: 'optional', 
        flex: 1,
        headerName: 'Optional?',
        headerClassName: 'header',
        align: 'center',
        renderCell: () => {
            return (
                <Checkbox 
                defaultChecked
                style={{color:'#FCAC1C'}}
                />
            )
        }
    }
  ];


    // TODO: make rows not hard coded (delete later)
    const rows = [
        {id: 1, deivceName: 'Device 1', sku: 'this is the sku'},
        {id: 2, deivceName: 'Device 2', sku: 'this is the sku'},
        {id: 3, deivceName: 'Device 3', sku: 'this is the sku'},
        {id: 4, deivceName: 'Device 4', sku: 'this is the sku'},
        {id: 5, deivceName: 'Device 5', sku: 'this is the sku'},
        {id: 6, deivceName: 'Device 6', sku: 'this is the sku'}
    ]

  return (
    <>
      <Modal className={styles.Modal} isOpen={props.modalOpen}>
        <h2>Add new device(s) to the summary BOM</h2>
        <PlainTable rows={rows} columns={deviceColumns} className={classes.root} 
        />
        <CPButton text='Back' onClick={props.onBack}/>
        <CPButton text='Add' />
      </Modal>
    </>
  );
}

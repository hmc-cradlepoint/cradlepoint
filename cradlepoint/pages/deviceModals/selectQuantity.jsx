import React from "react";
import Modal from 'react-modal';
import CPButton from "../../components/button/CPButton";
import styles from '../../styles/Modal.module.css'
import { makeStyles } from '@mui/styles';
import {PlainTable, CheckBoxTable} from "../../components/tables/Table"
import Checkbox from '@mui/material/Checkbox';
import { pink } from '@mui/material/colors';

import { Field, Formik} from 'formik';
import { BOMColumns, BOMRows, LibraryBOMColumns } from "../../util/tableColumns";

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

const BOMColumnsWithFields = LibraryBOMColumns.concat([
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
    }]);



  return (
    <>
      <Modal className={styles.Modal} isOpen={props.modalOpen}>
        <h2>Add new device(s) to the summary BOM</h2>
        <PlainTable rows={BOMRows} columns={BOMColumnsWithFields} className={classes.root} 
        />
        <CPButton text='Back' onClick={props.onBack}/>
        <CPButton text='Add' />
      </Modal>
    </>
  );
}

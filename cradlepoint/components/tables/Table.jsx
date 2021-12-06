// Table w/ buttons
// Table select 1
// Table select multiple
// Table display only
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import React from 'react';



// display only
function PlainTable(props) {
    return (
        <div style={{ height: props.height ? props.height : 400, width: '100%' }} className={props.className}>
            <DataGrid
              rows={props.rows}
              columns={props.columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              onSelectionModelChange={props.onSelectionModelChange}
              getRowId = {props.getRowId}
            />
        </div>
    )

}

PlainTable.defaultProps = {
  getRowId: (row) => row._id
}

// select multiple
function CheckBoxTable(props) {
    return(
      <div style={{ height: 400, width: '100%' }} className={props.className}>
        <DataGrid
          rows={props.rows}
          columns={props.columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          onSelectionModelChange={props.onSelectionModelChange}
        />
      </div>
    )
}

export {PlainTable, CheckBoxTable}



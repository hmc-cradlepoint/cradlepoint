// Table w/ buttons
// Table select 1
// Table select multiple
// Table display only
import { DataGrid} from '@mui/x-data-grid';
import { makeStyles, styled } from '@mui/styles';
import React from 'react';
import { customCheckbox } from '../../styles/tableStyling';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .header': {
    backgroundColor: '#FCAC1C',
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'None'
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    borderRight: `2px solid #f0f0f0`,
  },
  ...customCheckbox,
}));


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
              onCellEditCommit = {props.onCellEditCommit}
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
        <StyledDataGrid
          rows={props.rows}
          columns={props.columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection={true}
          onSelectionModelChange={props.onSelectionModelChange}
          getRowId = {(row) => row._id}
        />
      </div>
    )
}

export {PlainTable, CheckBoxTable}








  



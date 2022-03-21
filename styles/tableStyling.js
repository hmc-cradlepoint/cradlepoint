
const customCheckbox = {
  '& .MuiCheckbox-root svg': {
    width: 30,
    height: 30,
    backgroundColor: 'transparent',
    border: `1px solid #d9d9d9`,
    borderRadius: 2,
  },
  '& .MuiCheckbox-root svg path': {
    display: 'none',
  },
  '& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
    backgroundColor: '#FCAC1C',
    borderColor: '#FCAC1C',
  },
  '& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after': {
    position: 'absolute',
    display: 'table',
    border: '3px solid #fff',
    borderTop: 0,
    borderLeft: 0,
    transform: 'rotate(40deg) translate(-50%,-50%)',
    transition: 'all .2s cubic-bezier(.12,.4,.29,1.46) .1s',
    opacity: 1,
    content: '""',
    top: '50%',
    left: '36%',
    width: 8,
    height: 20,
  },
  '& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after': {
    width: 20,
    height: 4,
    backgroundColor: '#FCAC1C',
    transform: 'none',
    top: '45%',
    left: '29%',
    border: 1,
    content: '-',
    borderColor: '#FCAC1C'
  }
}

const styling = {
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
};

export {styling, customCheckbox};

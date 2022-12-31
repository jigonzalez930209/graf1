import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { GrafContext } from '../../context/GraftContext';
import { Box } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Grid } from '@mui/material';

const options = [
  'xaxis',
  'yaxis',
  'yaxis2',
  'null',
];

const ITEM_HEIGHT = 48;

type LongMenuProp = {
  onSelect: ({ value, id }: { value: "xaxis" | "yaxis" | "yaxis2" | "null", id: number }) => void
  id: number
  selectedAxis: "xaxis" | "yaxis" | "yaxis2" | null
}


export const LongMenu = ({ onSelect, id, selectedAxis }: LongMenuProp) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value: "xaxis" | "yaxis" | "yaxis2" | 'null') => {
    setAnchorEl(null);
    onSelect({ value: value === 'null' ? null : value, id })
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ transform: 'scale(0.5)' }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} selected={option === (selectedAxis === null ? 'null' : selectedAxis)} onClick={() => handleSelect(option as "xaxis" | "yaxis" | "yaxis2" | 'null')}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

type ColumnsDialogProp = {
  open: boolean,
  setOpen: (open: boolean) => void
}

const ColumnsDialog = ({ open, setOpen }: ColumnsDialogProp) => {
  const { graftState: { columns }, setSelectedColumns } = React.useContext(GrafContext)

  console.log(columns)

  const handleChangeColumnAxis = ({ id, value }: { id: number, value: "xaxis" | "yaxis" | "yaxis2" }) => {
    console.log(id, value)

    setSelectedColumns({
      ...columns,
      columns: columns.columns.map(
        column =>
        ({
          ...column,
          axis: column.index === id ? value : column.axis,
          selected: column.index === id ? true : column.selected
        }))
    })
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleApply = () => {
    setOpen(false);
    setSelectedColumns(columns)
  }

  return (
    <Dialog
      open={open}
      maxWidth='lg'
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Select a axis to each column of the file or leave it blank
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} columns={6}>
          {columns.columns.map((column, index) => (
            <Grid xs={2} item key={`${column.name}-${index}`} sx={{ display: 'flex', justifyContent: 'start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {column.name}
              </Box>
              <LongMenu onSelect={handleChangeColumnAxis} id={column.index} selectedAxis={column.axis} />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleApply} autoFocus>
          Apply
        </Button>
      </DialogActions>
    </Dialog >
  );
}

export default ColumnsDialog;
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

import Tooltip from './Tooltip';
import { useData } from '../../hooks/useData';
import { ProcessFile } from '../../interfaces/interfaces';
import ColumnsDialog from './ColumnsDialog';

const FileList = ({ files }: { files: ProcessFile[] }) => {
  const { changeSelectedFile } = useData()
  const [modalOpen, setModalOpen] = React.useState(false);


  const handleSelect = (id: number) => {
    changeSelectedFile(id)
    if (files.find(file => file.id === id).type === 'csv') {
      setModalOpen(true)
    }
  }

  return (files && files.length > 0) && (<>
    {modalOpen && <ColumnsDialog open={modalOpen} setOpen={setModalOpen} />}
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {files?.map(file => {
        const labelId = `checkbox-list-label-${file.name}`;
        return (
          <ListItem
            key={file.id}
            disablePadding
          >
            <Tooltip file={file}>
              <ListItemButton role={undefined} onClick={() => handleSelect(file.id)} dense>
                <Checkbox
                  edge="start"
                  checked={file.selected}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
                <ListItemText id={labelId} style={{ fontSize: 10, margin: 0, padding: 0 }} primary={file.name} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        );
      })}
    </List>
  </>);
}
export default FileList
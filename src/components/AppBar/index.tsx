import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ClearIcon from '@mui/icons-material/Clear';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CssBaseline, Divider, Drawer } from '@mui/material';

import FileList from '../FileList'
import { useData } from '../../hooks/useData';
import ExportModal from '../ExportModal';
import GraftHandlerPopper from '../GraftHandlerPopper';
import { GrafContext } from '../../context/GraftContext';
import Logs from '../LogsComponent';
import { ProcessFile } from '../../interfaces/interfaces';

const drawerWidth = 240;
type BarProps = {
  files: ProcessFile[]
  content: JSX.Element
  readAllFiles: () => void
}

function style(color) {
  return {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color
  };
}

const Bar: React.FC<BarProps> = ({ files, content, readAllFiles }) => {
  const { cleanData } = useData()
  const [open, setOpen] = React.useState(false)
  const { graftState: { drawerOpen }, setDrawerOpen } = React.useContext(GrafContext)
  const [logsDrawerOpen, setLogsDrawerOpen] = React.useState(false)

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <ExportModal open={open} onClose={() => setOpen(false)} />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton
            onClick={() => setDrawerOpen(!drawerOpen)}
            color="inherit"
            edge="start"
          >
            {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Graf 0.001!!
          </Typography>
          <Box sx={{ alignSelf: 'center', justifySelf: 'end' }}>
            <IconButton
              size="large"
              color="inherit"
              sx={{ marginRight: 2 }}
              onClick={readAllFiles}
            >
              <CloudUploadIcon />
            </IconButton>
            <IconButton
              size="large"
              sx={{ marginRight: 2 }}
              color={files?.length > 0 ? 'inherit' : 'error'}
              disabled={files?.length < 1}
              onClick={() => setOpen(true)}
            >
              <CloudDownloadIcon />
            </IconButton>
            <IconButton
              size="large"
              color={files?.length > 0 ? 'inherit' : 'error'}
              disabled={files?.length < 1}
              onClick={() => cleanData()}
            >
              <ClearIcon />
            </IconButton>
            <GraftHandlerPopper />

          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          ...(drawerOpen ? { display: 'block' } : { display: 'none' }),
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Divider />
        <Box>
          <FileList files={files} />
          <Divider />
          <IconButton
            onClick={() => setLogsDrawerOpen(!logsDrawerOpen)}
            color="inherit"
            edge="start"
            sx={{
              position: 'absolute',
              bottom: logsDrawerOpen ? drawerWidth - 10 : 10,
              left: drawerWidth * .8,
              zIndex: 5000,
              transform: 'scale(0.8)',
              backgroundColor: 'grey.300',
            }}
          >
            {logsDrawerOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
          </IconButton>
          <Drawer
            variant="persistent"
            anchor='bottom'
            open={logsDrawerOpen}
            sx={{
              width: drawerWidth,
              height: drawerWidth,

              flexShrink: 0,
              ...(logsDrawerOpen ? { display: 'block' } : { display: 'none' }),
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box',
                overflow: 'hidden',
                height: drawerWidth,
                backgroundColor: 'grey.800'
              },
            }}
          >
            <Logs />
          </Drawer>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        {content}
      </Box>
    </Box>
  );
}

export default Bar

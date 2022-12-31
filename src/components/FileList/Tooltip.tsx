import { Typography, Tooltip as MUITooltip } from '@mui/material';
import Select from '@mui/material/Select';
import { Box } from '@mui/system';
import * as React from 'react';
import { ProcessFile } from '../../interfaces/interfaces';


const Tooltip = ({ children, file }: { children: JSX.Element, file: ProcessFile }) => {

  return (
    <MUITooltip
      placement="right"
      arrow
      title={
        <Box sx={{ transform: 'scale(0.8)' }}>
          {file.type === 'teq4' && (
            <React.Fragment>
              <Typography variant='h6'>Cyclic voltametry</Typography>
              <p>Cycles: {file.voltammeter?.cicles}</p>
              <p>Samples by second: {file.voltammeter?.samplesSec} samples/s</p>
              <p>Total Time: {file.voltammeter?.totalTime} s</p>
              <p>Total Points: {file.content?.length}</p>
            </React.Fragment>
          )} {file.type === 'teq4Z' && (
            <React.Fragment>
              <Typography variant='h6'>Impedance</Typography>
              <p>Voltage: {file.impedance?.V} V</p>
              <p>Sinusoidal Amplitude: {file.impedance?.signalAmplitude} V</p>
              <p>Initial Frequency: {file.impedance?.sFrequency} Hz</p>
              <p>End Frequency: {file.impedance?.eFrequency} Hz</p>
              <p>Total Points: {file.impedance?.totalPoints}</p>
            </React.Fragment>
          )}
          {file.type === 'csv' && (
            <React.Fragment>
              <Typography variant='h6'>CSV</Typography>
              <p>Columns: {file.content?.length}</p>
              <p>Rows: {file.content?.[0]?.length}</p>
            </React.Fragment>
          )}
        </Box>
      }
    >
      {children}
    </MUITooltip>
  )
}

export default Tooltip;
import * as React from 'react';

import { GrafContext } from './GraftContext';
import { IGraftState, INotification, IFileType, IGrafType, IGraftImpedanceType, IStepBetweenPoints, columns } from '../interfaces/interfaces';
import { graftReducer } from './graftReducer';
import useLocalStorage from '../hooks/useLocalStorage';

const INITIAL_STATE: IGraftState = {
  notifications: {
    content: [''],
    title: '',
    type: null
  },
  state: {},
  fileType: null,
  loading: false,
  graftType: 'scatter',
  impedanceType: 'Nyquist',
  stepBetweenPoints: 30,
  drawerOpen: false,
  columns: null,
}

interface props {
  children: JSX.Element | JSX.Element[]
}

export const GraftProvider = ({ children }: props) => {

  const [data] = useLocalStorage('files', null)

  const [graftState, dispatch] = React.useReducer(graftReducer, INITIAL_STATE);

  const setNotification = (notification: INotification) =>
    dispatch({ type: 'setNotification', payload: notification })

  const setSelectedFile = (selectedFileType: IFileType) => dispatch({ type: 'setFileType', payload: selectedFileType })

  const setLoading = (loading: boolean) => dispatch({ type: 'setLoading', payload: loading })

  const setGraftType = (type: IGrafType) => dispatch({ type: 'setGraftType', payload: type })

  const setImpedanceType = (type: IGraftImpedanceType) => dispatch({ type: 'setImpedanceType', payload: type })

  const setStepBetweenPoints = (step: IStepBetweenPoints) => dispatch({ type: 'setStepBetweenPoints', payload: step })

  const setDrawerOpen = (open: boolean) => dispatch({ type: 'setDrawerOpen', payload: open })

  const setSelectedColumns = (columns: columns) => dispatch({ type: 'setSelectedColumns', payload: columns })

  React.useEffect(() => {
    if (data?.find(file => file.selected)?.type) {
      setSelectedFile(data.find(file => file.selected).type)
    }
  }, [])

  return (
    <GrafContext.Provider value={{
      graftState,
      setNotification,
      setSelectedFile,
      setLoading,
      setGraftType,
      setImpedanceType,
      setStepBetweenPoints,
      setDrawerOpen,
      setSelectedColumns,
    }}>
      {children}
    </GrafContext.Provider>
  )
}
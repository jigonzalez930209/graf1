import * as React from 'react'
import _ from 'lodash'

import useLocalStorage from './useLocalStorage'
import { GrafContext } from '../context/GraftContext'
import { IStepBetweenPoints, ProcessFile } from '../interfaces/interfaces'


export const useData = () => {

  const [data, setData] = useLocalStorage<ProcessFile[]>('files', null)
  const { graftState: { fileType }, setSelectedFile, setSelectedColumns: setColumns } = React.useContext(GrafContext)

  const updateData = (payload: ProcessFile[]) => {
    if (payload?.length > 0) {
      setData(payload)
    } else {
      setData([])
    }
  };

  const changeSelectedFile = (id: number) => {
    const file = data.find((file) => file.id === id)
    if (file.type === fileType && file.type !== 'csv') {

      setData(prev => prev.map(file => file.id === id ? { ...file, selected: !file.selected } : file))
    } else {
      setSelectedFile(file.type)
      setData(prev => prev.map(file => ({ ...file, selected: file.id === id })))
      setColumns(
        {
          id: file.id,
          fileName: file.name,
          columns: file.csv.columns.map((name, index) => ({
            name: name,
            index: index,
            selected: false,
            axis: null,
          }))
        }
      )
    }
  }

  const getImpedanceData = () => {
    if (data === null) {
      return [];
    }

    return data.filter(file => file.selected).map((file) => (
      {
        ...file,
        content: file.content.map((c) => ([
          parseFloat(c[2]) * Math.cos(parseFloat(c[3]) * Math.PI / 180),
          -parseFloat(c[2]) * Math.sin(parseFloat(c[3]) * Math.PI / 180)
        ])
        )
      }))
  }

  const getModuleFase = () => {
    if (data === null) {
      return null;
    }
    const impedanceData = data.filter(file => file.selected).map((file) => ({
      ...file,
      content: file.content.map((c, i) => (
        {
          module: {
            x: Math.log10(parseFloat(c[1])),
            y: parseFloat(c[2])
          },
          fase: {
            x: Math.log10(parseFloat(c[1])),
            y: -parseFloat(c[3])
          }
        }
      ))
    }))

    return impedanceData
  }

  const calculateColumn = (key: string, value: string[], isImpedance: boolean = true) => {
    const calculate = {
      Time: isImpedance ? parseFloat(value[0]) : value[2],
      Frequency: parseFloat(value[1]),
      Module: parseFloat(value[2]),
      Fase: parseFloat(value[3]),
      ZR: parseFloat(value[2]) * Math.cos(parseFloat(value[3]) * Math.PI / 180),
      ZI: -parseFloat(value[2]) * Math.sin(parseFloat(value[3]) * Math.PI / 180),
      name: '',
      Voltage: value[0],
      Current: value[1],
    }

    return calculate[key]
  }

  const exportImpedanceDataToExcel = (columns: string[]) => {
    if (columns.length > 0) {
      return data?.filter(f => f.selected).map((file, i) => {
        return {
          name: file.name,
          value: file.content.map(c => columns.reduce((acc, curr) => ({ ...acc, [`${curr} (${i + 1})`]: calculateColumn(curr, c) }), {})),
        }
      })
    }
    else {
      return []
    }
  }

  const exportVoltammeterDataToExcel = (columns: string[]) => {
    if (columns.length > 0) {
      return data?.filter(f => f.selected).map((file, i) => {
        return {
          name: file.name,
          value: file.content.map((c, j) => columns.reduce((acc, curr) => ({
            ...acc, [`${curr} (${i + 1})`]: calculateColumn(curr, [...c, ((file.voltammeter.totalTime * 1000 / file.pointNumber) * j).toString()], false)
          }), {})),
        }
      })
    }
    else {
      return []
    }
  }


  const cleanData = () => setData(null)

  const getVCData = (stepBetweens: IStepBetweenPoints) => {
    if (data === null) {
      return [];
    }
    return data.map(file => ({ ...file, content: _.dropRight(file.content) })).filter(file => file.selected).map((file) => (
      {
        ...file,
        content: file.content.filter((c, i) => i % stepBetweens === 0).map((c) => [c[0], c[1]])
      }))
  }

  const getZIZRvsFrequency = () => {
    if (data === null) {
      return [];
    }
    return data.filter(file => file.selected).map((file) => ({
      ...file,
      content: file.content.map((c, i) => (
        {
          Zi: {
            x: Math.log10(parseFloat(c[1])),
            y: -parseFloat(c[2]) * Math.sin(parseFloat(c[3]) * Math.PI / 180)
          },
          Zr: {
            x: Math.log10(parseFloat(c[1])),
            y: parseFloat(c[2]) * Math.cos(parseFloat(c[3]) * Math.PI / 180)
          }
        }
      ))
    }))

  }

  const getCSVData = (columns: { name: string, axis: string }[]) => {
    if (data === null) {
      return [];
    }
    const csvData = data.filter(file => file.selected).find((file) => file.type === 'csv')
    const selectedColumns = csvData.csv.columns.reduce((acc, curr, i) =>
    ({
      ...acc, ...(columns.find(({ name }) => name === curr)?.name ?
        { [curr]: { name: curr, index: i, selected: true, axis: columns.find(({ name }) => name === curr).axis } } :
        { [curr]: { name: curr, index: i, selected: false, axis: columns.find(({ name }) => name === curr).axis } }
      )
    }), {}
    )
    return {
      ...csvData,
      content: csvData.content.map((c) => columns.reduce((acc, curr) => ({ ...acc, [curr.name]: c[selectedColumns[curr.name].index] }), {}))
    }

  }

  return {
    data,
    updateData,
    cleanData,
    changeSelectedFile,
    getImpedanceData,
    getModuleFase,
    exportImpedanceDataToExcel,
    getVCData,
    getZIZRvsFrequency,
    getCSVData,
    exportVoltammeterDataToExcel
  };
};
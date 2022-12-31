import * as React from 'react'
import Plotly from 'react-plotly.js';
import { GrafContext } from '../../context/GraftContext';
import usePlotlyOptions from '../../hooks/usePlotlyOptions';


const PlotlyChart = () => {
  const { data, layout, config } = usePlotlyOptions()
  const { graftState: { fileType } } = React.useContext(GrafContext)
  const [zoomState, setZoomState] = React.useState<{ xRange: number[], yRange: number[], y1Range?: number[] }>(null)

  React.useEffect(() => {
    setZoomState(null)
  }, [fileType])

  return (
    <Plotly
      data={data}
      layout={{
        ...layout,
        xaxis: { ...layout?.xaxis, range: zoomState?.xRange },
        yaxis: { ...layout?.yaxis, range: zoomState?.yRange },
        ...(layout?.yaxis2 && { yaxis2: { ...layout?.yaxis2, range: zoomState?.y1Range } })
      }}
      config={config}
      onRelayout={(e) => {
        if (typeof e['xaxis.range[0]'] === 'number') {
          setZoomState({
            xRange: [e['xaxis.range[0]'], e['xaxis.range[1]']],
            yRange: [e['yaxis.range[0]'], e['yaxis.range[1]']],
            ...(e['yaxis2.range[0]'] && { y1Range: [e['yaxis2.range[0]'], e['yaxis2.range[1]']] })
          })
        } else {
          setZoomState(null)
        }
      }}
    />
  );
}

export default PlotlyChart;
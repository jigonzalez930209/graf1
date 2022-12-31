import React from 'react'
import { Hook, Console, Decode } from 'console-feed'
import _ from 'lodash'

const Logs = () => {
  const [logs, setLogs] = React.useState([])

  React.useEffect(() => {
    Hook(window.console, (log) => {
      setLogs((logs) => {
        let allLogs = [...logs, Decode(log)]
        if (allLogs.length > 200) {
          allLogs = _.slice(allLogs, allLogs.length - 200)
        }
        return _.reverse(allLogs)
      })
    })
  }, [])

  return (
    <div style={{ height: 40 * logs.length / 1.9, minHeight: 230, overflow: 'auto' }}>
      <Console logs={logs} variant='dark' />
    </div>
  )
}

export default Logs
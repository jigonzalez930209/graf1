import * as React from 'react';
import { ProcessFile } from '../../interfaces/interfaces';


import Table from '../Table';


type FileContentProp = {
  file: ProcessFile
}

const FileContent: React.FC<FileContentProp> = ({ file }) => {

  return (
    <Table header={['t (s)', 'frequency', 'module ', 'face']} data={file.content} />
  )
}

export default FileContent
import { writeTextFile, readBinaryFile } from "@tauri-apps/api/fs";
import { open } from '@tauri-apps/api/dialog';
import _ from 'lodash'

import { File, Files, ProcessFile } from "../hooks/useData";

function download(strData, strFileName, strMimeType) {
  var D = document,
    A = arguments,
    a = D.createElement("a"),
    d = A[0],
    n = A[1],
    t = A[2] || "text/plain";

  //build download link:
  a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);

  if ('download' in a) { //FF20, CH19
    a.setAttribute("download", n);
    a.innerHTML = "downloading...";
    D.body.appendChild(a);
    setTimeout(function () {
      var e = D.createEvent("MouseEvents");
      e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
      D.body.removeChild(a);
    }, 66);
    return true;
  }; /* end if('download' in a) */

  //do iframe dataURL download: (older W3)
  var f = D.createElement("iframe");
  D.body.appendChild(f);
  f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
  setTimeout(function () {
    D.body.removeChild(f);
  }, 333);
  return true;
}

const fileType = (fileName: string): string => {
  const fileNameParts: String[] = fileName.split('.')
  const fileExtension = fileNameParts[fileNameParts.length - 1]

  if (fileExtension === 'teq4Z') {
    return 'teq4Z'
  } else if (fileExtension === 'teq4') {
    return 'teq4'
  } else return null
}


const extractSerialPoint = (files: File[]): ProcessFile[] => {
  let processFile: ProcessFile[] = []

  for (let i = 0; i < files.length; i++) {
    const element = files[i]
    if (fileType(element.name) === 'teq4Z') {
      const arrayFile = files[i].content.split(/(?:\r\n|\r|\n)/g)
      const pointNumber = parseInt(arrayFile[105])
      const data = _.slice(arrayFile, 146, 146 + pointNumber)
      const dataPoint: string[][] = data.map((line) => line.split(','))
      const impedance: ProcessFile['impedance'] = {
        V: parseFloat(arrayFile[10].split(',')[1]),
        signalAmplitude: parseFloat(arrayFile[113].split(',')[0]),
        sFrequency: parseFloat(arrayFile[103].split(',')[0]),
        eFrequency: parseFloat(arrayFile[104].split(',')[0]),
        totalPoints: parseInt(arrayFile[105].split(',')[0]),
      }
      processFile.push({
        id: i,
        type: 'teq4Z',
        name: element.name,
        pointNumber, content:
          dataPoint,
        selected: i === 0,
        impedance: impedance
      })
    } else if (fileType(element.name) === 'teq4') {
      const arrayFile = files[i].content.split(/(?:\r\n|\r|\n)/g)
      const countX = parseInt(arrayFile[23].split(',')[1])
      const countY = parseInt(arrayFile[24].split(',')[1])
      const dataX = _.slice(arrayFile, 146, 146 + countX)
      const dataY = _.slice(arrayFile, 146 + countX, 146 + countX + countY)
      const dataPoint: string[][] = dataX.map((x, index) => [x, dataY[index]])
      const samplesSec = parseInt(arrayFile[27].split(',')[1])
      const range = parseInt(arrayFile[13].split(',')[1])
      const cicles = parseInt(arrayFile[17].split(',')[1])
      const totalTime = (countX / samplesSec)

      processFile.push({
        id: i,
        type: 'teq4',
        name: element.name,
        pointNumber: countX,
        content: dataPoint,
        selected: i === 0,
        voltammeter: {
          samplesSec,
          cicles,
          range,
          totalTime,
        }
      })
    } else throw new Error('File type not supported')
  }

  return processFile
}


const readFileContentsUsingJS = async (file) => {
  return new Promise((resolve, reject) => {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = reject;
    fileReader.readAsText(file);
  });
}
const readAllFilesUsingJS = async (AllFiles) => {
  const results = await Promise.all(AllFiles.map(async (file) => {
    const fileContents = await readFileContentsUsingJS(file);
    return fileContents;
  }));
  return results;
}

const readFileContentFromTauri = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(readBinaryFile(file));
    } catch (error) {
      reject(error);
    }
  });
}

const readAllFilesTauri = async (AllFiles) => {
  const results = await Promise.all(AllFiles.map(async (file) => {
    const fileContents = await readFileContentFromTauri(file);
    return fileContents;
  }));
  return results;
}

const Utf8ArrayToStr = (array: number[]): string => {
  let out, i, len, c;
  let char2, char3;

  out = "";
  len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) |
          ((char3 & 0x3F) << 0));
        break;
    }
  }

  return out;
}

const readFilesUsingTauriProcess = async () => {
  const selected = await open({
    multiple: true,
    filters: [{
      name: 'teq4Z & teq4',
      extensions: ['teq4Z', 'teq4']
    }]
  });
  if (Array.isArray(selected)) {
    const readFileContentsI = async (file) => {
      return new Promise((resolve, reject) => {
        try {
          resolve(readBinaryFile(file));
        } catch (error) {
          reject(error);
        }
      });

    }
    const readAllFilesI = async (AllFiles) => {

      const results = await Promise.all(AllFiles.map(async (file) => {
        const fileContents = await readFileContentsI(file);
        return { content: await Utf8ArrayToStr(fileContents as number[]), name: _.last(file.split(/\\/g)) };
      }));

      return results;
    }
    const contents = extractSerialPoint(await readAllFilesI(selected))
    return contents
  } else if (selected === null) {
    console.log('user cancelled the selection')
  } else {
    console.log('user selected a single file')
  }
}

const COLORS = [
  '#ff549d',
  '#5612eb',
  '#47f5fa',
  '#b9bdab',
  '#78a15e',
  '#f61978',
  '#dca460',
  '#9d94e0',
  '#86e4a4',
  '#b8ffc0',
  '#ffbe1e',
  '#d65936',
  '#618374',
  '#c97871',
  '#9027e7',
  '#feb300',
  '#922f82',
  '#417f97',
  '#4153d2',
  '#eb87f5',
]

const COLUMNS_IMPEDANCE = [
  'Time',
  'Frequency',
  'Module',
  'Fase',
  'ZR',
  'ZI',
]

const COLUMNS_VOLTAMETER = [
  'Time',
  'Voltage',
  'Current',
]

export {
  extractSerialPoint,
  fileType,
  readFileContentsUsingJS,
  readAllFilesUsingJS,
  readAllFilesTauri,
  Utf8ArrayToStr,
  readFilesUsingTauriProcess,
  COLORS,
  COLUMNS_IMPEDANCE,
  COLUMNS_VOLTAMETER
}
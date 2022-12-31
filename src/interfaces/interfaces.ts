type NotificationType = "Error" | "Warning" | "Success" | "Info" | null;

export interface INotification {
  title: string;
  content: string[];
  type: NotificationType;
}

interface IState {}

export interface IGraftState {
  notifications: INotification;
  state: IState;
  fileType: IFileType;
  loading: boolean;
  graftType: IGrafType;
  impedanceType: IGraftImpedanceType;
  stepBetweenPoints: IStepBetweenPoints;
  drawerOpen: boolean;
  columns: columns;
}

export type IGrafType = "line" | "scatter";

export type IGraftImpedanceType = "Bode" | "Nyquist" | "ZiZrVsFreq";

export type IFileType = "teq4Z" | "teq4" | "csv";

export type IGraftData =
  | "IMPEDANCE_MODULE_FASE"
  | "IMPEDANCE_ZiZr"
  | "VC_V_vs_I"
  | "VC_t_vs_I";

export type IStepBetweenPoints = number;

export type File = {
  id: number;
  name: string;
  content: string | string[][];
  selected: boolean;
  columns?: string[];
};

export type ExportData = {
  name: string;
  value: {
    Time?: number;
    Frequency?: number;
    Module?: number;
    Fase?: number;
    ZI?: number;
    ZR?: number;
  }[];
}[];

export type ProcessFile = {
  id: number;
  name: string;
  type: "teq4" | "teq4Z" | "csv";
  pointNumber?: number;
  content: string[][];
  selected: boolean;
  impedance?: {
    V: number;
    signalAmplitude: number;
    sFrequency: number;
    eFrequency: number;
    totalPoints: number;
  };
  voltammeter?: {
    samplesSec: number;
    range: number;
    totalTime: number;
    cicles: number;
  };
  csv?: {
    columns: string[];
  };
};

export type Files = {
  files: File[];
};
export type columns = {
  id: number;
  fileName: string;
  columns: {
    name: string;
    index: number;
    selected: boolean;
    axis: "xaxis" | "yaxis" | "yaxis2" | null;
  }[];
};

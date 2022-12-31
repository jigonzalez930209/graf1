import { createContext } from "react";
import { columns, IGraftImpedanceType, IGraftState, IGrafType, INotification } from '../interfaces/interfaces';


export type GrafContextProps = {
  graftState: IGraftState;
  setNotification: (notification: INotification) => void;
  setSelectedFile: (selectedFileType: string) => void;
  setLoading: (loading: boolean) => void;
  setGraftType: (type: IGrafType) => void;
  setImpedanceType: (type: IGraftImpedanceType) => void;
  setStepBetweenPoints: (step: number) => void;
  setDrawerOpen: (open: boolean) => void;
  setSelectedColumns: (columns: columns) => void;
}


export const GrafContext = createContext<GrafContextProps>({} as GrafContextProps);
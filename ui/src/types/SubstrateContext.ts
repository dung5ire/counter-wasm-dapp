import { Dispatch, SetStateAction } from 'react';

export type SubstrateContextType = {
  loading: boolean;
  errMsg: string;
  isConnected: boolean;
  isAuthorized: boolean;
  address: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setErrMsg: Dispatch<SetStateAction<string>>;
  setIsConnected: Dispatch<SetStateAction<boolean>>;
  setIsAuthorized: Dispatch<SetStateAction<boolean>>;
  setAddress: Dispatch<SetStateAction<string>>;
};

export interface ConnectRes {
  evmAddress: string
  nativeAddress: string
}
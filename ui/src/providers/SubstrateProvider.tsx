import { useState } from "react";
import SubstrateContext from "../contexts/SubstrateContext";
import { SubstrateContextType } from "../types/SubstrateContext";

interface SubstrateProviderProps {
  children: React.ReactNode
}


const SubstrateProvider = ({ children }: SubstrateProviderProps) => {
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [address, setAddress] = useState('');

  const initialContextValue: SubstrateContextType = {
    loading,
    isConnected,
    isAuthorized,
    errMsg,
    address,
    setLoading,
    setIsConnected,
    setIsAuthorized,
    setErrMsg,
    setAddress,
  };

  return (
    <SubstrateContext.Provider value={initialContextValue}>
      {children}
    </SubstrateContext.Provider>
  )
}

export default SubstrateProvider
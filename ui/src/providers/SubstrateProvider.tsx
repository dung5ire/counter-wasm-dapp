import { useState } from "react";
// import { toast } from "react-toastify";
// import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
// import {
//   web3Accounts,
//   web3Enable,
//   web3FromSource,
// } from "@polkadot/extension-dapp";
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
  // const [web3Enabled, setWeb3Enabled] = useState(false);

  // // const web3EnableCB = useCallback(async () => {
  // //   const extensions = await web3Enable("5ireChain");

  // //   if (extensions.length === 0) {
  // //     toast.error("No Web3 extension found!");
  // //   } else {
  // //     setWeb3Enabled(true);
  // //   }
  // // }, []);

  // // const getExtension = useCallback(async () => {
  // //   if (!web3Enabled) {
  // //     await web3EnableCB();
  // //   }

  // //   if (!address) return;

  // //   const injector = await web3FromSource(currentAccount.meta.source);
  // //   return injector;
  // // }, [web3Enabled, web3EnableCB]);

  // // useEffect(() => {
  // //   getExtension();
  // // }, [getExtension]);

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
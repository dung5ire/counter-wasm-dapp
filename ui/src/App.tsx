import { useEffect, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Counter from "./components/Counter";
import useIsFire from "./hooks/useIsFire";
import useSubstrateContext from "./hooks/useSubstrateContext";
import type { ConnectRes } from './types/SubstrateContext';

function App() {
  const { isFire } = useIsFire()
  const { setAddress, setIsConnected } = useSubstrateContext();

  useEffect(() => {
    if (isFire) {
      window.fire.on('accountChanged', handleAccountChanged);
      return () => {
        window.fire.removeListener('accountChanged', handleAccountChanged);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFire]);

  useEffect(() => {
    if (isFire) {
      window.fire.on('networkChanged', handleNetworkChanged);

      return () => {
        window.fire.removeListener('networkChanged', handleNetworkChanged);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFire]);

  const handleAccountChanged = useCallback((res: ConnectRes) => {
    setAddress(res.evmAddress);
    setIsConnected(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleNetworkChanged = () => {
    console.log('Network changed')
  }

  return (
    <BrowserRouter>
      <Header />
      <Counter />
    </BrowserRouter>
  );
}

export default App;

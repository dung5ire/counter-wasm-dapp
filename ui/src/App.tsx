import { useEffect, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Counter from "./components/Counter";
import useSubstrateContext from "./hooks/useSubstrateContext";
import type { ConnectRes } from './types/SubstrateContext';

function App() {
  const { setAddress, setIsConnected } = useSubstrateContext();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.fire !== 'undefined') {
      window.fire.on('accountsChanged', handleAccountChanged);
      return () => {
        window.fire.removeListener('accountsChanged', handleAccountChanged);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccountChanged = useCallback((res: ConnectRes) => {
    setAddress(res.evmAddress);
    setIsConnected(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <Counter />
    </BrowserRouter>
  );
}

export default App;

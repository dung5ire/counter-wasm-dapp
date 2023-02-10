import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Counter from "./components/Counter";
import useSubstrateContext from "./hooks/useSubstrateContext";

function App() {
  const substrateInfo = useSubstrateContext();
  return (
    <BrowserRouter>
      <Header />
      <Counter account={substrateInfo?.currentAccount} />
    </BrowserRouter>
  );
}

export default App;

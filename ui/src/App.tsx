import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Counter from "./components/Counter";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Counter />
    </BrowserRouter>
  );
}

export default App;

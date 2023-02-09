import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";





function App() {
  //  Counter is a state initialized to 0
  const [counter, setCounter] = React.useState(0);



  return (
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
}

export default App;

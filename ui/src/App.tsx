import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { SubstrateProvider } from "./api/providers/connectProvider";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/Router";





function App() {
  //  Counter is a state initialized to 0
  const [counter, setCounter] = React.useState(0);



  return (
    <SubstrateProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </SubstrateProvider>
  );
}

export default App;

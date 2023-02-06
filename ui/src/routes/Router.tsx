import { Route, Routes } from "react-router-dom";
import HomePage from "../feature/homepage";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default Router;

import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="" element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<Dashboard />}></Route>
    </Routes>
  );
}

export default App;

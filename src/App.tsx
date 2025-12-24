import Dashboard from "./pages/Dashboard";
import Login from "./pages/login";
import { Route, Routes } from "react-router-dom";
import ReceiptForm from "./pages/Receipt";

function App() {
  return (
    <Routes>
      <Route path="" element={<Login />} />
      <Route path="receipt" element={<ReceiptForm />} />
      <Route path="dashboard" element={<Dashboard />}></Route>
    </Routes>
  );
}

export default App;

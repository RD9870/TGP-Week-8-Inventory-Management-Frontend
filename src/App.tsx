import React from "react";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Login from "./pages/login";
import { Route, Routes, useLocation } from "react-router-dom";
import ReceiptForm from "./pages/receiot";
import ProfitDetails from "./pages/profitDetails";
import UsersPage from "./pages/users";
import CategoriesPage from "./pages/Categories";
import ProductsPage from "./pages/Products";
import Dashboard from "./pages/dashboard";

function AppContent() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    { id: "users", label: "Users", path: "/users" },
    { id: "products", label: "Products", path: "/products" },
    { id: "Categories", label: "Categories", path: "/categories" },
    { id: "Profits", label: "Profits", path: "/profitDetails" },
  ];

  return (
    <div className="flex">
      <Sidebar
        items={navItems}
        currentPath={location.pathname}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main className="md:ml-60 flex-1 w-full">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profitDetails" element={<ProfitDetails />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="Categories" element={<CategoriesPage />} />
          <Route path="Products" element={<ProductsPage />} />

          {/* <Route path="/users" element={<UserListPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} /> */}
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="" element={<Login />} />
      <Route path="login" element={<Login />} />

      <Route path="receipt" element={<ReceiptForm />} />
      {/* <Route path="dashboard" element={<Dashboard />}></Route> */}
      <Route path="*" element={<AppContent />} />
    </Routes>
  );
}

export default App;

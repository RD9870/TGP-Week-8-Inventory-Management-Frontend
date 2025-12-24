import React from "react";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import { Route, Routes, useLocation } from "react-router-dom";

function AppContent() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: "home", label: "Home", path: "/" },
    { id: "users", label: "Users", path: "/users" },
    { id: "profile", label: "Profile", path: "/profile" },
    {
      id: "settings",
      label: "Settings",
      // icon: <Settings />,
      path: "/settings",
    },
  ];

  const pageTitles: { [key: string]: string } = {
    "/": "Home",
    "/users": "Users",
    "/profile": "Profile",
    "/settings": "Settings",
  };

  const pageTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="flex">
      <Sidebar
        items={navItems}
        currentPath={location.pathname}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main className="md:ml-60 flex-1 w-full">
        <Header
          title={pageTitle}
          userName="John Doe"
          userAvatar="https://i.pravatar.cc/150?img=1"
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
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
      {/* <Route path="dashboard" element={<Dashboard />}></Route> */}
      <Route path="*" element={<AppContent />} />
    </Routes>
  );
}

export default App;

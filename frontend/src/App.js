import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./assets/styles/App.css";
import "./i18n/i18n";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { UserRoleProvider } from "./components/UserRoleProvider";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HousekeeperDashboard from "./pages/HousekeeperDashboard";
import FamilyDashboard from "./pages/FamilyDashboard";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <UserRoleProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/housekeeper/home" element={<HousekeeperDashboard />} />
            <Route path="/family/home" element={<FamilyDashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </UserRoleProvider>
  );
}

export default App;

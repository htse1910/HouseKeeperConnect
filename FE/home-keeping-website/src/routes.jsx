import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ConfirmAccountPage from './pages/ConfirmAccountPage'; // Import ConfirmAccountPage
import HouseKeeperDashboard from './pages/HouseKeeperDashboard'; // Import HouseKeeperDashboard
import FamilyDashboard from './pages/FamilyDashboard'; // Import FamilyDashboard
import Layout from './components/Layout';
import FindJobsPage from './pages/FindJobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import ProfilePage from './pages/ProfilePage';

function AppRoutes() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/confirm-account" element={<ConfirmAccountPage />} />

          {/* Role-Based Dashboard Routes */}
          <Route path="/housekeeper-dashboard" element={<HouseKeeperDashboard />} />
          <Route path="/family-dashboard" element={<FamilyDashboard />} />
          <Route path="/find-jobs" element={<FindJobsPage />} /> {/* Add Find Jobs Page */}
          <Route path="/job/:id" element={<JobDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default AppRoutes;

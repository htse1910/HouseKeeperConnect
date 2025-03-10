import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ConfirmAccountPage from './pages/ConfirmAccountPage';
import HouseKeeperDashboard from './pages/HouseKeeperDashboard';
import FamilyDashboard from './pages/FamilyDashboard';
import Layout from './components/Layout';
import FindJobsPage from './pages/FindJobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import ProfilePage from './pages/ProfilePage';
import JobPostingPage from './pages/JobPostingPage';
import HousekeeperDetailsPage from './pages/HousekeeperDetailsPage'; // Import HousekeeperDetailsPage
import FamilyManagePage from './pages/FamilyManagePage';
import MessagesPage from './pages/MessagesPage';
function AppRoutes() {
  return (
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

          {/* Job & Profile Related Pages */}
          <Route path="/find-jobs" element={<FindJobsPage />} />
          <Route path="/job/:id" element={<JobDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/job-posting-page" element={<JobPostingPage />} />

          {/* Housekeeper Details Page */}
          <Route path="/housekeeper/:id" element={<HousekeeperDetailsPage />} />
          <Route path="/family-manage-page" element={<FamilyManagePage />} />
          <Route path="/messages" element={<MessagesPage />} />

        </Routes>
      </Layout>
  );
}

export default AppRoutes;

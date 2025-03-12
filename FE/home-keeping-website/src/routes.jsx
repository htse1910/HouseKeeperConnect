import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ConfirmAccountPage from './pages/ConfirmAccountPage';
import HousekeeperDashboardPage from './pages/HousekeeperDashboardPage';
import FamilyDashboard from './pages/FamilyDashboard';
import Layout from './components/Layout';
import FindJobsPage from './pages/FindJobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import ProfilePage from './pages/ProfilePage';
import JobPostingPage from './pages/JobPostingPage';
import HousekeeperDetailsPage from './pages/HousekeeperDetailsPage';
import MessagesPage from './pages/MessagesPage';
import UpdateHousekeeperPage from './pages/UpdateHousekeeperPage'; // ✅ Import new page
import AddIdentificationPicturePage from './pages/AddIdentificationPicturePage';
import AdminDashboard from './pages/AdminDashboard';
import HouseKeeperManagePage from './pages/HouseKeeperManagePage';

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
        <Route path="/housekeeper-dashboard" element={<HousekeeperDashboardPage />} />
        <Route path="/family-dashboard" element={<FamilyDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* ✅ New Admin Route */}
      
        {/* Job & Profile Related Pages */}
        <Route path="/jobs" element={<FindJobsPage />} />
        <Route path="/job/:id" element={<JobDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/job-posting-page" element={<JobPostingPage />} />

        {/* Housekeeper Pages */}
        <Route path="/housekeeper/:id" element={<HousekeeperDetailsPage />} />
        <Route path="/housekeeper/profile/update/:accountId" element={<UpdateHousekeeperPage />} /> {/* ✅ New route */}
        <Route path="/my-jobs" element={<HouseKeeperManagePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/housekeeper/upload-id" element={<AddIdentificationPicturePage />} />
      </Routes>
    </Layout>
  );
}

export default AppRoutes;

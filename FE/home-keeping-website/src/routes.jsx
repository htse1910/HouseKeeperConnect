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
//import HousekeeperProfilePage from './pages/HousekeeperProfilePage';
import FamilyProfilePage from './pages/FamilyProfilePage';
//import AdminProfilePage from './pages/AdminProfilePage';
//import AdminDashboard from './pages/AdminDashboard';
import HouseKeeperManagePage from './pages/HouseKeeperManagePage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import UserVerificationPage from './pages/UserVerificationPage';
import StaffJobModerationPage from './pages/StaffJobModerationPage';
import UpdateHousekeeperAccountPage from './pages/UpdateHousekeeperAccountPage'; // ✅ Import new page
import FamilyHousekeeperSearchPage from './pages/FamilyHousekeeperSearchPage';
import HousekeeperScheduleManagement from './pages/HousekeeperScheduleManagement';
import FamilyJobPostingPage from './pages/FamilyJobPostingPage';

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
        <Route path="/housekeeper/dashboard" element={<HousekeeperDashboardPage />} />
        <Route path="/family-dashboard" element={<FamilyDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboardPage />} />

        {/* Job & Profile Related Pages */}
        <Route path="/jobs" element={<FindJobsPage />} />
        <Route path="/job/:id" element={<JobDetailsPage />} />
        <Route path="/job-posting-page" element={<JobPostingPage />} />

        {/* Housekeeper Pages */}
        <Route path="/housekeeper/:id" element={<HousekeeperDetailsPage />} />
        <Route path="/housekeeper/update-id" element={<UpdateHousekeeperPage />} /> {/* ✅ New route */}
        <Route path="/my-jobs" element={<HouseKeeperManagePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/housekeeper/upload-id" element={<AddIdentificationPicturePage />} />
        <Route path="/housekeeper/profile/update/:id" element={<UpdateHousekeeperAccountPage />} /> 
        <Route path="/housekeeper/schedule" element={<HousekeeperScheduleManagement />} />       

        {/* Staff Dashboard Pages */}
        <Route path="/staff/dashboard" element={<StaffDashboardPage />} />
        <Route path="/dashboard/user" element={<UserVerificationPage />} />
        <Route path="/dashboard/jobs" element={<StaffJobModerationPage />} />

        {/* Family Pages */}
        <Route path="/Family/profile" element={<FamilyProfilePage />} />
        <Route path="/find-housekeepers" element={<FamilyHousekeeperSearchPage />} />
        <Route path="/job-posting" element={<FamilyJobPostingPage />} />
      </Routes>
    </Layout>
  );
}

export default AppRoutes;

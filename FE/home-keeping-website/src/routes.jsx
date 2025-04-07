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
// import AddIdentificationPicturePage from './pages/AddIdentificationPicturePage';
//import HousekeeperProfilePage from './pages/HousekeeperProfilePage';
import FamilyProfilePage from './pages/FamilyProfilePage';
//import AdminProfilePage from './pages/AdminProfilePage';
//import AdminDashboard from './pages/AdminDashboard';
import HouseKeeperManagePage from './pages/HouseKeeperManagePage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import UserVerificationPage from './pages/UserVerificationPage';
import StaffJobModerationPage from './pages/StaffJobModerationPage';
import UpdateHousekeeperAccountPage from './pages/UpdateHousekeeperAccountPage'; // ✅ Import new page
import FamilyDashboardPage from './pages/FamilyDashboardPage';
import FamilyHousekeeperSearchPage from './pages/FamilyHousekeeperSearchPage';
import FamilyInvitationPage from './pages/FamilyInvitationPage';
import FamilyTransactionPage from './pages/FamilyTransactionPage';
import HousekeeperScheduleManagement from './pages/HousekeeperScheduleManagement';
import FamilyJobPostingPage from './pages/FamilyJobPostingPage';
import FamilyJobDetailsPage from './pages/FamilyJobDetailsPage';
import FamilyDepositPage from "./pages/FamilyDepositPage";
import FamilyDepositReturnPage from "./pages/FamilyDepositReturnPage";
import FamilyMessagesPage from "./pages/FamilyMessagesPage";
import IDVerificationCreatePage from './pages/IDVerificationCreatePage';
import FamilyJobManagementPage from './pages/FamilyJobManagementPage';
import FamilyJobDetailUpdatePage from './pages/FamilyJobDetailUpdatePage';
import UpdateVerificationPage from './pages/UpdateVerificationPage';
import HousekeeperWalletPage from './pages/HousekeeperWalletPage'; // ✅ Add this line
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HousekeeperBookingManagementPage from "./pages/HousekeeperBookingManagementPage";

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirm-account" element={<ConfirmAccountPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* Role-Based Dashboard Routes */}
        <Route path="/housekeeper/dashboard" element={<HousekeeperDashboardPage />} />
        <Route path="/family-dashboard" element={<FamilyDashboardPage />} />
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
        <Route path="/housekeeper/profile/update/:id" element={<UpdateHousekeeperAccountPage />} />
        <Route path="/housekeeper/schedule" element={<HousekeeperScheduleManagement />} />
        <Route path="/housekeeper/upload-id" element={<IDVerificationCreatePage />} />
        <Route path="/housekeeper/update-verification" element={<UpdateVerificationPage />} />
        <Route path="/housekeeper/wallet" element={<HousekeeperWalletPage />} /> {/* ✅ New route */}
        <Route path="/housekeeper/bookings" element={<HousekeeperBookingManagementPage />} />
        
        {/* Staff Dashboard Pages */}
        <Route path="/staff/dashboard" element={<StaffDashboardPage />} />
        <Route path="/dashboard/users" element={<UserVerificationPage />} />
        <Route path="/dashboard/jobs" element={<StaffJobModerationPage />} />

        {/* Family Pages */}
        <Route path="/family/dashboard" element={<FamilyDashboardPage />} />
        <Route path="/family/profile" element={<FamilyProfilePage />} />
        <Route path="/family/find-housekeepers" element={<FamilyHousekeeperSearchPage />} />
        <Route path="/family/invite" element={<FamilyInvitationPage />} />
        <Route path="/family/post-job" element={<FamilyJobPostingPage />} />
        <Route path="/family/my-posts" element={<FamilyJobManagementPage />} />
        <Route path="/family/job/update/:id" element={<FamilyJobDetailUpdatePage />} />
        <Route path="/family/job/detail/:id" element={<FamilyJobDetailsPage />} />
        <Route path="/family/deposit" element={<FamilyDepositPage />} />
        <Route path="/family/deposit/return" element={<FamilyDepositReturnPage />} />
        <Route path="/family/transactions" element={<FamilyTransactionPage />} />
        <Route path="/family/messages" element={<FamilyMessagesPage />} />
      </Routes>
    </Layout>
  );
}

export default AppRoutes;

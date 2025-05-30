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
import FamilyProfileUpdatePage from "./pages/FamilyProfileUpdatePage.jsx";
//import AdminProfilePage from './pages/AdminProfilePage';
//import AdminDashboard from './pages/AdminDashboard';
import HouseKeeperManagePage from './pages/HouseKeeperManagePage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import StaffUserVerificationPage from './pages/StaffUserVerificationPage';
import StaffJobModerationPage from './pages/StaffJobModerationPage';
import StaffPayoutApprovalPage from './pages/StaffPayoutApprovalPage';
import UpdateHousekeeperAccountPage from './pages/UpdateHousekeeperAccountPage'; // ✅ Import new page
import FamilyDashboardPage from './pages/FamilyDashboardPage';
import FamilyWalletPage from './pages/FamilyWalletPage';
import FamilyHousekeeperSearchPage from './pages/FamilyHousekeeperSearchPage';
import FamilyHousekeeperViewPage from './pages/FamilyHousekeeperViewPage';
import FamilyInvitationPage from './pages/FamilyInvitationPage';
import FamilyTransactionPage from './pages/FamilyTransactionPage';
import FamilyJobPostingPage from './pages/FamilyJobPostingPage';
import FamilyJobPaymentResultPage from './pages/FamilyJobPaymentResultPage.jsx';
import FamilyJobDetailsPage from './pages/FamilyJobDetailsPage';
import FamilyDepositPage from "./pages/FamilyDepositPage";
import FamilyDepositReturnPage from "./pages/FamilyDepositReturnPage";
import FamilyMessagesPage from "./pages/FamilyMessagesPage";
import FamilySupportPage from './pages/FamilySupportPage';
import IDVerificationCreatePage from './pages/IDVerificationCreatePage';
import FamilyJobManagementPage from './pages/FamilyJobManagementPage';
import FamilyJobDetailUpdatePage from './pages/FamilyJobDetailUpdatePage';
import UpdateVerificationPage from './pages/UpdateVerificationPage';
import HousekeeperWalletPage from './pages/HousekeeperWalletPage'; // ✅ Add this line
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HousekeeperBookingManagementPage from "./pages/HousekeeperBookingManagementPage";
import UserNotifications from './pages/UserNotifications';
import AdminDashboardPage from './pages/AdminDashboardPage';
import JobListOfFamily from './pages/JobListOfFamily.jsx';
import JobsOfferedToMePage from './pages/JobsOfferedToMePage.jsx';
import HouseKeeperPayoutsPage from './pages/HouseKeeperPayoutsPage.jsx';
import StaffWithdrawalVerificationPage from './pages/StaffWithdrawalVerificationPage.jsx';
import HousekeeperSupportRequestPage from './pages/HousekeeperSupportRequestPage'; // ✅ New page
import FamilySupportRequestPage from './pages/FamilySupportRequestPage'; // ✅ Import new page
import StaffSupportRequestPage from './pages/StaffSupportRequestPage'; // ✅ Import it if you've created it
import AdminUserListPage from './pages/AdminUserListPage.jsx';
import AdminServiceListPage from './pages/AdminServicePgae.jsx';
import WithdrawRequestPage from './pages/WithdrawRequestPage.jsx';
import ManageAcceptedJobsPage from './pages/ManageAcceptedJobsPage'; // ✅ New import
import ManagePlatformFeesPage from "./pages/ManagePlatformFeesPage";
import StaffTransactionListPage from './pages/StaffTransactionListPage.jsx';
import FamilyAbandonedJobsPage from './pages/FamilyAbandonedJobsPage.jsx';
import CreateDirectJobOfferPage from './pages/CreateDirectJobOfferPage.jsx';
import HousekeeperSchedulePage from './pages/HousekeeperSchedulePage.jsx';
import AdminManageStaffPage from './pages/AdminManageStaffPage.jsx';
import AdminManageExpiredPage from './pages/AdminManageExpiredPage';

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
        <Route path="/account/notifications" element={<UserNotifications />} />
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
        <Route path="/housekeeper/upload-id" element={<IDVerificationCreatePage />} />
        <Route path="/housekeeper/update-verification" element={<UpdateVerificationPage />} />
        <Route path="/housekeeper/wallet" element={<HousekeeperWalletPage />} /> {/* ✅ New route */}
        <Route path="/housekeeper/bookings" element={<HousekeeperBookingManagementPage />} />
        <Route path="/housekeeper/jobs-offered" element={<JobsOfferedToMePage />} />
        <Route path="/housekeeper/payouts" element={<HouseKeeperPayoutsPage />} />
        <Route path="/housekeeper/support-requests" element={<HousekeeperSupportRequestPage />} />
        <Route path="/housekeeper/withdraw-details" element={<WithdrawRequestPage />} />
        <Route path="/housekeeper-schedule" element={<HousekeeperSchedulePage />} />
        {/* Staff Dashboard Pages */}
        <Route path="/staff/dashboard" element={<StaffDashboardPage />} />
        <Route path="/dashboard/users" element={<StaffUserVerificationPage />} />
        <Route path="/dashboard/jobs" element={<StaffJobModerationPage />} />
        <Route path="/dashboard/payouts" element={<StaffPayoutApprovalPage />} />
        <Route path="/dashboard/withdrawals" element={<StaffWithdrawalVerificationPage />} />
        <Route path="/dashboard/accepted-jobs" element={<ManageAcceptedJobsPage />} />
        <Route path="/dashboard/platform-fees" element={<ManagePlatformFeesPage />} />
        <Route path="/dashboard/support" element={<StaffSupportRequestPage />} />
        <Route path="/dashboard/transactions" element={<StaffTransactionListPage />} />
        {/* Family Pages */}
        <Route path="/family/dashboard" element={<FamilyDashboardPage />} />
        <Route path="/family/profile" element={<FamilyProfilePage />} />
        <Route path="/family/profile/update" element={<FamilyProfileUpdatePage />} />
        <Route path="/family/wallet" element={<FamilyWalletPage />} />
        <Route path="/family/find-housekeepers" element={<FamilyHousekeeperSearchPage />} />
        <Route path="/family/housekeeper/profile/:accountID" element={<FamilyHousekeeperViewPage />} />
        <Route path="/family/invite" element={<FamilyInvitationPage />} />
        <Route path="/family/post-job" element={<FamilyJobPostingPage />} />
        <Route path="/family/job/payment" element={<FamilyJobPaymentResultPage />} />
        <Route path="/family/my-posts" element={<FamilyJobManagementPage />} />
        <Route path="/family/job/update/:id" element={<FamilyJobDetailUpdatePage />} />
        <Route path="/family/job/detail/:id" element={<FamilyJobDetailsPage />} />
        <Route path="/family/deposit" element={<FamilyDepositPage />} />
        <Route path="/family/deposit/return" element={<FamilyDepositReturnPage />} />
        <Route path="/family/transactions" element={<FamilyTransactionPage />} />
        <Route path="/family/messages" element={<FamilyMessagesPage />} />
        <Route path="/family/jobs" element={<JobListOfFamily />} />
        <Route path="/family/support-requests" element={<FamilySupportRequestPage />} />
        <Route path="/family/withdraw-details" element={<WithdrawRequestPage />} />
        <Route path="/family/abandoned-jobs" element={<FamilyAbandonedJobsPage />} />
        <Route path="/family/support" element={<FamilySupportPage />} />
        <Route path="/family/create-direct-job" element={<CreateDirectJobOfferPage />} />
        {/* Admin Pages */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUserListPage />} />
        <Route path="/admin/services" element={<AdminServiceListPage />} />
        <Route path="/admin/platform-fees" element={<ManagePlatformFeesPage />} />
        <Route path="/admin/manage-staffs" element={<AdminManageStaffPage />} />
        <Route path="/admin/manage-expired" element={<AdminManageExpiredPage />} />

      </Routes>
    </Layout>
  );
}

export default AppRoutes;

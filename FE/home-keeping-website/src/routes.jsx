import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ConfirmAccountPage from './pages/ConfirmAccountPage'; // Import ConfirmAccountPage
import Layout from './components/Layout';

function AppRoutes() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/confirm-account" element={<ConfirmAccountPage />} /> {/* Add ConfirmAccountPage route */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default AppRoutes;

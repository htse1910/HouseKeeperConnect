import AppRoutes from './routes';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/styles/App.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserRoleProvider } from "./components/UserRoleProvider";
import "./i18n/i18n"; // Thêm hỗ trợ đa ngôn ngữ
import './utils/fetchWrapper';
import './utils/axiosInterceptor'; // 👈 injects global axios behavior

const GOOGLE_CLIENT_ID = "389719592750-1bnfd3k1g787t8r8tmvltrfokvm87ur2.apps.googleusercontent.com";

// 🕒 Clear localStorage after 3 hours of login
const HOURS_BEFORE_EXPIRY = 3;
const now = new Date().getTime();
const loginTime = parseInt(localStorage.getItem("loginTimestamp"));

if (loginTime && now - loginTime > HOURS_BEFORE_EXPIRY * 60 * 60 * 1000) {
  localStorage.clear();
} else if (loginTime) {
  const timeLeft = HOURS_BEFORE_EXPIRY * 60 * 60 * 1000 - (now - loginTime);
  setTimeout(() => {
    localStorage.clear();
    window.location.reload(); // optional to visually reflect logout
  }, timeLeft);
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserRoleProvider>
        <AppRoutes />
      </UserRoleProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

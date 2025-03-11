import AppRoutes from './routes';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/styles/App.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserRoleProvider } from "./components/UserRoleProvider";
import "./i18n/i18n"; // Thêm hỗ trợ đa ngôn ngữ

const GOOGLE_CLIENT_ID = "389719592750-1bnfd3k1g787t8r8tmvltrfokvm87ur2.apps.googleusercontent.com";

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

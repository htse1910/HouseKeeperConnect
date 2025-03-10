import AppRoutes from './routes';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css'; // Add this line if it's not included
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "389719592750-1bnfd3k1g787t8r8tmvltrfokvm87ur2.apps.googleusercontent.com"; // Replace this with your actual Client ID

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppRoutes />
    </GoogleOAuthProvider>
  );
}

export default App;

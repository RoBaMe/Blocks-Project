import { AuthProvider } from './contexts/AuthContext';
import Router from './components/Router';
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <AuthProvider>
            <Router />
            <Toaster position="bottom-right" />
        </AuthProvider>
    );
}

export default App;

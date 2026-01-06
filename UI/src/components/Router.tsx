import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import SignUp from './auth/SignUp';
import Chat from './chat/Chat';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { useMemo } from 'react';

function Router() {
    const { user, isLoading: authLoading } = useAuth();

    const isAuthenticated = useMemo(() => !authLoading && user, [user, authLoading]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={isAuthenticated ? <Navigate to="/chat" replace /> : <Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;

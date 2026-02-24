import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Goats from './pages/Goats';
import Inventory from './pages/Inventory';
import Expenses from './pages/Expenses';
import Sales from './pages/Sales';
import Users from './pages/Users';

import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';

function App() {
    return (
        <>
            <Toaster position="top-right" />
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={<ProtectedRoute />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="goats" element={<Goats />} />

                        {/* Admin Only Routes */}
                        <Route element={<RoleGuard allowedRoles={['admin']} />}>
                            <Route path="inventory" element={<Inventory />} />
                            <Route path="expenses" element={<Expenses />} />
                            <Route path="sales" element={<Sales />} />
                            <Route path="users" element={<Users />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;

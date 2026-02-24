import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 md:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-col flex-1 w-full overflow-hidden">
                <Navbar setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 w-full overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProtectedRoute;

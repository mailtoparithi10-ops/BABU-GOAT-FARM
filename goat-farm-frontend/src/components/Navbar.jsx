import React from 'react';
import useAuth from '../hooks/useAuth';
import { LogOut, UserCircle, Menu } from 'lucide-react';

const Navbar = ({ setSidebarOpen }) => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow z-10 shrink-0">
            <div className="flex items-center justify-between px-4 py-4 md:px-6">
                <div className="flex items-center">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-1 mr-3 text-gray-600 rounded-md md:hidden hover:bg-gray-100"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 hidden sm:block">Farm Management System</h2>
                    <h2 className="text-lg font-semibold text-gray-800 sm:hidden">Dashboard</h2>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="flex items-center text-gray-600 max-w-[120px] md:max-w-xs overflow-hidden">
                        <UserCircle className="w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-2 shrink-0" />
                        <span className="font-medium text-xs md:text-sm truncate">{user?.email}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center text-red-500 hover:text-red-700 transition"
                    >
                        <LogOut className="w-5 h-5 md:mr-1 shrink-0" />
                        <span className="text-sm font-medium hidden md:block">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

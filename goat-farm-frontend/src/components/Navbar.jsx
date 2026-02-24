import React from 'react';
import useAuth from '../hooks/useAuth';
import { LogOut, UserCircle } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center">
                    {/* Can add mobile menu toggler here in future */}
                    <h2 className="text-xl font-semibold text-gray-800">Farm Management System</h2>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-600">
                        <UserCircle className="w-6 h-6 mr-2" />
                        <span className="font-medium text-sm">{user?.email}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center text-red-500 hover:text-red-700 transition"
                    >
                        <LogOut className="w-5 h-5 mr-1" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

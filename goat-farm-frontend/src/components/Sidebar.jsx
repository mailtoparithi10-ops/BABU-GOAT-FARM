import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
    LayoutDashboard,
    BaggageClaim,
    Package,
    Receipt,
    TrendingUp,
    Users
} from 'lucide-react';

const Sidebar = () => {
    const { user } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'worker'] },
        { name: 'Goats', path: '/goats', icon: <BaggageClaim size={20} />, roles: ['admin', 'worker'] },
        { name: 'Inventory', path: '/inventory', icon: <Package size={20} />, roles: ['admin'] },
        { name: 'Expenses', path: '/expenses', icon: <Receipt size={20} />, roles: ['admin'] },
        { name: 'Sales', path: '/sales', icon: <TrendingUp size={20} />, roles: ['admin'] },
        { name: 'Users', path: '/users', icon: <Users size={20} />, roles: ['admin'] },
    ];

    return (
        <div className="flex flex-col w-64 bg-farm-900 text-white transition-all duration-300">
            <div className="flex items-center justify-center h-16 border-b border-farm-800">
                <span className="text-xl font-bold tracking-wider font-sans text-farm-50">Babu Goat Farm</span>
            </div>
            <div className="overflow-y-auto overflow-x-hidden flex-grow">
                <ul className="flex flex-col py-4 space-y-1">
                    {menuItems.map((item) => {
                        if (item.roles.includes(user?.role)) {
                            return (
                                <li key={item.name} className="px-4">
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `relative flex flex-row items-center h-11 focus:outline-none hover:bg-farm-800 text-white-600 hover:text-white border-l-4 border-transparent hover:border-farm-500 pr-6 ${isActive ? 'bg-farm-800 border-farm-500 text-white' : 'text-gray-300'
                                            }`
                                        }
                                    >
                                        <span className="inline-flex justify-center items-center ml-4">
                                            {item.icon}
                                        </span>
                                        <span className="ml-2 text-sm tracking-wide truncate">{item.name}</span>
                                    </NavLink>
                                </li>
                            );
                        }
                        return null;
                    })}
                </ul>
            </div>
            <div className="p-4 bg-farm-950 text-xs text-center text-farm-100/50">
                Role: {user?.role.toUpperCase()}
            </div>
        </div>
    );
};

export default Sidebar;

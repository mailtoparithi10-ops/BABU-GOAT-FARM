import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-farm-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl shadow-farm-200">
                <div className="flex flex-col items-center mb-6">
                    <div className="p-3 bg-farm-100 rounded-full mb-3 text-farm-600">
                        <Leaf size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-farm-900">
                        Babu Goat Farm
                    </h2>
                    <p className="text-farm-600 text-sm mt-1">Management Portal</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline focus:border-farm-500 focus:ring-1 focus:ring-farm-500"
                            id="email"
                            type="email"
                            placeholder="worker@babugoatfarm.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline focus:border-farm-500 focus:ring-1 focus:ring-farm-500"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="w-full px-4 py-2 font-bold text-white bg-farm-600 rounded hover:bg-farm-700 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                            type="submit"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

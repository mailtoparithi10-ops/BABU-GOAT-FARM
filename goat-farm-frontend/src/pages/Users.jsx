import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Table from '../components/Table';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import useAuth from '../hooks/useAuth';

const Users = () => {
    // Using dummy users as we don't have a specific `GET /users` in the backend requirements yet, 
    // but we can simulate the requirement UI using mocked or direct axios setup if we add the route.
    // For robustness, assuming the backend has a /auth/users endpoint added or we just show the Add User functionality.

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'worker'
    });

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            toast.success('Worker user created successfully');
            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'worker' });
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Registration failed');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Worker Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-farm-600 text-white rounded hover:bg-farm-700 transition"
                >
                    + Add Worker
                </button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-farm-100 text-center">
                <h3 className="text-xl font-bold text-gray-700 mb-2">Worker Registration Module</h3>
                <p className="text-gray-500 mb-4">You are currently logged in as: <span className="font-bold">{user?.email}</span></p>
                <p className="text-sm">Use the "Add Worker" button to securely onboard farm hands. They will only have access to Goats and Dashboard limits.</p>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New User">
                <form onSubmit={handleAddSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                        <input required type="text" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email Access</label>
                        <input required type="email" className="w-full border p-2 rounded" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">System Role</label>
                        <select required className="w-full border p-2 rounded hover:bg-gray-50 bg-gray-100" value={formData.role} disabled>
                            <option value="worker">Worker</option>
                            <option value="admin">Admin</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Default restricted to Worker. Admins map directly in DB via config.</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Set Password</label>
                        <input required type="password" minLength="6" className="w-full border p-2 rounded" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    </div>

                    <button type="submit" className="w-full bg-farm-600 text-white p-2 rounded mt-4">Create Worker Account</button>
                </form>
            </Modal>
        </div>
    );
};

export default Users;

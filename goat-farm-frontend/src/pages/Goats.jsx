import React, { useState, useEffect } from 'react';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import Table from '../components/Table';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

const Goats = () => {
    const [goats, setGoats] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    // Form State
    const [formData, setFormData] = useState({
        tag_number: '', name: '', breed: '', gender: '', weight: '', purchase_cost: '', current_status: 'active'
    });

    useEffect(() => {
        fetchGoats();
    }, []);

    const fetchGoats = async () => {
        try {
            const res = await api.get('/goats');
            setGoats(res.data);
        } catch (error) {
            toast.error('Failed to load goats');
        } finally {
            setLoading(false);
        }
    };

    const filteredGoats = goats.filter(goat => {
        const matchesSearch = goat.tag_number.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || goat.current_status === filter;
        return matchesSearch && matchesFilter;
    });

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/goats', {
                ...formData,
                weight: parseFloat(formData.weight) || 0,
                purchase_cost: parseFloat(formData.purchase_cost) || 0
            });
            toast.success('Goat added successfully');
            setIsModalOpen(false);
            fetchGoats();
            setFormData({ tag_number: '', name: '', breed: '', gender: '', weight: '', purchase_cost: '', current_status: 'active' });
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to add goat');
        }
    };

    const handleUpdateWeight = async (id) => {
        const newWeight = prompt("Enter new weight in kg:");
        if (newWeight !== null && newWeight !== "") {
            try {
                await api.put(`/goats/${id}`, { weight: parseFloat(newWeight) });
                toast.success('Weight updated');
                fetchGoats();
            } catch (error) {
                toast.error('Failed to update weight');
            }
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this goat?")) {
            try {
                await api.delete(`/goats/${id}`);
                toast.success('Goat deleted');
                fetchGoats();
            } catch (error) {
                toast.error('Failed to delete goat. Make sure it has no attached sales/expenses.');
            }
        }
    }

    const headers = ['Tag Number', 'Breed', 'Gender', 'Weight (kg)', 'Status', 'Actions'];

    const renderRow = (goat, idx) => (
        <tr key={goat.id} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-6 py-4 font-medium">{goat.tag_number}</td>
            <td className="px-6 py-4">{goat.breed || 'Unknown'}</td>
            <td className="px-6 py-4">{goat.gender || '-'}</td>
            <td className="px-6 py-4">{goat.weight || 0}</td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs rounded-full ${goat.current_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {goat.current_status}
                </span>
            </td>
            <td className="px-6 py-4 flex space-x-2">
                <button onClick={() => handleUpdateWeight(goat.id)} className="text-blue-600 hover:text-blue-800 text-sm">Update Wt</button>
                {isAdmin && (
                    <button onClick={() => handleDelete(goat.id)} className="text-red-600 hover:text-red-800 text-sm ml-2">Delete</button>
                )}
            </td>
        </tr>
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Goats Directory</h1>
                {isAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-farm-600 text-white rounded hover:bg-farm-700 transition"
                    >
                        + Add Goat
                    </button>
                )}
            </div>

            <div className="flex space-x-4 mb-4">
                <input
                    type="text"
                    placeholder="Search Tag Number..."
                    className="px-4 py-2 border rounded-lg focus:ring-farm-500 focus:border-farm-500 w-64"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="px-4 py-2 border rounded-lg"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="sold">Sold</option>
                    <option value="dead">Dead</option>
                </select>
            </div>

            {loading ? <div>Loading...</div> : (
                <Table headers={headers} data={filteredGoats} renderRow={renderRow} />
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Goat">
                <form onSubmit={handleAddSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Tag Number</label>
                        <input required type="text" className="w-full border p-2 rounded" value={formData.tag_number} onChange={e => setFormData({ ...formData, tag_number: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                            <select className="w-full border p-2 rounded" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Breed</label>
                            <input type="text" className="w-full border p-2 rounded" value={formData.breed} onChange={e => setFormData({ ...formData, breed: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Weight (kg)</label>
                            <input type="number" step="0.1" className="w-full border p-2 rounded" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Purchase Cost (₹)</label>
                            <input type="number" step="0.01" className="w-full border p-2 rounded" value={formData.purchase_cost} onChange={e => setFormData({ ...formData, purchase_cost: e.target.value })} />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-farm-600 text-white p-2 rounded mt-4">Save Goat</button>
                </form>
            </Modal>
        </div>
    );
};

export default Goats;

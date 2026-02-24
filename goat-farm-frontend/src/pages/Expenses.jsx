import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Table from '../components/Table';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterMode, setFilterMode] = useState('all');

    const [formData, setFormData] = useState({
        category: 'feed', amount: '', date: new Date().toISOString().split('T')[0], payment_method: 'Cash', description: ''
    });

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await api.get('/expenses');
            setExpenses(res.data);
        } catch (error) {
            toast.error('Failed to load expenses');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/expenses', {
                ...formData,
                amount: parseFloat(formData.amount) || 0
            });
            toast.success('Expense logged successfully');
            setIsModalOpen(false);
            fetchExpenses();
            setFormData({ category: 'feed', amount: '', date: new Date().toISOString().split('T')[0], payment_method: 'Cash', description: '' });
        } catch (error) {
            toast.error('Failed to log expense');
        }
    };

    const headers = ['Date', 'Category', 'Description', 'Method', 'Amount'];

    const filteredExpenses = expenses.filter(exp => filterMode === 'all' || exp.category === filterMode);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTotal = filteredExpenses.reduce((sum, exp) => {
        const expDate = new Date(exp.date);
        if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
            return sum + exp.amount;
        }
        return sum;
    }, 0);

    const renderRow = (exp) => (
        <tr key={exp.id} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-6 py-4">{exp.date}</td>
            <td className="px-6 py-4 uppercase text-xs font-bold text-gray-600">{exp.category}</td>
            <td className="px-6 py-4">{exp.description || '-'}</td>
            <td className="px-6 py-4">{exp.payment_method}</td>
            <td className="px-6 py-4 font-semibold text-red-600">-₹{exp.amount.toFixed(2)}</td>
        </tr>
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Expense Tracking</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                    + Log Expense
                </button>
            </div>

            <div className="flex justify-between items-center mb-4">
                <select
                    className="px-4 py-2 border rounded-lg focus:ring-farm-500"
                    value={filterMode}
                    onChange={(e) => setFilterMode(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    <option value="feed">Feed</option>
                    <option value="veterinary">Veterinary</option>
                    <option value="labor">Labor</option>
                    <option value="transport">Transport</option>
                    <option value="electricity">Electricity</option>
                    <option value="misc">Misc</option>
                </select>
                <div className="bg-white px-4 py-2 border rounded shadow-sm text-sm font-semibold">
                    <span className="text-gray-500 mr-2">This Month's Filtered Total:</span>
                    <span className="text-red-600">₹{monthlyTotal.toFixed(2)}</span>
                </div>
            </div>

            {loading ? <div>Loading...</div> : (
                <Table headers={headers} data={filteredExpenses} renderRow={renderRow} />
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Expense">
                <form onSubmit={handleAddSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                            <select required className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                <option value="feed">Feed</option>
                                <option value="veterinary">Veterinary</option>
                                <option value="labor">Labor</option>
                                <option value="transport">Transport</option>
                                <option value="electricity">Electricity</option>
                                <option value="misc">Misc</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Amount (₹)</label>
                            <input required type="number" step="0.01" className="w-full border p-2 rounded" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                            <input required type="date" className="w-full border p-2 rounded" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Payment</label>
                            <select className="w-full border p-2 rounded" value={formData.payment_method} onChange={e => setFormData({ ...formData, payment_method: e.target.value })}>
                                <option value="Cash">Cash</option>
                                <option value="Card">Card</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description / Notes</label>
                        <input type="text" className="w-full border p-2 rounded" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <button type="submit" className="w-full bg-red-600 text-white p-2 rounded mt-4">Save Expense</button>
                </form>
            </Modal>
        </div>
    );
};

export default Expenses;

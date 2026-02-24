import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Table from '../components/Table';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        item_name: '', category: 'feed', quantity: '', unit: '', cost_per_unit: '', low_stock_threshold: ''
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await api.get('/inventory');
            setItems(res.data);
        } catch (error) {
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const quantity = parseFloat(formData.quantity) || 0;
            const cost_per_unit = parseFloat(formData.cost_per_unit) || 0;
            const total_cost = quantity * cost_per_unit;

            await api.post('/inventory', {
                ...formData,
                quantity,
                cost_per_unit,
                total_cost,
                low_stock_threshold: parseFloat(formData.low_stock_threshold) || 0
            });
            toast.success('Item added successfully');
            setIsModalOpen(false);
            fetchInventory();
            setFormData({ item_name: '', category: 'feed', quantity: '', unit: '', cost_per_unit: '', low_stock_threshold: '' });
        } catch (error) {
            toast.error('Failed to add item');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await api.delete(`/inventory/${id}`);
                toast.success('Item deleted');
                fetchInventory();
            } catch (error) {
                toast.error('Failed to delete item');
            }
        }
    };

    const headers = ['Item Name', 'Category', 'Quantity', 'Unit Cost', 'Total Cost', 'Status', 'Actions'];

    const renderRow = (item) => {
        const isLowStock = item.quantity <= item.low_stock_threshold;
        return (
            <tr key={item.id} className={`border-b border-gray-200 hover:bg-gray-50 ${isLowStock ? 'bg-red-50' : ''}`}>
                <td className="px-6 py-4 font-medium">{item.item_name}</td>
                <td className="px-6 py-4 uppercase text-xs">{item.category}</td>
                <td className="px-6 py-4">{item.quantity} {item.unit}</td>
                <td className="px-6 py-4">₹{item.cost_per_unit.toFixed(2)}</td>
                <td className="px-6 py-4">₹{item.total_cost.toFixed(2)}</td>
                <td className="px-6 py-4">
                    {isLowStock ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 font-bold">Low Stock</span>
                    ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Okay</span>
                    )}
                </td>
                <td className="px-6 py-4">
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-farm-600 text-white rounded hover:bg-farm-700 transition"
                >
                    + Add Item
                </button>
            </div>

            {loading ? <div>Loading...</div> : (
                <Table headers={headers} data={items} renderRow={renderRow} />
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Inventory Item">
                <form onSubmit={handleAddSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Item Name</label>
                        <input required type="text" className="w-full border p-2 rounded" value={formData.item_name} onChange={e => setFormData({ ...formData, item_name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                            <select className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                <option value="feed">Feed</option>
                                <option value="medicine">Medicine</option>
                                <option value="equipment">Equipment</option>
                                <option value="supplement">Supplement</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Unit (e.g. kg, ml, bags)</label>
                            <input required type="text" className="w-full border p-2 rounded" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
                            <input required type="number" step="0.1" className="w-full border p-2 rounded" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Cost Per Unit (₹)</label>
                            <input required type="number" step="0.01" className="w-full border p-2 rounded" value={formData.cost_per_unit} onChange={e => setFormData({ ...formData, cost_per_unit: e.target.value })} />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Low Stock Threshold (Warning level)</label>
                            <input type="number" step="0.1" className="w-full border p-2 rounded" value={formData.low_stock_threshold} onChange={e => setFormData({ ...formData, low_stock_threshold: e.target.value })} />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-farm-600 text-white p-2 rounded mt-4">Save Item</button>
                </form>
            </Modal>
        </div>
    );
};

export default Inventory;

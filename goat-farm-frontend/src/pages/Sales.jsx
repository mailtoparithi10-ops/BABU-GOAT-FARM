import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Table from '../components/Table';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        goat_id: '', buyer_name: '', buyer_phone: '', sale_price: '', sale_weight: '', sale_date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const res = await api.get('/sales');
            setSales(res.data);
        } catch (error) {
            toast.error('Failed to load sales');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sales', {
                ...formData,
                goat_id: parseInt(formData.goat_id),
                sale_price: parseFloat(formData.sale_price) || 0,
                sale_weight: parseFloat(formData.sale_weight) || 0
            });
            toast.success('Sale recorded successfully! Profit computed.');
            setIsModalOpen(false);
            fetchSales();
            setFormData({ goat_id: '', buyer_name: '', buyer_phone: '', sale_price: '', sale_weight: '', sale_date: new Date().toISOString().split('T')[0] });
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to record sale. Check if Goat ID exists.');
        }
    };

    const headers = ['Sale Date', 'Goat ID', 'Buyer Name', 'Sale Price', 'Computed Profit'];

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.sale_price, 0);
    const totalProfit = sales.reduce((sum, sale) => sum + (sale.profit || 0), 0);

    const renderRow = (sale) => (
        <tr key={sale.id} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-6 py-4">{sale.sale_date}</td>
            <td className="px-6 py-4 font-bold">{sale.goat_id}</td>
            <td className="px-6 py-4">{sale.buyer_name}</td>
            <td className="px-6 py-4 text-green-700 font-bold">₹{sale.sale_price.toFixed(2)}</td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${sale.profit > 0 ? 'bg-green-100 text-green-800' :
                    sale.profit < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    ₹{(sale.profit || 0).toFixed(2)}
                </span>
            </td>
        </tr>
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Sales Register</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    + Record Sale
                </button>
            </div>

            <div className="flex space-x-6 mb-4">
                <div className="bg-white px-4 py-3 rounded shadow-sm border border-farm-100">
                    <span className="text-gray-500 text-sm block">Total Revenue</span>
                    <span className="text-xl font-bold text-green-600">₹{totalRevenue.toFixed(2)}</span>
                </div>
                <div className="bg-white px-4 py-3 rounded shadow-sm border border-farm-100">
                    <span className="text-gray-500 text-sm block">All-time Profit</span>
                    <span className="text-xl font-bold text-blue-600">₹{totalProfit.toFixed(2)}</span>
                </div>
            </div>

            {loading ? <div>Loading...</div> : (
                <Table headers={headers} data={sales} renderRow={renderRow} />
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Goat Sale">
                <form onSubmit={handleAddSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Goat Database ID</label>
                            <input required type="number" className="w-full border p-2 rounded" value={formData.goat_id} onChange={e => setFormData({ ...formData, goat_id: e.target.value })} placeholder="e.g. 1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Sale Date</label>
                            <input required type="date" className="w-full border p-2 rounded" value={formData.sale_date} onChange={e => setFormData({ ...formData, sale_date: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Buyer Name</label>
                            <input required type="text" className="w-full border p-2 rounded" value={formData.buyer_name} onChange={e => setFormData({ ...formData, buyer_name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Buyer Phone</label>
                            <input type="text" className="w-full border p-2 rounded" value={formData.buyer_phone} onChange={e => setFormData({ ...formData, buyer_phone: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Sale Price (₹)</label>
                            <input required type="number" step="0.01" className="w-full border p-2 rounded" value={formData.sale_price} onChange={e => setFormData({ ...formData, sale_price: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Final Sale Wt (kg)</label>
                            <input type="number" step="0.1" className="w-full border p-2 rounded" value={formData.sale_weight} onChange={e => setFormData({ ...formData, sale_weight: e.target.value })} />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 italic">Note: Saving this will automatically deduct purchase price and individual expenses to calculate live profit, and mark the Goat as sold.</p>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mt-4">Confirm Sale</button>
                </form>
            </Modal>
        </div>
    );
};

export default Sales;

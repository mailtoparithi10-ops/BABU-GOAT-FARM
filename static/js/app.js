// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        loadDashboard();
    }
});

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.dataset.page;
        
        // Update active link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        
        // Show content
        document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
        document.getElementById(`${page}-content`).classList.add('active');
        
        // Load data
        switch(page) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'goats':
                loadGoats();
                break;
            case 'inventory':
                loadInventory();
                break;
            case 'expenses':
                loadExpenses();
                break;
            case 'sales':
                loadSales();
                break;
            case 'users':
                loadUsers();
                break;
        }
    });
});

// Dashboard
async function loadDashboard() {
    try {
        const stats = await api.get('/dashboard/stats');
        document.getElementById('total-goats').textContent = stats.total_goats;
        document.getElementById('total-sales').textContent = `₹${stats.total_sales.toLocaleString()}`;
        document.getElementById('total-expenses').textContent = `₹${stats.total_expenses.toLocaleString()}`;
        document.getElementById('net-profit').textContent = `₹${stats.net_profit.toLocaleString()}`;
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
}

// Goats
async function loadGoats() {
    try {
        const goats = await api.get('/goats');
        const tbody = document.getElementById('goats-table-body');
        tbody.innerHTML = goats.map(goat => `
            <tr>
                <td>${goat.tag_number}</td>
                <td>${goat.breed}</td>
                <td>${goat.gender}</td>
                <td>${goat.date_of_birth}</td>
                <td>${goat.weight}</td>
                <td>${goat.status}</td>
                <td>
                    <button class="btn btn-edit" onclick="editGoat(${goat.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteGoat(${goat.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Failed to load goats:', error);
    }
}

function showAddGoatModal() {
    document.getElementById('modal-body').innerHTML = `
        <h2>Add Goat</h2>
        <form id="add-goat-form">
            <div class="form-group">
                <label>Tag Number</label>
                <input type="text" id="tag_number" required>
            </div>
            <div class="form-group">
                <label>Breed</label>
                <input type="text" id="breed" required>
            </div>
            <div class="form-group">
                <label>Gender</label>
                <select id="gender" required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
            <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" id="date_of_birth" required>
            </div>
            <div class="form-group">
                <label>Weight (kg)</label>
                <input type="number" step="0.1" id="weight" required>
            </div>
            <div class="form-group">
                <label>Status</label>
                <select id="status" required>
                    <option value="Active">Active</option>
                    <option value="Sold">Sold</option>
                    <option value="Deceased">Deceased</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Add Goat</button>
        </form>
    `;
    
    document.getElementById('add-goat-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await api.post('/goats', {
                tag_number: document.getElementById('tag_number').value,
                breed: document.getElementById('breed').value,
                gender: document.getElementById('gender').value,
                date_of_birth: document.getElementById('date_of_birth').value,
                weight: parseFloat(document.getElementById('weight').value),
                status: document.getElementById('status').value
            });
            closeModal();
            loadGoats();
        } catch (error) {
            alert('Failed to add goat: ' + error.message);
        }
    });
    
    showModal();
}

async function deleteGoat(id) {
    if (confirm('Are you sure you want to delete this goat?')) {
        try {
            await api.delete(`/goats/${id}`);
            loadGoats();
        } catch (error) {
            alert('Failed to delete goat: ' + error.message);
        }
    }
}

// Inventory
async function loadInventory() {
    try {
        const items = await api.get('/inventory');
        const tbody = document.getElementById('inventory-table-body');
        tbody.innerHTML = items.map(item => `
            <tr>
                <td>${item.item_name}</td>
                <td>${item.category}</td>
                <td>${item.quantity}</td>
                <td>${item.unit}</td>
                <td>
                    <button class="btn btn-edit" onclick="editInventory(${item.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteInventory(${item.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Failed to load inventory:', error);
    }
}

function showAddInventoryModal() {
    document.getElementById('modal-body').innerHTML = `
        <h2>Add Inventory Item</h2>
        <form id="add-inventory-form">
            <div class="form-group">
                <label>Item Name</label>
                <input type="text" id="item_name" required>
            </div>
            <div class="form-group">
                <label>Category</label>
                <select id="category" required>
                    <option value="Feed">Feed</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" step="0.1" id="quantity" required>
            </div>
            <div class="form-group">
                <label>Unit</label>
                <input type="text" id="unit" required>
            </div>
            <button type="submit" class="btn btn-primary">Add Item</button>
        </form>
    `;
    
    document.getElementById('add-inventory-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await api.post('/inventory', {
                item_name: document.getElementById('item_name').value,
                category: document.getElementById('category').value,
                quantity: parseFloat(document.getElementById('quantity').value),
                unit: document.getElementById('unit').value
            });
            closeModal();
            loadInventory();
        } catch (error) {
            alert('Failed to add item: ' + error.message);
        }
    });
    
    showModal();
}

async function deleteInventory(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            await api.delete(`/inventory/${id}`);
            loadInventory();
        } catch (error) {
            alert('Failed to delete item: ' + error.message);
        }
    }
}

// Expenses
async function loadExpenses() {
    try {
        const expenses = await api.get('/expenses');
        const tbody = document.getElementById('expenses-table-body');
        tbody.innerHTML = expenses.map(expense => `
            <tr>
                <td>${expense.date}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td>₹${expense.amount.toLocaleString()}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Failed to load expenses:', error);
    }
}

function showAddExpenseModal() {
    document.getElementById('modal-body').innerHTML = `
        <h2>Add Expense</h2>
        <form id="add-expense-form">
            <div class="form-group">
                <label>Date</label>
                <input type="date" id="date" required>
            </div>
            <div class="form-group">
                <label>Category</label>
                <select id="category" required>
                    <option value="Feed">Feed</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Labor">Labor</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="description" required></textarea>
            </div>
            <div class="form-group">
                <label>Amount (₹)</label>
                <input type="number" step="0.01" id="amount" required>
            </div>
            <button type="submit" class="btn btn-primary">Add Expense</button>
        </form>
    `;
    
    document.getElementById('add-expense-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await api.post('/expenses', {
                date: document.getElementById('date').value,
                category: document.getElementById('category').value,
                description: document.getElementById('description').value,
                amount: parseFloat(document.getElementById('amount').value)
            });
            closeModal();
            loadExpenses();
        } catch (error) {
            alert('Failed to add expense: ' + error.message);
        }
    });
    
    showModal();
}

async function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        try {
            await api.delete(`/expenses/${id}`);
            loadExpenses();
        } catch (error) {
            alert('Failed to delete expense: ' + error.message);
        }
    }
}

// Sales
async function loadSales() {
    try {
        const sales = await api.get('/sales');
        const tbody = document.getElementById('sales-table-body');
        tbody.innerHTML = sales.map(sale => `
            <tr>
                <td>${sale.date}</td>
                <td>${sale.goat_tag_number}</td>
                <td>${sale.buyer_name}</td>
                <td>₹${sale.amount.toLocaleString()}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteSale(${sale.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Failed to load sales:', error);
    }
}

function showAddSaleModal() {
    document.getElementById('modal-body').innerHTML = `
        <h2>Add Sale</h2>
        <form id="add-sale-form">
            <div class="form-group">
                <label>Date</label>
                <input type="date" id="date" required>
            </div>
            <div class="form-group">
                <label>Goat ID</label>
                <input type="number" id="goat_id" required>
            </div>
            <div class="form-group">
                <label>Buyer Name</label>
                <input type="text" id="buyer_name" required>
            </div>
            <div class="form-group">
                <label>Buyer Contact</label>
                <input type="text" id="buyer_contact">
            </div>
            <div class="form-group">
                <label>Amount (₹)</label>
                <input type="number" step="0.01" id="amount" required>
            </div>
            <button type="submit" class="btn btn-primary">Add Sale</button>
        </form>
    `;
    
    document.getElementById('add-sale-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await api.post('/sales', {
                date: document.getElementById('date').value,
                goat_id: parseInt(document.getElementById('goat_id').value),
                buyer_name: document.getElementById('buyer_name').value,
                buyer_contact: document.getElementById('buyer_contact').value,
                amount: parseFloat(document.getElementById('amount').value)
            });
            closeModal();
            loadSales();
        } catch (error) {
            alert('Failed to add sale: ' + error.message);
        }
    });
    
    showModal();
}

async function deleteSale(id) {
    if (confirm('Are you sure you want to delete this sale?')) {
        try {
            await api.delete(`/sales/${id}`);
            loadSales();
        } catch (error) {
            alert('Failed to delete sale: ' + error.message);
        }
    }
}

// Users (Admin only)
async function loadUsers() {
    try {
        const users = await api.get('/auth/users');
        const tbody = document.getElementById('users-table-body');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.is_active ? 'Active' : 'Inactive'}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

function showAddUserModal() {
    document.getElementById('modal-body').innerHTML = `
        <h2>Add User</h2>
        <form id="add-user-form">
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="name" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="email" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="password" required>
            </div>
            <div class="form-group">
                <label>Role</label>
                <select id="role" required>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Add User</button>
        </form>
    `;
    
    document.getElementById('add-user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                role: document.getElementById('role').value
            });
            closeModal();
            loadUsers();
        } catch (error) {
            alert('Failed to add user: ' + error.message);
        }
    });
    
    showModal();
}

async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await api.delete(`/auth/users/${id}`);
            loadUsers();
        } catch (error) {
            alert('Failed to delete user: ' + error.message);
        }
    }
}

// Modal Functions
function showModal() {
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

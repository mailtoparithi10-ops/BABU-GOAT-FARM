// Authentication Functions
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (!token || !user) {
        showPage('login');
        return false;
    }
    
    showPage('dashboard');
    document.getElementById('user-name').textContent = user.name;
    
    // Hide admin-only elements if not admin
    if (user.role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    }
    
    return true;
}

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(`${pageName}-page`).classList.remove('hidden');
}

// Login Form Handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    
    try {
        const data = await api.post('/auth/login', { email, password });
        
        localStorage.setItem('token', data.access_token);
        
        // Get user info
        const user = await api.get('/auth/me');
        localStorage.setItem('user', JSON.stringify(user));
        
        window.location.reload();
    } catch (error) {
        errorEl.textContent = error.message || 'Login failed';
    }
});

// Logout Handler
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
});

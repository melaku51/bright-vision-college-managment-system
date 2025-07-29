import { auth } from './auth.js';

// Initialize common functionality
document.addEventListener('DOMContentLoaded', () => {
    // Update UI based on auth status
    updateAuthUI();
    
    // Load dashboard stats if on home page
    if (window.location.pathname.includes('index.html')) {
        loadDashboardStats();
    }
});

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) return;
    
    if (auth.isAuthenticated()) {
        loginBtn.innerHTML = '<a href="#" id="logoutBtn">Logout</a>';
        document.getElementById('logoutBtn').addEventListener('click', auth.logout);
    } else {
        loginBtn.innerHTML = '<a href="#">Login</a>';
    }
}

async function loadDashboardStats() {
    try {
        // In a real app, you'd have API endpoints for these stats
        document.getElementById('totalStudents').textContent = 'Loading...';
        document.getElementById('recentPayments').textContent = 'Loading...';
        
        // Simulate API calls
        setTimeout(() => {
            document.getElementById('totalStudents').textContent = '124';
            document.getElementById('recentPayments').textContent = '$12,450';
        }, 1000);
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
    }
}
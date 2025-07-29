// Modal open/close logic
document.getElementById('loginBtn').onclick = function(e) {
    e.preventDefault();
    document.getElementById('loginModal').style.display = 'block';
};
document.getElementById('closeLogin').onclick = function() {
    document.getElementById('loginModal').style.display = 'none';
};
window.onclick = function(event) {
    if (event.target == document.getElementById('loginModal')) {
        document.getElementById('loginModal').style.display = 'none';
    }
};

// Switch between login and register forms
document.getElementById('showRegister').onclick = function(e) {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Create Account';
};
document.getElementById('showLogin').onclick = function(e) {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('modalTitle').textContent = 'Admin Login';
};

// Login form submit
document.getElementById('loginForm').onsubmit = async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    errorDiv.style.display = 'none';

    try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });
        if (response.ok) {
            document.getElementById('loginModal').style.display = 'none';
            alert('Login successful!');
            // Optionally: window.location.reload();
        } else {
            const data = await response.json();
            errorDiv.textContent = data.detail || 'Login failed';
            errorDiv.style.display = 'block';
        }
    } catch (err) {
        errorDiv.textContent = 'Network error';
        errorDiv.style.display = 'block';
    }
};

// Register form submit
document.getElementById('registerForm').onsubmit = async function(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const errorDiv = document.getElementById('registerError');
    errorDiv.style.display = 'none';

    try {
        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });
        if (response.ok) {
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('modalTitle').textContent = 'Admin Login';
            alert('Registration successful! You can now log in.');
        } else {
            const data = await response.json();
            errorDiv.textContent = data.detail || 'Registration failed';
            errorDiv.style.display = 'block';
        }
    } catch (err) {
        errorDiv.textContent = 'Network error';
        errorDiv.style.display = 'block';
    }
};
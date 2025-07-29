const API_BASE_URL = 'http://localhost:8000'; // Change in production

// Helper function for API requests
async function makeApiRequest(endpoint, method = 'GET', body = null, requiresAuth = true) {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (requiresAuth) {
        const token = localStorage.getItem('authToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    const config = {
        method,
        headers,
    };
    
    if (body) {
        config.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `API request failed with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// Student API functions
export const studentApi = {
    getAll: () => makeApiRequest('/students/'),
    getById: (id) => makeApiRequest(`/students/${id}`),
    create: (studentData) => makeApiRequest('/students/', 'POST', studentData),
    update: (id, studentData) => makeApiRequest(`/students/${id}`, 'PUT', studentData),
    delete: (id) => makeApiRequest(`/students/${id}`, 'DELETE'),
    search: (query) => makeApiRequest(`/students/search?q=${query}`),
};

// Payment API functions
export const paymentApi = {
    getAll: () => makeApiRequest('/payments/'),
    getByStudentId: (studentId) => makeApiRequest(`/payments/student/${studentId}`),
    create: (paymentData) => makeApiRequest('/payments/', 'POST', paymentData),
    getStats: () => makeApiRequest('/payments/stats'),
};
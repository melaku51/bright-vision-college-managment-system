import { paymentApi, studentApi } from './api.js';
import { auth } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!auth.isAuthenticated()) return;
    
    // Load initial data
    await loadPayments();
    
    // Setup event listeners
    document.getElementById('paymentForm').addEventListener('submit', handlePaymentSubmit);
    document.getElementById('findStudentBtn').addEventListener('click', findStudent);
    document.getElementById('paymentFilter').addEventListener('change', filterPayments);
});

async function loadPayments(filter = 'all') {
    try {
        showLoading('#paymentsTableBody', '#loadingPayments');
        const payments = await paymentApi.getAll(); // In a real app, you'd filter server-side
        displayPayments(payments);
    } catch (error) {
        showError('Failed to load payments. Please try again.');
    }
}

function displayPayments(payments) {
    const tableBody = document.getElementById('paymentsTableBody');
    tableBody.innerHTML = '';
    
    if (payments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">No payments found</td></tr>';
        return;
    }
    
    payments.forEach(payment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(payment.payment_date)}</td>
            <td>${payment.student.student_id}</td>
            <td>$${payment.amount.toFixed(2)}</td>
            <td>${payment.payment_method}</td>
            <td><span class="status ${payment.status}">${payment.status}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

async function findStudent() {
    const studentId = document.getElementById('paymentStudentId').value.trim();
    
    if (!studentId) {
        alert('Please enter a student ID');
        return;
    }
    
    try {
        const student = await studentApi.getById(studentId);
        displayStudentInfo(student);
    } catch (error) {
        showError('Student not found. Please check the ID.');
    }
}

function displayStudentInfo(student) {
    const infoDiv = document.getElementById('studentInfo');
    document.getElementById('studentName').textContent = `${student.first_name} ${student.last_name}`;
    
    // In a real app, you'd calculate the balance from the API
    document.getElementById('studentBalance').textContent = '$0.00'; 
    
    infoDiv.classList.remove('hidden');
}

async function handlePaymentSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const paymentData = {
        student_id: form.paymentStudentId.value,
        amount: parseFloat(form.amount.value),
        payment_method: form.paymentMethod.value,
        description: form.paymentDescription.value,
    };
    
    if (!paymentData.student_id || !paymentData.amount || !paymentData.payment_method) {
        alert('Please fill all required fields');
        return;
    }
    
    try {
        const payment = await paymentApi.create(paymentData);
        alert(`Payment processed successfully! Transaction ID: ${payment.transaction_id}`);
        form.reset();
        document.getElementById('studentInfo').classList.add('hidden');
        await loadPayments();
    } catch (error) {
        showError('Payment failed. Please try again.');
    }
}

function filterPayments() {
    const filter = document.getElementById('paymentFilter').value;
    // In a real app, you would make an API call with the filter
    // For now, we'll just reload all payments
    loadPayments(filter);
}

// Helper functions (similar to students.js)
function showLoading(tableSelector, loaderSelector) {
    document.querySelector(tableSelector).innerHTML = '';
    document.querySelector(loaderSelector).classList.remove('hidden');
}

function hideLoading(loaderSelector) {
    document.querySelector(loaderSelector).classList.add('hidden');
}

function showError(message) {
    alert(message);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
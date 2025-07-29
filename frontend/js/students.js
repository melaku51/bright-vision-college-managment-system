import { studentApi } from './api.js';
import { auth } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!auth.isAuthenticated()) return;
    
    // Load students on page load
    await loadStudents();
    
    // Setup event listeners
    document.getElementById('addStudentBtn').addEventListener('click', showStudentModal);
    document.getElementById('studentForm').addEventListener('submit', handleStudentFormSubmit);
    document.getElementById('cancelStudentBtn').addEventListener('click', hideStudentModal);
    document.getElementById('studentSearch').addEventListener('input', searchStudents);
});

async function loadStudents() {
    try {
        showLoading('#studentsTableBody', '#loadingStudents');
        const students = await studentApi.getAll();
        displayStudents(students);
    } catch (error) {
        showError('Failed to load students. Please try again.');
    }
}

function displayStudents(students) {
    const tableBody = document.getElementById('studentsTableBody');
    tableBody.innerHTML = '';
    
    if (students.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">No students found</td></tr>';
        return;
    }
    
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.student_id}</td>
            <td>${student.first_name} ${student.last_name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${formatDate(student.enrollment_date)}</td>
            <td>
                <button class="btn-action edit" data-id="${student.id}">Edit</button>
                <button class="btn-action delete" data-id="${student.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.btn-action.edit').forEach(btn => {
        btn.addEventListener('click', () => editStudent(btn.dataset.id));
    });
    
    document.querySelectorAll('.btn-action.delete').forEach(btn => {
        btn.addEventListener('click', () => deleteStudent(btn.dataset.id));
    });
}

async function searchStudents() {
    const query = document.getElementById('studentSearch').value.trim();
    
    if (query.length < 2) {
        await loadStudents();
        return;
    }
    
    try {
        showLoading('#studentsTableBody', '#loadingStudents');
        const students = await studentApi.search(query);
        displayStudents(students);
    } catch (error) {
        showError('Search failed. Please try again.');
    }
}

function showStudentModal(student = null) {
    const modal = document.getElementById('studentModal');
    const form = document.getElementById('studentForm');
    const title = document.getElementById('modalTitle');
    
    if (student) {
        title.textContent = 'Edit Student';
        document.getElementById('studentId').value = student.id;
        document.getElementById('firstName').value = student.first_name;
        document.getElementById('lastName').value = student.last_name;
        document.getElementById('email').value = student.email;
        document.getElementById('phone').value = student.phone;
        document.getElementById('address').value = student.address || '';
        document.getElementById('dob').value = student.date_of_birth;
        document.getElementById('gender').value = student.gender;
    } else {
        title.textContent = 'Add New Student';
        form.reset();
    }
    
    modal.style.display = 'block';
}

function hideStudentModal() {
    document.getElementById('studentModal').style.display = 'none';
}

async function handleStudentFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const studentId = form.studentId.value;
    const studentData = {
        first_name: form.firstName.value,
        last_name: form.lastName.value,
        email: form.email.value,
        phone: form.phone.value,
        address: form.address.value,
        date_of_birth: form.dob.value,
        gender: form.gender.value,
    };
    
    try {
        if (studentId) {
            await studentApi.update(studentId, studentData);
        } else {
            await studentApi.create(studentData);
        }
        
        hideStudentModal();
        await loadStudents();
    } catch (error) {
        showError('Failed to save student. Please try again.');
    }
}

async function editStudent(id) {
    try {
        const student = await studentApi.getById(id);
        showStudentModal(student);
    } catch (error) {
        showError('Failed to load student details.');
    }
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
        await studentApi.delete(id);
        await loadStudents();
    } catch (error) {
        showError('Failed to delete student.');
    }
}

// Helper functions
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
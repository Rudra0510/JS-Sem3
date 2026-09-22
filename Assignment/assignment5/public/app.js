const API_URL = '/api/requests';

const requestForm = document.getElementById('requestForm');
const requestIdInput = document.getElementById('requestId');
const studentNameInput = document.getElementById('studentName');
const emailInput = document.getElementById('email');
const categoryInput = document.getElementById('category');
const descriptionInput = document.getElementById('description');
const priorityInput = document.getElementById('priority');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const requestsList = document.getElementById('requestsList');

// Fetch and display requests on initial load
document.addEventListener('DOMContentLoaded', fetchRequests);

// 1. GET Requests
async function fetchRequests() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        renderRequests(data);
    } catch (err) {
        console.error('Error fetching requests:', err);
    }
}

// Render list into DOM
function renderRequests(requests) {
    requestsList.innerHTML = '';
    
    if (requests.length === 0) {
        requestsList.innerHTML = '<p>No requests submitted yet.</p>';
        return;
    }

    requests.forEach(req => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h4>${req.studentName} <span class="badge ${req.priority}">${req.priority}</span></h4>
            <p><strong>Email:</strong> ${req.email} | <strong>Category:</strong> ${req.category}</p>
            <p>${req.description}</p>
            <div class="actions">
                <button class="btn-edit" onclick="setupEdit('${req.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteRequest('${req.id}')">Delete</button>
            </div>
        `;
        requestsList.appendChild(card);
    });
}

// 2. POST / PUT Request
requestForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        studentName: studentNameInput.value,
        email: emailInput.value,
        category: categoryInput.value,
        description: descriptionInput.value,
        priority: priorityInput.value
    };

    const id = requestIdInput.value;

    try {
        if (id) {
            // PUT Update
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // POST Create
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        resetForm();
        fetchRequests();
    } catch (err) {
        console.error('Error saving request:', err);
    }
});

// 3. Populate Form for Editing
async function setupEdit(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const req = await res.json();

        requestIdInput.value = req.id;
        studentNameInput.value = req.studentName;
        emailInput.value = req.email;
        categoryInput.value = req.category;
        descriptionInput.value = req.description;
        priorityInput.value = req.priority;

        submitBtn.textContent = 'Update Request';
        cancelBtn.style.display = 'inline-block';
    } catch (err) {
        console.error('Error loading item for edit:', err);
    }
}

// 4. DELETE Request
async function deleteRequest(id) {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchRequests();
    } catch (err) {
        console.error('Error deleting request:', err);
    }
}

// Reset form UI
function resetForm() {
    requestIdInput.value = '';
    requestForm.reset();
    submitBtn.textContent = 'Submit Request';
    cancelBtn.style.display = 'none';
}
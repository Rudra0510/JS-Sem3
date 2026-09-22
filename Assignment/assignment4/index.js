const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'requests.json');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper functions to read/write JSON file
const readRequests = () => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]', 'utf8');
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
};

const writeRequests = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// 1. GET /api/requests - Fetch all requests
app.get('/api/requests', (req, res) => {
    try {
        const requests = readRequests();
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Error reading data' });
    }
});

// 2. GET /api/requests/:id - Fetch single request
app.get('/api/requests/:id', (req, res) => {
    try {
        const requests = readRequests();
        const request = requests.find(r => r.id === req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching request' });
    }
});

// 3. POST /api/requests - Create new request
app.post('/api/requests', (req, res) => {
    try {
        const { studentName, email, category, description, priority } = req.body;
        
        if (!studentName || !email || !category || !description || !priority) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const requests = readRequests();
        const newRequest = {
            id: Date.now().toString(),
            studentName,
            email,
            category,
            description,
            priority,
            createdAt: new Date().toISOString()
        };

        requests.push(newRequest);
        writeRequests(requests);

        res.status(201).json(newRequest);
    } catch (err) {
        res.status(500).json({ message: 'Error creating request' });
    }
});

// 4. PUT /api/requests/:id - Update existing request
app.put('/api/requests/:id', (req, res) => {
    try {
        const requests = readRequests();
        const index = requests.findIndex(r => r.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const { studentName, email, category, description, priority } = req.body;

        requests[index] = {
            ...requests[index],
            studentName: studentName || requests[index].studentName,
            email: email || requests[index].email,
            category: category || requests[index].category,
            description: description || requests[index].description,
            priority: priority || requests[index].priority
        };

        writeRequests(requests);
        res.json(requests[index]);
    } catch (err) {
        res.status(500).json({ message: 'Error updating request' });
    }
});

// 5. DELETE /api/requests/:id - Delete a request
app.delete('/api/requests/:id', (req, res) => {
    try {
        let requests = readRequests();
        const initialLength = requests.length;
        
        requests = requests.filter(r => r.id !== req.params.id);

        if (requests.length === initialLength) {
            return res.status(404).json({ message: 'Request not found' });
        }

        writeRequests(requests);
        res.json({ message: 'Request deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting request' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to save venue data
app.post('/api/save_venue', (req, res) => {
    const { name, address, city, state } = req.body;
    
    // Validate required fields
    if (!name || !address || !city || !state) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const venue = {
        ...req.body,
        created_at: new Date().toISOString()
    };

    // Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    // Read existing venues
    const venuesFile = path.join(dataDir, 'venues.json');
    let venues = [];
    if (fs.existsSync(venuesFile)) {
        venues = JSON.parse(fs.readFileSync(venuesFile));
    }

    // Add new venue and save
    venues.push(venue);
    fs.writeFileSync(venuesFile, JSON.stringify(venues, null, 2));

    res.json({ success: true, venue });
});

// API endpoint to get venues
app.get('/api/venues', (req, res) => {
    const venuesFile = path.join(__dirname, 'data', 'venues.json');
    if (!fs.existsSync(venuesFile)) {
        return res.json([]);
    }
    const venues = JSON.parse(fs.readFileSync(venuesFile));
    res.json(venues);
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 
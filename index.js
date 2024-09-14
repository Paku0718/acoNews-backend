const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base route to check if the server is running
app.get('/', (req, res) => {
    res.send('Gnews API backend is running');
});

// /news route to fetch news articles
app.get('/news', async (req, res) => {
    const searchQuery = req.query.q || 'latest'; // Default query if no search term is provided
    const country = req.query.country || 'us'; // Default country (you can set this to any)
    const category = req.query.category || ''; // Category filter (leave empty if no category specified)
    const lang = req.query.lang || 'en'
    const page = req.query.page || 1; // Pagination page number
    const maxResults = req.query.max || 10; // Results per page (default is 10)
    const apiKey = process.env.GNEWS_API_KEY 

    // Build the gnews API URL
    let apiUrl = `https://gnews.io/api/v4/search?q=${searchQuery}&token=${apiKey}&lang=en&page=${page}&max=${maxResults}`;
    
    // Append country if provided
    if (country) {
        apiUrl += `&country=${country}`;
        
    }

    // Append category if provided
    if (category) {
        apiUrl += `&category=${category}`;
    }

     // Append languages if provided
     if (lang) {
        apiUrl += `&lang=${lang}`;
    }

    // console.log('Requesting URL:', apiUrl); 

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Return the fetched data
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

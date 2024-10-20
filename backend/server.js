// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Ensure CORS is enabled
app.use(express.json());

// Check for missing environment variables
if (!process.env.MONGO_URI) {
    console.error('Error: Missing MONGO_URI in environment variables');
    process.exit(1);
}

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected to RealTimeWeather'))
    .catch(err => console.error('MongoDB connection error:', err));

// Daily Summary Schema
const summarySchema = new mongoose.Schema({
    avgTemp: { type: Number, required: true },
    maxTemp: { type: Number, required: true },
    minTemp: { type: Number, required: true },
    avgWindSpeed: { type: Number, required: true },
    avgHumidity: { type: Number, required: true },
    dominantCondition: { type: String, required: true },
    date: { type: String, required: true }, // Ensure this is saved as a string for easier querying
}, { collection: 'DailySummary' });

const DailySummary = mongoose.model('DailySummary', summarySchema);

// API endpoint to save daily summary
app.post('/summaries', async (req, res) => {
    console.log('Received daily summary:', req.body); // Log the incoming request body

    const { avgTemp, maxTemp, minTemp, avgWindSpeed, avgHumidity, dominantCondition, date } = req.body;

    // Parse string values to numbers where necessary
    const parsedAvgHumidity = parseFloat(avgHumidity);
    const parsedAvgWindSpeed = parseFloat(avgWindSpeed);

    if (!avgTemp || !maxTemp || !minTemp || isNaN(parsedAvgWindSpeed) || isNaN(parsedAvgHumidity) || !dominantCondition || !date) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const summaryData = new DailySummary({
            avgTemp: parseFloat(avgTemp),
            maxTemp: parseFloat(maxTemp),
            minTemp: parseFloat(minTemp),
            avgWindSpeed: parsedAvgWindSpeed,
            avgHumidity: parsedAvgHumidity,
            dominantCondition,
            date
        });
        await summaryData.save();
        res.status(201).send('Daily summary saved successfully');
    } catch (error) {
        console.error('Error saving summary:', error.message); // Updated logging for detailed error messages
        res.status(500).send('Error saving summary');
    }
});

// API endpoint to retrieve daily summaries
app.get('/summaries', async (req, res) => {
    try {
        const summaries = await DailySummary.find().sort({ date: -1 });
        res.status(200).json(summaries);
    } catch (error) {
        console.error('Error retrieving summaries:', error.message);
        res.status(500).send('Error retrieving summaries');
    }
});


// Start the server
const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0'; // This makes it accessible from any IPv4 address
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});


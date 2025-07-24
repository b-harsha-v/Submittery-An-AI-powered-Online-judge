// index.js
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./database/db.js');
const authRoutes = require('./routes/authRoutes.js');
const problemRoutes = require('./routes/problemRoutes.js'); // Import problem routes
const submissionRoutes = require('./routes/submissionRoutes.js');
const aiRoutes = require('./routes/aiRoutes.js');


// Load env vars


// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Your Vite dev server URL
    credentials: true,
}));
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(cookieParser()); // To parse cookies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/ai', aiRoutes);

// Simple root route
app.get('/', (req, res) => {
    res.send('Submittery API is running...');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
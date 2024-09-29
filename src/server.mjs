import express from 'express';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import apiRoutes from './routes/api.mjs';
import deviceRoutes from './routes/deviceRoutes.mjs';
import conversionRoutes from './routes/conversionRoutes.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Database setup
const db = new sqlite3.Database('./database/database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  } //error handling the connection to the database
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); //setting the view engine to ejs and the views to the views folder

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index'); //rendering the index page
});

app.get('/device-leaderboard', (req, res) => {
    res.render('deviceLeaderboard'); //rendering the device leaderboard page
});

app.get('/usage-statistics', (req, res) => {
    res.render('usageStatistics'); //rendering the usage statistics page
});

app.get('/search-location', (req, res) => {
    res.render('locationSelection'); //rendering the location selection page
});

// API routes
app.use('/api', apiRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/conversions', conversionRoutes);

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).render('error', { message: 'Page not found' }); //rendering the error page
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Something went wrong!' }); //rendering the error page
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`); //logging the server to the console
});

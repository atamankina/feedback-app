import express from 'express';
import cors from 'cors';
import feedbackRoutes from './routes.js';  // Import der Routen
import { createTable } from './db.js';     // Import der Datenbanklogik

// Erstellen der Express-App
const app = express();
const PORT = 3000;

// Setup CORS und JSON-Middleware
app.use(cors());
app.use(express.json());

// Routen einbinden
app.use('/', feedbackRoutes);

// Tabelle erstellen
createTable();

// Server starten
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

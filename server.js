import express from 'express';
import cors from 'cors';
import feedbackRoutes from './routes/feedbackRoutes.js';
import { createTable } from './db.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Express-App erstellen
const app = express();
const PORT = 3000;

// Setup CORS und JSON-Parsing-Middleware
app.use(cors());
app.use(express.json());

// Routen einbinden
app.use('/', feedbackRoutes);

// Fehlerbehandlungsmiddleware
app.use(errorHandler);

// Datenbanktabelle erstellen
createTable();

// Server starten
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

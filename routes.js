import express from 'express';
import { pool } from './db.js';  // Import der Datenbankverbindung

const router = express.Router();

// POST /feedback - fügt neues Feedback hinzu
router.post('/feedback', async (req, res) => {
    try {
        const { title, text } = req.body;
        if (!title || !text) {
            return res.status(400).json({ error: 'Title and text are required.' });
        }

        const result = await pool.query(
            'INSERT INTO feedback (title, text) VALUES ($1, $2) RETURNING *',
            [title, text]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding feedback: ', error);
        res.status(500).json({ error: 'An error occurred while adding feedback.' });
    }
});

// GET /feedback - listet alle Feedback-Einträge
router.get('/feedback', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM feedback');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving feedback: ', error);
        res.status(500).json({ error: 'An error occurred while retrieving feedback.' });
    }
});

// DELETE /feedback/:id - löscht einen Feedback-Eintrag
router.delete('/feedback/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM feedback WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Feedback not found.' });
        }

        res.status(200).json({ message: 'Feedback deleted successfully.' });
    } catch (error) {
        console.error('Error deleting feedback: ', error);
        res.status(500).json({ error: 'An error occurred while deleting feedback.' });
    }
});

export default router;

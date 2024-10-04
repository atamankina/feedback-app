import { pool } from '../db.js';

// Hinzufügen eines neuen Feedbacks
export const addFeedback = async (title, text) => {
    const result = await pool.query(
        'INSERT INTO feedback (title, text) VALUES ($1, $2) RETURNING *',
        [title, text]
    );
    return result.rows[0];
};

// Abrufen aller Feedback-Einträge
export const getAllFeedback = async () => {
    const result = await pool.query('SELECT * FROM feedback');
    return result.rows;
};

// Löschen eines Feedback-Eintrags anhand der ID
export const deleteFeedbackById = async (id) => {
    const result = await pool.query('DELETE FROM feedback WHERE id = $1 RETURNING *', [id]);
    return result;
};

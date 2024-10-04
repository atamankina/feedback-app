import express from 'express';
import { addFeedback, getAllFeedback, deleteFeedbackById } from '../controllers/feedbackController.js';
import { feedbackValidation } from '../middlewares/validation.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const router = express.Router();

// POST /feedback - fügt neues Feedback hinzu
router.post('/feedback', feedbackValidation, async (req, res) => {
    try {
        const { title, text } = req.body;
        const newFeedback = await addFeedback(title, text);
        res.status(201).json({ message: 'Feedback added successfully', data: newFeedback });
    } catch (error) {
        sendError(res, 'An error occurred while adding feedback.');
    }
});

// GET /feedback - listet alle Feedback-Einträge
router.get('/feedback', async (req, res) => {
    try {
        const feedback = await getAllFeedback();
        sendSuccess(res, feedback, 'Feedback retrieved successfully');
    } catch (error) {
        sendError(res, 'An error occurred while retrieving feedback.');
    }
});

// DELETE /feedback/:id - löscht einen Feedback-Eintrag
router.delete('/feedback/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteFeedbackById(id);
        if (result.rowCount === 0) {
            return sendError(res, 'Feedback not found.', 404);
        }
        sendSuccess(res, null, 'Feedback deleted successfully');
    } catch (error) {
        sendError(res, 'An error occurred while deleting feedback.');
    }
});

export default router;

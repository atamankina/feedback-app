import { body, validationResult } from 'express-validator';

// Validierung der Feedback-Eingaben
export const feedbackValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('text').notEmpty().withMessage('Text is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

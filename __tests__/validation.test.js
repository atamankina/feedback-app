// __tests__/validation.test.js
import { feedbackValidation } from '../middlewares/validation';
import { validationResult } from 'express-validator';
import express from 'express';
import request from 'supertest';

const app = express();
app.use(express.json());

app.post('/feedback', feedbackValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.status(200).json({ message: 'Validation passed' });
});

describe('Validation Middleware', () => {
    it('should fail validation when title is missing', async () => {
        const response = await request(app).post('/feedback').send({ text: 'Some text' });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Title is required');
    });

    it('should pass validation when both title and text are provided', async () => {
        const response = await request(app).post('/feedback').send({ title: 'Test', text: 'Test text' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Validation passed');
    });
});

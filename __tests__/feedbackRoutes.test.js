// __tests__/feedbackRoutes.test.js
import request from 'supertest';
import express from 'express';
import feedbackRoutes from '../routes/feedbackRoutes';
import { addFeedback, getAllFeedback, deleteFeedbackById } from '../controllers/feedbackController';

jest.mock('../controllers/feedbackController', () => ({
    addFeedback: jest.fn(),
    getAllFeedback: jest.fn(),
    deleteFeedbackById: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/', feedbackRoutes);

describe('Feedback Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('POST /feedback - should add feedback and return 201', async () => {
        const mockFeedback = { id: 1, title: 'Test Feedback', text: 'Test text' };
        addFeedback.mockResolvedValue(mockFeedback);

        const response = await request(app)
            .post('/feedback')
            .send({ title: 'Test Feedback', text: 'Test text' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Feedback added successfully');
        expect(response.body.data).toEqual(mockFeedback);
    });

    it('GET /feedback - should return all feedback', async () => {
        const mockFeedback = [{ id: 1, title: 'Test Feedback', text: 'Test text' }];
        getAllFeedback.mockResolvedValue(mockFeedback);

        const response = await request(app).get('/feedback');

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(mockFeedback);
    });

    it('DELETE /feedback/:id - should delete feedback and return 200', async () => {
        deleteFeedbackById.mockResolvedValue({ rowCount: 1 });

        const response = await request(app).delete('/feedback/1');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Feedback deleted successfully');
    });

    it('DELETE /feedback/:id - should return 404 if feedback not found', async () => {
        deleteFeedbackById.mockResolvedValue({ rowCount: 0 });

        const response = await request(app).delete('/feedback/999');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Feedback not found.');
    });
});

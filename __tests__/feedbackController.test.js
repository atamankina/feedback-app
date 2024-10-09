// __tests__/feedbackController.test.js
import { addFeedback, getAllFeedback, deleteFeedbackById } from '../controllers/feedbackController';
import { pool } from '../db';

jest.mock('../db', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('Feedback Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add feedback successfully', async () => {
        const mockFeedback = { id: 1, title: 'Test Feedback', text: 'Test text' };
        pool.query.mockResolvedValue({ rows: [mockFeedback] });

        const result = await addFeedback('Test Feedback', 'Test text');

        expect(result).toEqual(mockFeedback);
        expect(pool.query).toHaveBeenCalledWith(
            'INSERT INTO feedback (title, text) VALUES ($1, $2) RETURNING *',
            ['Test Feedback', 'Test text']
        );
    });

    it('should get all feedback successfully', async () => {
        const mockFeedback = [{ id: 1, title: 'Test Feedback', text: 'Test text' }];
        pool.query.mockResolvedValue({ rows: mockFeedback });

        const result = await getAllFeedback();

        expect(result).toEqual(mockFeedback);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM feedback');
    });

    it('should delete feedback by ID', async () => {
        const mockResponse = { rowCount: 1 };
        pool.query.mockResolvedValue(mockResponse);

        const result = await deleteFeedbackById(1);

        expect(result).toEqual(mockResponse);
        expect(pool.query).toHaveBeenCalledWith('DELETE FROM feedback WHERE id = $1 RETURNING *', [1]);
    });

    it('should handle delete feedback not found', async () => {
        const mockResponse = { rowCount: 0 };
        pool.query.mockResolvedValue(mockResponse);

        const result = await deleteFeedbackById(999);

        expect(result.rowCount).toBe(0);
        expect(pool.query).toHaveBeenCalledWith('DELETE FROM feedback WHERE id = $1 RETURNING *', [999]);
    });
});

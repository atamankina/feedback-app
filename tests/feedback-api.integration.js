import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// POST /feedback 
const createFeedback = () => {
    const payload = JSON.stringify({
        title: 'Test Feedback',
        text: 'This is a test feedback created by integration tests.'
    });

    const headers = { 'Content-Type': 'application/json' };

    const response = http.post(`${BASE_URL}/feedback`, payload, { headers });

    check(response, {
        'POST /feedback valid data: status code 201 (Created)': (res) => res.status === 201,
        'POST /feedback response has message': (res) => res.json('message') === 'Feedback erfolgreich gespeichert.'
    });
};

// POST /feedback empty body
const createFeedbackNoData = () => {
    const payload = JSON.stringify({});
    
    const headers = { 'Content-Type': 'application/json' };

    const response = http.post(`${BASE_URL}/feedback`, payload, { headers });

    check(response, {
        'POST /feedback missing data: status code 400 (Bad Request)': (res) => res.status === 400,
        'POST /feedback error message for missing data': (res) => res.json('message') === 'title und text sind im body erforderlich.'
    });
};

// POST /feedback no title
const createFeedbackNoTitle = () => {
    const payload = JSON.stringify({
        text: 'This is feedback with no title.'
    });
    
    const headers = { 'Content-Type': 'application/json' };

    const response = http.post(`${BASE_URL}/feedback`, payload, { headers });

    check(response, {
        'POST /feedback missing title: status code 400 (Bad Request)': (res) => res.status === 400,
        'POST /feedback error message for missing title': (res) => res.json('message') === 'title und text sind im body erforderlich.'
    });
};

// POST /feedback no text
const createFeedbackNoText = () => {
    const payload = JSON.stringify({
        title: 'Feedback without text.'
    });
    
    const headers = { 'Content-Type': 'application/json' };

    const response = http.post(`${BASE_URL}/feedback`, payload, { headers });

    check(response, {
        'POST /feedback missing text: status code 400 (Bad Request)': (res) => res.status === 400,
        'POST /feedback error message for missing text': (res) => res.json('message') === 'title und text sind im body erforderlich.'
    });
};

// POST /feedback invalid data
const createFeedbackInvalidData = () => {
    const payload = JSON.stringify({
        invalidtitle: 'Invalid title.',
        invalidtext: 'Invalid text'
    });
    
    const headers = { 'Content-Type': 'application/json' };

    const response = http.post(`${BASE_URL}/feedback`, payload, { headers });

    check(response, {
        'POST /feedback invalid data: status code 400 (Bad Request)': (res) => res.status === 400,
        'POST /feedback error message for invalid data': (res) => res.json('message') === 'title und text sind im body erforderlich.'
    });
};

// GET /feedback
const getAllFeedback = () => {
    const response = http.get(`${BASE_URL}/feedback`);

    check(response, {
        'GET /feedback status code 200 (OK)': (res) => res.status === 200,
        'GET /feedback response contains an array': (res) => Array.isArray(res.json())
    });
};

// DELETE /feedback/:title
const deleteFeedback = () => {
    const response = http.del(`${BASE_URL}/feedback/Test Feedback`);

    check(response, {
        'DELETE /feedback/:title status code 200 (OK)': (res) => res.status === 200,
        'DELETE /feedback/:title response has message': (res) => res.json('message') === 'Feedback erfolgreich geloescht.'
    });
};

// DELETE /feedback/:title not found
const deleteNonExistentFeedback = () => {
    const response = http.del(`${BASE_URL}/feedback/NonExistentFeedback`);

    check(response, {
        'DELETE /feedback/:title status code 404 (Not Found)': (res) => res.status === 404,
        'DELETE /feedback/:title response has error message': (res) => res.json('message') === 'Feedback nicht gefunden.'
    });
};


export default function () {
    createFeedback();
    createFeedbackNoData();
    createFeedbackNoTitle();
    createFeedbackNoText();
    createFeedbackInvalidData();
    getAllFeedback();
    deleteFeedback();
    deleteNonExistentFeedback();
}
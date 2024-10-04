export const sendSuccess = (res, data, message = 'Operation successful') => {
    res.status(200).json({ message, data });
};

export const sendError = (res, error, statusCode = 500) => {
    res.status(statusCode).json({ error });
};

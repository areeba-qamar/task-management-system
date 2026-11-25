///This layer is responsible for authenticating the user and protecting the routes that require authentication. It checks for the presence of a valid JWT token in the request headers and verifies it. If the token is valid, it retrieves the user from the database and attaches it to the request object for further processing. If the token is invalid or missing, it returns an appropriate error response.

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Authentication token is required'
        });
    }

    const token = authorization.split(' ')[1];

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256']
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }

    try {
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};
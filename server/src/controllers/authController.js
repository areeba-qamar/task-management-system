import { registerUser } from '../services/authService.js';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body ?? {};

        if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address'
            });
        }

        if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters and at most 72 bytes'
            });
        }

        const user = await registerUser(name, email, password);

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user
        });

    } catch (error) {
        const status = error.code === 11000
            ? 409
            : error.statusCode || 500;

        return res.status(status).json({
            success: false,
            message: status === 409
                ? 'User already exists'
                : 'Registration failed'
        });
    }
};
import { registerUser, loginUser } from '../services/authService.js';

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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body ?? {};

        if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await loginUser(email, password);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: user
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode === 401
                ? 'Invalid email or password'
                : 'Login failed'
        });
    }
};
export const getCurrentUser = (req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    });
};
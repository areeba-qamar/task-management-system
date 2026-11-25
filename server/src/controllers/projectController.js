import { createProject } from '../services/projectService.js';

export const create = async (req, res) => {
    try {
        const { name, description } = req.body ?? {};

        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Project name is required'
            });
        }

        if (description !== undefined && typeof description !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Description must be a string'
            });
        }

        const project = await createProject(
            name,
            description,
            req.user._id   //This prevents a user from creating projects on behalf of another user by manipulating the request body.
        );

        return res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create project'
        });
    }
};
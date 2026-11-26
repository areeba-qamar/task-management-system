import { 
         createProject,
         getAllProjects, 
         getProjectById,
         updateProject,
         deleteProject
        } from '../services/projectService.js';

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
export const getAll = async (req, res) => {
    try {
        const projects = await getAllProjects(req.user._id);

        return res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve projects'
        });
    }
};

export const getById = async (req, res) => {
    try {
        const project = await getProjectById(
            req.params.id,
            req.user._id
        );

        return res.status(200).json({
            success: true,
            data: project
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode
                ? error.message
                : 'Failed to retrieve project'
        });
    }
};

export const update = async (req, res) => {
    try {
        const { name, description } = req.body ?? {};

        if (name === undefined && description === undefined) {
            return res.status(400).json({
                success: false,
                message: 'At least one field is required'
            });
        }

        if (
            name !== undefined &&
            (typeof name !== 'string' || !name.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project name'
            });
        }

        if (
            description !== undefined &&
            typeof description !== 'string'
        ) {
            return res.status(400).json({
                success: false,
                message: 'Description must be a string'
            });
        }

        const project = await updateProject(
            req.params.id,
            req.user._id,
            { name, description }
        );

        return res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            data: project
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode
                ? error.message
                : 'Failed to update project'
        });
    }
};

export const remove = async (req, res) => {
    try {
        await deleteProject(
            req.params.id,
            req.user._id
        );

        return res.status(200).json({
            success: true,
            message: 'Project deleted successfully'
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode
                ? error.message
                : 'Failed to delete project'
        });
    }
};
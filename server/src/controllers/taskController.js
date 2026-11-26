import { createTask,
         getAllTasks,
         getTaskById
} from '../services/taskService.js';

export const create = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, project } = req.body ?? {};

        if (typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Task title is required'
            });
        }

        if (typeof project !== 'string' || !project.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Project ID is required'
            });
        }

        if (description !== undefined && typeof description !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Description must be a string'
            });
        }

        if (status !== undefined &&
            !['TODO', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task status'
            });
        }

        if (priority !== undefined &&
            !['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task priority'
            });
        }

        if (dueDate !== undefined &&
            (typeof dueDate !== 'string' || Number.isNaN(Date.parse(dueDate)))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid due date'
            });
        }

        const task = await createTask(
            { title, description, status, priority, dueDate, project },
            req.user._id
        );

        return res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode
                ? error.message
                : 'Failed to create task'
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const tasks = await getAllTasks(req.user._id);

        return res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve tasks'
        });
    }
};

export const getById = async (req, res) => {
    try {
        const task = await getTaskById(
            req.params.id,
            req.user._id
        );

        return res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode
                ? error.message
                : 'Failed to retrieve task'
        });
    }
};
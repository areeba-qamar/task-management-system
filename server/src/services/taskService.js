import Task from '../models/Task.js';
import { getProjectById } from './projectService.js';
import mongoose from 'mongoose';

export const createTask = async (taskData, userId) => {
    const { title, description, status, priority, dueDate, project } = taskData;

    await getProjectById(project, userId);

    const task = await Task.create({
        title,
        description,
        status,
        priority,
        dueDate,
        project,
        owner: userId
    });

    return task;
};
export const getAllTasks = async (userId) => {
    return await Task.find({ owner: userId })
        .sort({ createdAt: -1 });
};

export const getTaskById = async (taskId, userId) => {
    if (!mongoose.isValidObjectId(taskId)) {
        const error = new Error('Invalid task ID');
        error.statusCode = 400;
        throw error;
    }

    const task = await Task.findOne({
        _id: taskId,
        owner: userId
    });

    if (!task) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
    }

    return task;
};
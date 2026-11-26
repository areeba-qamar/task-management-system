import Task from '../models/Task.js';
import { getProjectById } from './projectService.js';

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
import Project from '../models/Project.js';

export const createProject = async (name, description, userId) => {
    const project = await Project.create({
        name,
        description,
        owner: userId
    });

    return project;
};
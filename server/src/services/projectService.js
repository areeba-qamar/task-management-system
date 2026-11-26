import Project from '../models/Project.js';
import mongoose from 'mongoose';

export const createProject = async (name, description, userId) => {
    const project = await Project.create({
        name,
        description,
        owner: userId
    });

    return project;
};

export const getAllProjects = async (userId) => {
    return await Project.find({
        owner: userId
    }).sort({ createdAt: -1 });
};

export const getProjectById = async (projectId, userId) => {
    if (!mongoose.isValidObjectId(projectId)) {
        const error = new Error('Invalid project ID');
        error.statusCode = 400;
        throw error;
    }

    const project = await Project.findOne({
        _id: projectId,
        owner: userId
    });

    if (!project) {
        const error = new Error('Project not found');
        error.statusCode = 404;
        throw error;
    }

    return project;
};

//We're filtering by both project ID and owner ID. This ensures that even if another user knows your project ID, they cannot retrieve your project.
//This is called resource-level authorization.

//------------------------------------------------------


export const updateProject = async (projectId, userId, updates) => {
    const project = await getProjectById(projectId, userId);

    if (updates.name !== undefined) {
        project.name = updates.name;
    }

    if (updates.description !== undefined) {
        project.description = updates.description;
    }

    return await project.save();
};

export const deleteProject = async (projectId, userId) => {
    const project = await getProjectById(projectId, userId);

    await project.deleteOne();
};
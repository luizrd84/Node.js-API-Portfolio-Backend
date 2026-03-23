import projectModel from "./projectModel.js";
import projectImageModel from "./projectImageModel.js";
import projectTechnologyModel from "./projectTechnologyModel.js";
import technologyModel from "./technologyModel.js";

// Projeto → Imagens
projectModel.hasMany(projectImageModel, {
    foreignKey: "projectId"
});

projectImageModel.belongsTo(projectModel, {
    foreignKey: "projectId"
});


projectModel.belongsToMany(technologyModel, {
    through: projectTechnologyModel,
    foreignKey: "projectId",
    otherKey: "technologyId",
    as: "technologies"
});

technologyModel.belongsToMany(projectModel, {
    through: projectTechnologyModel,
    foreignKey: "technologyId",
    otherKey: "projectId",
    as: "projects"
});

export {
    projectModel,
    projectImageModel,
    technologyModel,
    projectTechnologyModel
};




import { type Request, type Response, type NextFunction } from "express";
import {technologyModel, projectModel, projectTechnologyModel} from "../Models/relacionamentos.js"


async function getAllTechnologies (req: Request, res: Response, next: NextFunction) {    
    const technologies = await technologyModel.findAll();
    res.json(technologies);
}

//Busca todas as imagens de um Projeto
async function getProjectTechnologies (req: Request, res: Response, next: NextFunction) {   
    
    const { projectId } = req.params;

    const projectTechnologies = await technologyModel.findAll({
        include: {
        model: projectModel,
        as: "projects",
        where: { id: Number(projectId) },
        attributes: [],
        through: { attributes: [] }
    }
    });

    res.json(projectTechnologies);
}

//Deleta uma tecnologia do projeto (acesso interno)
async function deleteProjectTechnologiesById (projectId: number, technologyId: number) {   
    const projectTechnologies = await projectTechnologyModel.destroy({
        where: { projectId, technologyId }    
    });
}

//Deleta uma tecnologia do projeto (acesso externo)
async function deleteProjectTechnologiesByIdHttp (req: Request, res: Response, next: NextFunction) {   
    const { projectId, technologyId } = req.params;

    const projectTechnologies = await projectTechnologyModel.destroy({
        where: { projectId, technologyId }    
    });
}

//Deleta todas as tecnologias de um Projeto
async function deleteProjectTechnologies (projectId: number) {         
    const projectTechnologies = await projectTechnologyModel.destroy({
        where: { projectId }    
    });    
}

//Busca todas as imagens de um Projeto
async function getTechnologiesOfAllProjects (req: Request, res: Response, next: NextFunction) {   
        
const projectsWithTechnologies = await projectModel.findAll({
    include: [{
        model: technologyModel,
        as: "technologies",
        attributes: ["id", "name", "url"],
        through: { attributes: [] }
    }]
  });

  res.json(projectsWithTechnologies);
}



export default {getAllTechnologies, getProjectTechnologies, getTechnologiesOfAllProjects, 
    deleteProjectTechnologies, deleteProjectTechnologiesById, 
    deleteProjectTechnologiesByIdHttp};
import { Router } from "express";
import technologyController from "../Controllers/technologyController.js";



const router = Router();

//Rotas públicas
router.get("/getAllTechnologies", technologyController.getAllTechnologies);

router.get("/getTechnologiesByProjectId/:projectId", technologyController.getProjectTechnologies);

router.get("/getTechnologiesOfAllProjects", technologyController.getTechnologiesOfAllProjects);

//Rotas Privadas
router.delete("/deleteTechnologieFromProject/:projectId/:technologyId", technologyController.deleteProjectTechnologiesByIdHttp);

//criar tambem se o usuario desejar incluir novas tecnologias.. não fiz ainda...



export default router;

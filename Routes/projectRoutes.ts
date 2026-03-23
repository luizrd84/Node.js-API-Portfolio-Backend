import { Router } from "express";
import portfolioController from "../Controllers/portfolioController.js";
import upload from "../middlewares/upload.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";


const router = Router();

//Rotas públicas
//localhost:3000/api/projects/getAllProjects
router.get("/getAllProjects", portfolioController.getAllProjects);

//localhost:3000/api/projects/getProjectById/:id
router.get("/getProjectById/:id", portfolioController.getProjectById);




//Rotas que requerem autenticação
//localhost:3000/api/projects/createProject
router.post("/createProject", authenticateToken, upload.array("images"), portfolioController.createProject);

//localhost:3000/api/projects/deleteProjectById/:id
router.delete("/deleteProjectById/:id", authenticateToken, portfolioController.deleteProjectById);

//localhost:3000/api/projects/edit/:id
router.put("/edit/:id", authenticateToken, upload.array("images"), portfolioController.updateProject);


export default router;

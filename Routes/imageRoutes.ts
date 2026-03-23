import { Router } from "express";
import upload from "../middlewares/upload.js";
import imageController from "../Controllers/imageController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";



const router = Router();


//Rotas públicas
router.get("/getImagesByProjectId/:projectId", imageController.getProjectImages);

router.get("/getAllImages", imageController.getAllImages);



//Rotas que requerem autenticação
//Essa rota é só para testes... não inclui corretamente imagens cloudinary e banco.
router.post("/upload", authenticateToken, upload.single("image"), imageController.uploadImage);

router.delete("/deleteProjectImages/:projectId", authenticateToken, imageController.deleteProjectImages);

router.delete("/deleteSingleImage/:id", authenticateToken, imageController.deleteSingleImage);

//Falta
//adicionar novas imagens.... copiar do projeto basicamente.


/* Mudar pra isso depois. 
router.post(
  "/upload",
  authenticateToken,
  upload.single("image"),
  imageController.uploadImage
);*/



export default router;


/*
para proteger as rotas, fazer isso: ver como funciona no meu caso que tem mais parametros.
tenho que proteger, envio de imagens, envio de projetos, put e delete. 

import { authenticateToken } from "../middleware/authMiddleware";

router.post("/deleteProject", authenticateToken, deleteProject);

*/


/*

rota para login...criar

*/
import type { Request, Response, NextFunction } from "express";
import cloudinaryService from "../services/cloudinaryService.js";
import fs from "fs";
import projectImageModel from "../Models/projectImageModel.js";
import { Op } from "sequelize";
import type { IProjectImage } from "../Models/projectImage.js";

//Usado para fazer upload de imagens:
async function uploadImage(req: Request, res: Response) {

    if (!req.file) {
        return res.status(400).json({ error: "Arquivo não enviado" });
    }

    try {
        const result = await cloudinaryService.uploadImage(req.file.path);

        //Remove o arquivo temporário
        fs.unlinkSync(req.file.path);

        return res.json(result);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao enviar imagem" });
    }
}


//Busca todas as imagens de um Projeto
async function getProjectImages (req: Request, res: Response, next: NextFunction) {    
    const { projectId } = req.params;

    const projectImages = await projectImageModel.findAll({
        where: { projectId }
    });

    res.json(projectImages);   
    
}

//Busca todas as imagens
async function getAllImages (req: Request, res: Response, next: NextFunction) {    
    const images = await projectImageModel.findAll();
    res.json(images);
}


//Deleta todas as imagens de um Projeto
async function deleteProjectImages (req: Request, res: Response, next: NextFunction) {
    const { projectId } = req.params;   
    
    const projectImagesCloudinary = await projectImageModel.findAll({
        where: { projectId, 
            cloudinaryId: {
                [Op.not]: null  
            } 
        }
    }) as unknown as IProjectImage[];

    if (projectImagesCloudinary.length > 0) {
        for (const img of projectImagesCloudinary) {
            await cloudinaryService.deleteImage(img.cloudinaryId);            
        }
    }

    const deleted = await projectImageModel.destroy({
        where: { projectId }
    });

    if (deleted === 0) {
        return res.status(404).json({ message: 'Nenhuma imagem encontrada' });
    }

    return res.json({ message: 'Imagens deletadas com sucesso' }); 
    
}

async function deleteProjectImagesInternal (projectId:number) {
    
    const projectImagesCloudinary = await projectImageModel.findAll({
        where: { projectId, 
            cloudinaryId: {
                [Op.not]: null  
            } 
        }
    }) as unknown as IProjectImage[];

    if (projectImagesCloudinary.length > 0) {
        for (const img of projectImagesCloudinary) {
            await cloudinaryService.deleteImage(img.cloudinaryId);            
        }
    }

    const projectImages = await projectImageModel.destroy({
        where: { projectId }
    });
    
}

//Deleta uma imagem de um Projeto
async function deleteSingleImage (req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;    
    
    const projectImagesCloudinary = await projectImageModel.findOne({ 
        where: { id, 
            cloudinaryId: { [Op.not]: null } 
        } 
    }) as unknown as IProjectImage;

    if (projectImagesCloudinary) {        
        await cloudinaryService.deleteImage(projectImagesCloudinary.cloudinaryId);                    
    }

    const deleted = await projectImageModel.destroy({
        where: { id }
    });

    if (deleted === 0) {
        return res.status(404).json({ message: 'Imagem não encontrada' });
    }

    return res.json({ message: 'Imagem deletada com sucesso' });       
}



export default {uploadImage, getProjectImages, getAllImages, deleteProjectImages,
    deleteSingleImage, deleteProjectImagesInternal
};

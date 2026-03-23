import sequelize from "../db.js";
import { type Request, type Response, type NextFunction } from "express";
import { Transaction } from "sequelize";
import cloudinaryService from "../services/cloudinaryService.js";

import projectModel from "../Models/projectModel.js"; 
import {projectModel as projectRelationship} from "../Models/relacionamentos.js"; 
import {projectImageModel as projectImageRelationship} from "../Models/relacionamentos.js"; 
import {technologyModel as technologyRelationship} from "../Models/relacionamentos.js"; 
import {projectTechnologyModel as projectTechnologyRelationship} from "../Models/relacionamentos.js"; 
import projectImageModel from "../Models/projectImageModel.js"; 
import technologyModel from '../Models/technologyModel.js'; 
import projectTechnologyModel from '../Models/projectTechnologyModel.js'; 
import type { ITechnology } from '../Models/technology.js';
import technologyController from "./technologyController.js";
import imageController from "./imageController.js";


//Busca todos os projetos
async function getAllProjects (req: Request, res: Response, next: NextFunction) {    
    const projects = await projectModel.findAll();
    res.json(projects);
}

//Busca um projeto específico
async function getProjectById (req: Request, res: Response, next: NextFunction) {    
    const { id } = req.params;

    const project = await projectModel.findOne({
        where: { id }
    });
    res.json(project);       
}

//Deletar um projeto
async function deleteProjectById (req: Request, res: Response, next: NextFunction) {   
       
    const { id } = req.params;
    
    console.log("Deletar o projeto: " + id);

    //Deletar as technologies do banco
    technologyController.deleteProjectTechnologies(Number(id));

    //Deletar as imagens do cloudinary e do banco
    imageController.deleteProjectImagesInternal(Number(id));

    const deleted = await projectModel.destroy({
        where: { id }
    });

    if (deleted === 0) {
        return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    return res.json({ message: 'Projeto deletado com sucesso' });     
}

//Interfaces para Create e Update
interface UploadedImage {
    url: string;
    publicId: string;
}
interface ImageInput {
    imageUrl: string;
    description?: string;
    cloudinaryId:string;
    alt?: string;
    order?: number;
}

//Incluir um novo projeto
async function createProject (req: Request, res: Response, next: NextFunction) {   

    console.log("TECH RECEBIDO:", req.body.technologies);

    const uploadedImages: UploadedImage[] = [];
    let transaction: Transaction | null = null;

    try {
        //Imagens
        if (req.files && Array.isArray(req.files)) {
            for (const img of req.files) {
                const uploaded = await cloudinaryService.uploadImage(img.path);
                uploadedImages.push(uploaded);
            }
        }

        const imagesMeta = req.body.imagesMeta
            ? JSON.parse(req.body.imagesMeta) : [];
     
        const uploadedImagesFormatted: ImageInput[] = uploadedImages.map((img, index) => ({
            imageUrl: img.url,
            cloudinaryId: img.publicId,
            description: imagesMeta[index]?.description ?? null,
            alt: imagesMeta[index]?.alt ?? null,
            order: index
        }));


        const externalImages: ImageInput[] = req.body.imageUrls
            ? JSON.parse(req.body.imageUrls) : [];   

        const allImages: ImageInput[] = [
            ...uploadedImagesFormatted,
            ...externalImages
        ];

        // 2 - transaction banco
        transaction = await sequelize.transaction();

        //cria o projeto
        const project = await projectModel.create(req.body, { transaction });

        const imagesFormatted = allImages.map((img, index) => ({
            projectId: project.get("id") as number,
            imageUrl: img.imageUrl,
            cloudinaryId: img.cloudinaryId ?? null, 
            description: img.description ?? null,
            alt: img.alt ?? null,
            order: img.order ?? index
        }));

        await projectImageModel.bulkCreate(imagesFormatted, { transaction });
        

        //tecnologias
        const technologyIds: number[] = []; // IDs finais para associar

        if (req.body.technologies) {
            const techInput = JSON.parse(req.body.technologies); // espera array mista [{id:1}, {name, url}]

            for (const tech of techInput) {
                if (tech.id) {
                    // tecnologia existente
                    technologyIds.push(tech.id);
                } else if (tech.name && tech.url) {
                    // nova tecnologia: evitar duplicatas (case-insensitive)
                    const nameLower = tech.name.trim().toLowerCase();
                    const [createdTech] = await technologyModel.findOrCreate({
                        where: sequelize.where(
                            sequelize.fn("lower", sequelize.col("name")),
                            nameLower
                        ),
                        defaults: {
                            name: tech.name.trim(),
                            url: tech.url.trim()
                        },
                        transaction
                    });
                    technologyIds.push(createdTech.get("id") as number);
                }
            }
        }

        // Associa tecnologias ao projeto (m:n)
        if (technologyIds.length > 0) {
            await (project as any).setTechnologies(technologyIds, { transaction });
        }

        await transaction.commit();

        // Retorna o projeto completo
        const createdProject = await projectModel.findByPk(project.get("id") as number, {            
            include: [ projectImageModel, {model: technologyModel, as: "technologies" }
        ]
        });

        transaction = null;

        return res.json(createdProject);

    } catch(err) {
        
        if (transaction) await transaction.rollback();

        // limpar cloudinary
        for (const img of uploadedImages) {
            await cloudinaryService.deleteImage(img.publicId);
        }
        return res.status(500).json({ error: "Erro ao criar projeto" });
    }

}

//Atualizar um projeto - put = projects/edit/:id
async function updateProject (req: Request, res: Response, next: NextFunction) {      
    
    const projectId = Number(req.params.id);

    const uploadedImages: UploadedImage[] = [];
    let transaction: Transaction | null = null;

    try {

        //Imagens
        if (req.files && Array.isArray(req.files)) {
            for (const img of req.files) {
                const uploaded = await cloudinaryService.uploadImage(img.path);
                uploadedImages.push(uploaded);
            }
        }

        const imagesMeta = req.body.imagesMeta
            ? JSON.parse(req.body.imagesMeta) : [];
     
        const uploadedImagesFormatted: ImageInput[] = uploadedImages.map((img, index) => ({
            imageUrl: img.url,
            cloudinaryId: img.publicId,
            description: imagesMeta[index]?.description ?? null,
            alt: imagesMeta[index]?.alt ?? null,
            order: index
        }));

        const externalImages: ImageInput[] = req.body.imageUrls
            ? JSON.parse(req.body.imageUrls) : [];   

        
        const incomingImages: ImageInput[] = [...uploadedImagesFormatted, ...externalImages];

        // Transaction
        transaction = await sequelize.transaction();

        const project = await projectModel.findByPk(projectId, { transaction });

        if (!project) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }

        // Atualiza dados básicos
        await project.update(      {
            title: req.body.title,
            description: req.body.description,
            createdAt: req.body.createdAt,
            githubUrl: req.body.githubUrl,
            demoUrl: req.body.demoUrl,
        },  { transaction } );

        
        // Atualiza imagens no banco sem duplicar
        // Busca imagens antigas
        const existingImages = await projectImageModel.findAll({
        where: { projectId },
        transaction,
        });

        // Filtra imagens que precisam ser criadas (novas ou modificadas)
        const imagesToUpsert = incomingImages.map((img, index) => {
        // Tenta achar a imagem existente pelo cloudinaryId ou URL
        const existing = existingImages.find(e =>
            (e as any).cloudinaryId === img.cloudinaryId || (e as any).imageUrl === img.imageUrl
        );

        if (existing) {
            // Atualiza apenas campos que podem ter mudado
            existing.set({
            description: img.description ?? (existing as any).description,
            alt: img.alt ?? (existing as any).alt,
            order: img.order ?? index,
            });
            return existing;
        } else {
            // Nova imagem
            return projectImageModel.build({
            projectId,
            imageUrl: img.imageUrl,
            cloudinaryId: img.cloudinaryId ?? null,
            description: img.description ?? null,
            alt: img.alt ?? null,
            order: img.order ?? index,
            });
        }
        });

        // Apaga do banco apenas as imagens que foram removidas
        const incomingIdsOrUrls = incomingImages.map(i => i.cloudinaryId ?? i.imageUrl);
        
        const imagesToDelete = existingImages.filter(e => {
        const idOrUrl = (e as any).cloudinaryId ?? (e as any).imageUrl;
        return !incomingIdsOrUrls.includes(idOrUrl);
        });

        if (imagesToDelete.length > 0) {
        await projectImageModel.destroy({
            where: {
            id: imagesToDelete.map(i => (i as any).id),
            }, transaction,
        });
        }

        // Salva/atualiza as novas/imagens modificadas
        for (const img of imagesToUpsert) {
        await img.save({ transaction });
        }

        // Atualiza tecnologias
        const technologyIds: number[] = [];
        if (req.body.technologies) {
        const techInput = JSON.parse(req.body.technologies);
        for (const tech of techInput) {
            if (tech.id) {
            technologyIds.push(tech.id);
            } else if (tech.name && tech.url) {
            const nameLower = tech.name.trim().toLowerCase();
            const [createdTech] = await technologyModel.findOrCreate({
                where: sequelize.where(
                sequelize.fn("lower", sequelize.col("name")),
                nameLower
                ),
                defaults: { name: tech.name.trim(), url: tech.url.trim() },
                transaction,
            });
            technologyIds.push(createdTech.get("id") as number);
            }
        }
        }

        if (technologyIds.length > 0) {
        await (project as any).setTechnologies(technologyIds, { transaction });
        }

        await transaction.commit();

        // Retorna o projeto atualizado
        const updatedProject = await projectModel.findByPk(projectId, {
        include: [projectImageModel, { model: technologyModel, as: "technologies" }],
        });

        return res.json(updatedProject);
    } catch (err) {
        console.error("ERRO REAL:", err);
        if (transaction) await transaction.rollback();
        for (const img of uploadedImages) {
        await cloudinaryService.deleteImage(img.publicId);
        }
        return res.status(500).json({ error: "Erro ao atualizar o projeto" });
    }
}




export default {getAllProjects, getProjectById, createProject, deleteProjectById, updateProject};

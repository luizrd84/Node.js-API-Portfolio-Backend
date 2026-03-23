import db from "../db.js";
import sequelize from "sequelize";

export default db.define("projectImage", {
    id: {
        type: sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    projectId: {
        type: sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
    description: {
        type: sequelize.STRING,
        allowNull: true
    },
    alt: {
        type: sequelize.STRING,
        allowNull: true
    },
    cloudinaryId: {
        type: sequelize.STRING,
        allowNull: true
    },
    imageUrl: {
        type: sequelize.STRING,
        allowNull: false
    },
    order: {
        type: sequelize.INTEGER.UNSIGNED, 
        allowNull: false
    }       
});

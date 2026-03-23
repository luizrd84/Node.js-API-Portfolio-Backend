import db from "../db.js";
import sequelize from "sequelize";

export default db.define("project", {
    id: {
        type: sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: sequelize.STRING,
        allowNull: false
    },
    description: {
        type: sequelize.TEXT,
        allowNull: true
    },
    githubUrl: {
        type: sequelize.STRING,
        allowNull: true
    },
    demoUrl: {
        type: sequelize.STRING,
        allowNull: true
    },
    createdAt: {
        type: sequelize.DATE,
        allowNull: true
    }
})
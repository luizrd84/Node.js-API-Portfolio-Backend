import db from "../db.js";
import sequelize from "sequelize";

export default db.define("technology", {
    id: {
        type: sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    url: {
        type: sequelize.STRING,
        allowNull: true
    }
})
import db from "../db.js";
import sequelize from "sequelize";

export default db.define("Admin", {
    id: {
        type: sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,        
    },
    username: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    }
    },  {
        tableName: "Admins", 
        timestamps: false
    }

)
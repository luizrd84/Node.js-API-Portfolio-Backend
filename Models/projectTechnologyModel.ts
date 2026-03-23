import db from "../db.js";
import sequelize from "sequelize";

export default db.define("projectTechnology", {
    projectId: {
        type: sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
    technologyId: {
        type: sequelize.INTEGER.UNSIGNED,
        allowNull: false
    }
})

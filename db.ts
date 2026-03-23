import { Sequelize } from "sequelize";

const dbName = process.env.DB_NAME!;
const dbUser = process.env.DB_USER!;
const dbPass = process.env.DB_PASS!;
const dbHost = process.env.DB_HOST!;


const sequelize = new Sequelize(dbName, dbUser, dbPass, {
    dialect: "mysql",
    host: dbHost,
    port: Number(process.env.DB_PORT)
});

export default sequelize;
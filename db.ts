import { Sequelize } from "sequelize";
import mysql2 from 'mysql2';

const dbName = process.env.DB_NAME!;
const dbUser = process.env.DB_USER!;
const dbPass = process.env.DB_PASS!;
const dbHost = process.env.DB_HOST!;


// const sequelize = new Sequelize(dbName, dbUser, dbPass, {
//     dialect: "mysql",
//     host: dbHost,
//     port: Number(process.env.DB_PORT),
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false
//         }
//     }
// });

const sequelize = new Sequelize(process.env.DB_URI!, {
    dialect: "mysql",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

export default sequelize;
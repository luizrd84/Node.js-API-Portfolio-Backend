import 'dotenv/config';
import sequelize from "../db.js";
import { hashPassword } from "../utils/passwordUtils.js";

import adminModel from '../Models/adminModel.js';
import type { IAdmin } from '../Models/adminInterface.js';


async function seedAdmin() {

    await sequelize.sync();
   
    const pass = await hashPassword("ESCOLHAASUASENHA");

    
    const adminData = [
        { username: "ESCOLHAOSEUUSUARIO", password: pass }        
    ];

    const createdAdmin: Record<string, IAdmin> = {};
    
    for (const data of adminData) {
        const [ad] = await adminModel.findOrCreate({
            where: { username: data.username},
            defaults: data
        }); 

        const dataTyped = ad.get() as IAdmin;
        
        createdAdmin[dataTyped.username] = dataTyped;
    }
}


seedAdmin();


import 'dotenv/config';
import express from "express";
import projectRoutes from "./Routes/projectRoutes.js";
import imageRoutes from "./Routes/imageRoutes.js";
import technologyRoutes from "./Routes/technologyRoutes.js"
import db from "./db.js";
import cors from 'cors';
import authRoutes from "./Routes/authRoutes.js";


const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use("/api/projects", projectRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/technologies", technologyRoutes);
app.use("/auth", authRoutes);


// app.set("view engine", "pug");
app.set("views", "./Views"); //isso tem que ver como integrar ao front end


// app.post("/api/images/test", (req, res) => {
//     res.json({ ok: true });""
// });



// console.log("Conectado com o banco: " + process.env.DB_NAME);


db.sync().then(() => {
    console.log("Conectado com o banco: " + process.env.DB_NAME);
}).then(() => {
    //Servidor em espera
    app.listen(process.env.PORT, () => { 
        console.log("Servidor criado.")
    });
})





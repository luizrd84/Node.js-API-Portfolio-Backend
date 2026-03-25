import 'dotenv/config';
import express from "express";
import projectRoutes from "./Routes/projectRoutes.js";
import imageRoutes from "./Routes/imageRoutes.js";
import technologyRoutes from "./Routes/technologyRoutes.js"
import db from "./db.js";
import cors from 'cors';
import authRoutes from "./Routes/authRoutes.js";

const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:51810',
  'http://192.168.0.44:51810',
  'https://meu-portfolio-frontend.onrender.com',
  'https://meu-portfolio-frontend-latest.onrender.com',
  'https://luizricardodias-portfolio.onrender.com'
];

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use("/api/projects", projectRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/technologies", technologyRoutes);
app.use("/auth", authRoutes);

app.get('/', (req, res) => {
  res.send('API rodando');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


app.set("views", "./Views"); //isso tem que ver como integrar ao front end

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor rodando');
});



db.sync().then(() => {
    console.log("Conectado com o banco: " + process.env.DB_NAME);
}).then(() => {
    //Servidor em espera
    app.listen(process.env.PORT, () => { 
        console.log("Servidor criado.")
    });
})





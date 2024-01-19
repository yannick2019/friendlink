import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";

// Securty packages
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js"
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";

const __dirname = path.resolve(path.dirname(""));

dotenv.config();

const app = express();

//app.use(express.static(path.join(__dirname, "views/build")));

const staticDir = path.join(__dirname, "views/build");

// Vérifiez si le répertoire staticDir existe et contient index.html
fs.access(path.join(staticDir, 'index.html'), fs.constants.F_OK, (err) => {
  if (err) {
    console.error(`Le fichier index.html n'existe pas dans le répertoire ${staticDir} ou n'est pas accessible.`);
  } else {
    console.log(`Le fichier index.html existe dans le répertoire ${staticDir}.`);
    app.use(express.static(staticDir));
  }
});

const PORT = process.env.PORT || 8800;

dbConnection();

app.use(helmet());
app.use(cors({
  origin: ["https://friendlink-client.vercel.app"],
  methods: ["POST", "GET", "PUT"],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(router);

// Error middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Dev server running on port ${PORT}`);
});

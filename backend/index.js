import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";

// Securty packages
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js"
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";

const __dirname = path.resolve(path.dirname(""));

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "views/build")));

const PORT = process.env.PORT || 8800;

//dbConnection();

app.use(cors({
  origin: ["https://friendlink-client.vercel.app", "http://localhost:3000"],
  methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(router);

// Error middleware
app.use(errorMiddleware);

// Check connection to database before starting server
dbConnection()
  .then(() =>
  {
    app.listen(PORT, () =>
    {
      console.log(`Dev server running on port ${PORT}`);
    });
  })
  .catch(err =>
  {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });

app.listen(PORT, () =>
{
  console.log(`Dev server running on port ${PORT}`);
});

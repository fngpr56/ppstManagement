import express from "express";
import dotenv from "dotenv";
import { notFound } from "./src/middlewares/notFound.js";
import { handleError } from "./src/middlewares/handleError.js";
import routes from "./routes.js";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static(path.join(path.resolve(), "src", "public")));

// routes
app.use("/", routes);

// middleware
app.use(notFound);
app.use(handleError);

app.listen(port, () => {
  console.log(`server -> http://localhost:${port}`);
});

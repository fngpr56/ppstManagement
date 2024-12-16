import express from "express";
import dotenv from "dotenv";
import { notFound } from "./src/middlewares/notFound.js";
import { handleError } from "./src/middlewares/handleError.js";
import notesRoute from "./routes.js";
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

// frontend
const publicDir = path.resolve("./src/public");
app.use(express.static(publicDir));

// router
app.use("/", notesRoute);

// project

app.post("/insertProject", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Поле 'name' обязательно для заполнения" });
  }

  res.status(201).json({ message: `Проект '${name}' успешно добавлен!` });
});

app.use(notFound);
app.use(handleError);

app.listen(port, () => {
  console.log(`server -> http://localhost:${port}`);
});

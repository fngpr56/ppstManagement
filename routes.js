import express from "express";
import path from "path";
import {
    selectProjects,
    insertProject,
    updateProject,
    deleteProject
} from "./src/controllers/projectController.js";
import {
    selectProducts,
    insertProduct,
    updateProduct,
    deleteProduct
} from "./src/controllers/productController.js";
import {
    selectTasks,
    insertTask,
    updateTask,
    deleteTask,
} from "./src/controllers/taskController.js";

const router = express.Router();
const __dirname = path.resolve();

// static pages
router.get("/", (req, res) => res.sendFile(path.join(__dirname, "src", "public", "index.html")));
router.get("/navbar", (req, res) => res.sendFile(path.join(__dirname, "src", "public", "navbar.html")));
router.get("/project", (req, res) => res.sendFile(path.join(__dirname, "src", "public", "project.html")));
router.get("/product", (req, res) => res.sendFile(path.join(__dirname, "src", "public", "product.html")));
router.get("/task", (req, res) => res.sendFile(path.join(__dirname, "src", "public", "task.html")));

// project routes
router.route("/selectProject").get(selectProjects);
router.post("/insertProject", insertProject);
router.put("/updateProject", updateProject);
router.delete("/deleteProject/:id", deleteProject);

// product routes
router.route("/selectProducts").get(selectProducts);
router.post("/insertProduct", insertProduct);
router.put("/updateProduct", updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);

//task routes

router.route("/selectTasks").get(selectTasks);
router.post("/insertTask", insertTask);
router.put("/updateTask", updateTask);
router.delete("/deleteTask/:id", deleteTask);

//string routes

export default router;

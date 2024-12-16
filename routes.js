import express from "express";
import {selectProjects, insertProject, updateProject, deleteProject} from "./src/controllers/projectController.js"
const router = express.Router();

// test routes

router.route("/tRoutes")
    .get((req, res) => {
        res.send("Hi 💋");
    })
    .post((req, res) => {
        res.send("Handling POST request for the root route");
    });

    router.route("/")
    .get(async (req, res, next) => {
        try {
            const notes = await getNote();
            res.status(200).json(notes); 
        } catch (error) {
            next(error);
        }
    });

//project

router.route("/selectProjects")
    .get(async (req, res, next) => {
        try {
            const notes = await selectProjects();
            res.status(200).json(notes); 
        } catch (error) {
            next(error);
        }
    });

router.post("/insertProject", insertProject);

router.put("/updateProject", updateProject);

router.delete("/deleteProject/:id", deleteProject);

export default router;

import { pool } from "../db/connect.js";

// select

  export async function selectProjects(req, res, next) {
    try {
        const sql = "SELECT * FROM projects";
        const [rows] = await pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching products:", error.message);
        next(error);
    }
}

//insert

export async function insertProject(req, res) {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Поле 'name' обязательно для заполнения" });
        }

        const sql = "INSERT INTO projects (id, name) VALUES (NULL, ?)";

        const [result] = await pool.query(sql, [name]);

        console.log("Результат выполнения запроса:", result);

        if (!result.insertId) {
            throw new Error("ID не возвращён базой данных");
        }

        res.status(201).json({
            message: `Проект '${name}' успешно добавлен!`,
            projectId: result.insertId
        });
    } catch (error) {
        console.error("Ошибка при вставке проекта:", error.message);
        res.status(500).json({ error: "Ошибка при добавлении проекта в базу данных" });
    }
}

//update

export async function updateProject(req, res) {
    try {
        const { id, name } = req.body;

        if (!id || !name) {
            return res.status(400).json({ error: "Поля 'id' и 'name' обязательны для заполнения" });
        }

        const sql = "UPDATE projects SET name = ? WHERE id = ?";

        const [result] = await pool.query(sql, [name, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Проект с таким ID не найден" });
        }

        res.status(200).json({
            message: `Проект с ID ${id} успешно обновлён!`,
        });
    } catch (error) {
        console.error("Ошибка при обновлении проекта:", error.message);
        res.status(500).json({ error: "Ошибка при обновлении данных проекта" });
    }
}

// delete

export async function deleteProject(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID обязателен для удаления" });
        }

        const sql = "DELETE FROM projects WHERE id = ?";
        const [result] = await pool.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Проект с таким ID не найден" });
        }

        res.status(200).json({ message: `Проект с ID ${id} успешно удалён` });
    } catch (error) {
        console.error("Ошибка при удалении проекта:", error.message);
        res.status(500).json({ error: "Ошибка при удалении проекта из базы данных" });
    }
}

  

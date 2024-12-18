import { pool } from "../db/connect.js";

// select
export async function selectStrings(req, res, next) {
    try {
        const sql = `
            SELECT 
                strings.id, 
                strings.task_id, 
                strings.content, 
                tasks.title AS task_title
            FROM strings
            JOIN tasks ON strings.task_id = tasks.id
        `;
        const [rows] = await pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching strings:", error.message);
        next(error);
    }
}

// insert

export async function insertString(req, res, next) {
    try {
        const { task_id, content } = req.body;

        if (!task_id || !content) {
            return res.status(400).json({ error: "'task_id' and 'content' are required." });
        }

        const sqlInsert = "INSERT INTO strings (task_id, content) VALUES (?, ?)";
        const [result] = await pool.query(sqlInsert, [task_id, content]);

        const sqlFetchTask = "SELECT title FROM tasks WHERE id = ?";
        const [task] = await pool.query(sqlFetchTask, [task_id]);

        if (task.length === 0) {
            return res.status(404).json({ error: "Task not found." });
        }

        res.status(201).json({
            message: `String '${content}' added successfully!`,
            stringId: result.insertId,
            taskTitle: task[0].title,
        });
    } catch (error) {
        console.error("Error inserting string:", error.message);
        next(error);
    }
}

// update

export async function updateString(req, res, next) {
    try {
        const { id, task_id, content } = req.body;

        if (!id || !task_id || !content) {
            return res.status(400).json({
                error: "'id', 'task_id', and 'content' are required fields.",
            });
        }

        const sqlUpdate = `
            UPDATE strings 
            SET content = ?, task_id = ?
            WHERE id = ?
        `;
        const [result] = await pool.query(sqlUpdate, [content, task_id, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "String not found." });
        }

        const sqlTask = "SELECT title FROM tasks WHERE id = ?";
        const [task] = await pool.query(sqlTask, [task_id]);

        if (task.length === 0) {
            return res.status(404).json({ error: "Task not found." });
        }

        res.status(200).json({
            message: `String ID ${id} updated successfully!`,
            taskTitle: task[0].title,
            content,
        });
    } catch (error) {
        console.error("Error updating string:", error.message);
        next(error);
    }
}

// delete

export async function deleteString(req, res, next) {
    try {
        const { id } = req.params;

        const sql = "DELETE FROM strings WHERE id = ?";
        const [result] = await pool.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "String not found." });
        }

        res.status(200).json({
            message: `String ID ${id} deleted successfully!`,
        });
    } catch (error) {
        console.error("Error deleting string:", error.message);
        next(error);
    }
}

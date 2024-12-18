import { pool } from "../db/connect.js";

// select
export async function selectTasks(req, res, next) {
    try {
        const sql = `
            SELECT 
                tasks.id, 
                tasks.title, 
                DATE_FORMAT(tasks.due_date, '%Y-%m-%d') AS due_date, 
                products.name AS product_name
            FROM tasks
            JOIN products ON tasks.product_id = products.id
        `;
        const [rows] = await pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        next(error);
    }
}


// insert
export async function insertTask(req, res, next) {
    try {
        const { product_id, title, due_date } = req.body;

        if (!product_id || !title) {
            return res.status(400).json({ error: "'product_id' and 'title' are required." });
        }

        const sqlInsert = "INSERT INTO tasks (product_id, title, due_date) VALUES (?, ?, ?)";
        const [result] = await pool.query(sqlInsert, [product_id, title, due_date]);

        const sqlFetchProduct = "SELECT name FROM products WHERE id = ?";
        const [product] = await pool.query(sqlFetchProduct, [product_id]);

        if (product.length === 0) {
            return res.status(404).json({ error: "Product not found." });
        }

        res.status(201).json({
            message: `Task '${title}' added successfully!`,
            taskId: result.insertId,
            productName: product[0].name,
        });
    } catch (error) {
        console.error("Error inserting task:", error.message);
        next(error);
    }
}


// update
export async function updateTask(req, res, next) {
    try {
        const { id, product_id, title, due_date } = req.body;

        if (!id || !title || !product_id) {
            return res.status(400).json({
                error: "'id', 'product_id', and 'title' are required fields.",
            });
        }

        const formattedDate = due_date
            ? new Date(due_date).toISOString().slice(0, 10)
            : null;

        const sqlUpdate = `
            UPDATE tasks 
            SET title = ?, product_id = ?, due_date = ?
            WHERE id = ?
        `;
        const [result] = await pool.query(sqlUpdate, [title, product_id, formattedDate, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found." });
        }

        const sqlProduct = "SELECT name FROM products WHERE id = ?";
        const [product] = await pool.query(sqlProduct, [product_id]);

        if (product.length === 0) {
            return res.status(404).json({ error: "Product not found." });
        }

        res.status(200).json({
            message: `Task ID ${id} updated successfully!`,
            productName: product[0].name,
            title,
            due_date: formattedDate,
        });
    } catch (error) {
        console.error("Error updating task:", error.message);
        next(error);
    }
}

// delete 

export async function deleteTask(req, res, next) {
    try {
        const { id } = req.params;

        const sql = "DELETE FROM tasks WHERE id = ?";
        const [result] = await pool.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found." });
        }

        res.status(200).json({
            message: `Task ID ${id} deleted successfully!`,
        });
    } catch (error) {
        console.error("Error deleting task:", error.message);
        next(error);
    }
}

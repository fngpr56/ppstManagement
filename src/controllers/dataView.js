import { pool } from "../db/connect.js";

export async function dataView(req, res, next) {
    try {
        const sql = `
            SELECT 
                projects.id AS project_id,
                projects.name AS project_name,
                products.id AS product_id,
                products.name AS product_name,
                tasks.id AS task_id,
                tasks.title AS task_title,
                strings.id AS string_id,
                strings.content AS string_content
            FROM projects
            LEFT JOIN products ON projects.id = products.project_id
            LEFT JOIN tasks ON products.id = tasks.product_id
            LEFT JOIN strings ON tasks.id = strings.task_id
            ORDER BY projects.id, products.id, tasks.id, strings.id;
        `;

        const [rows] = await pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching hierarchy data:", error.message);
        next(error);
    }
}

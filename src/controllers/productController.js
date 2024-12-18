import { pool } from "../db/connect.js";

// select

export async function selectProducts(req, res, next) {
    try {
        const sql = `
            SELECT products.id, products.name, projects.name AS project_name
            FROM products
            JOIN projects ON products.project_id = projects.id`;
        const [rows] = await pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching products:", error.message);
        next(error);
    }
}

// insert

export async function insertProduct(req, res, next) {
    try {
        const { project_id, name } = req.body;

        if (!project_id || !name) {
            return res.status(400).json({ error: "Both 'project_id' and 'name' are required." });
        }

        const sql = "INSERT INTO products (project_id, name) VALUES (?, ?)";
        const [result] = await pool.query(sql, [project_id, name]);

        res.status(201).json({
            productId: result.insertId
        });
    } catch (error) {
        console.error("Error inserting product:", error.message);
        next(error);
    }
}

// update

export async function updateProduct(req, res, next) {
    try {
        const { id, name, project_id } = req.body;

        if (!id || !name || !project_id) {
            return res.status(400).json({ error: "'id', 'name', and 'project_id' are required." });
        }

        const sql = "UPDATE products SET name = ?, project_id = ? WHERE id = ?";
        const [result] = await pool.query(sql, [name, project_id, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found." });
        }

        res.status(200).json({
            message: `Product ID ${id} updated successfully!`
        });
    } catch (error) {
        console.error("Error updating product:", error.message);
        next(error);
    }
}


// delete
export async function deleteProduct(req, res, next) {
    try {
        const { id } = req.params;

        const sql = "DELETE FROM products WHERE id = ?";
        const [result] = await pool.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found." });
        }

        res.status(200).json({
            message: `Product ID ${id} deleted successfully!`
        });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        next(error);
    }
}

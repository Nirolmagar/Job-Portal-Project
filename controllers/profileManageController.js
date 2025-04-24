const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

const updateJobSeekerProfile = async (req, res) => {
    const { id } = req.user; // Get user ID from authenticated user
    const cv = req.file ? req.file.path : null; // Get CV file path from multer

    try {
        const query = 'UPDATE users SET cv = ? WHERE id = ?'; // Ensure the correct table name
        await pool.execute(query, [cv, id]);
        res.status(200).json({ message: 'CV updated successfully' });
    } catch (error) {
        console.error('Error updating CV:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

module.exports = { updateJobSeekerProfile };

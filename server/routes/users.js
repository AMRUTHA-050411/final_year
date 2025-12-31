import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// SEARCH USERS
router.get('/search', async (req, res) => {
    const { query, subject } = req.query;

    try {
        let filter = {};

        if (query) {
            filter.name = { $regex: query, $options: 'i' };
        }

        if (subject && subject !== 'All Subjects') {
            filter['subjects.name'] = subject;
        }

        const users = await User.find(filter).select('-password'); // Exclude password
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Search failed' });
    }
});

export default router;

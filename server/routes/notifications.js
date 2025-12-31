import express from 'express';
import Notification from '../models/Notification.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedData?.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Auth failed' });
    }
};

// GET MY NOTIFICATIONS
router.get('/mine', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.userId })
            .sort({ timestamp: -1 })
            .populate('fromUserId', 'name avatar'); // Populate sender info for UI

        const mapped = notifications.map(n => ({
            ...n.toObject(),
            id: n._id,
            timestamp: n.timestamp.getTime()
        }));

        res.json(mapped);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// MARK AS READ
router.put('/:id/read', auth, async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { read: true });
        res.json({ message: "Marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// DELETE NOTIFICATION (Optional, e.g. clear all)
router.delete('/clear', auth, async (req, res) => {
    try {
        await Notification.deleteMany({ userId: req.userId });
        res.json({ message: "Notifications cleared" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;

import express from 'express';
import Connection from '../models/Connection.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js'; // Needed for population if used
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify token (should be extracted to a middleware file ideally, but inline for now)
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

// SEND INVITE
router.post('/invite', auth, async (req, res) => {
    const { targetUserId } = req.body;

    if (req.userId === targetUserId) {
        return res.status(400).json({ message: "Cannot invite yourself" });
    }

    try {
        const existingConnection = await Connection.findOne({
            $or: [
                { fromUserId: req.userId, toUserId: targetUserId },
                { fromUserId: targetUserId, toUserId: req.userId }
            ]
        });

        if (existingConnection) {
            return res.status(400).json({ message: "Connection already exists" });
        }

        const newConnection = await Connection.create({
            fromUserId: req.userId,
            toUserId: targetUserId,
            status: 'pending'
        });

        // Create Notification
        await Notification.create({
            userId: targetUserId,
            fromUserId: req.userId,
            type: 'invitation',
            content: 'sent you a buddy request.',
            timestamp: new Date()
        });

        res.status(201).json(newConnection);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// ACCEPT INVITE
router.put('/accept/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await Connection.findById(id);

        if (!connection) return res.status(404).json({ message: "Connection not found" });

        // Only the receiver can accept
        if (connection.toUserId.toString() !== req.userId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        connection.status = 'accepted';
        await connection.save();

        // Create Notification for the sender
        await Notification.create({
            userId: connection.fromUserId,
            fromUserId: req.userId,
            type: 'acceptance',
            content: 'accepted your buddy request!',
            timestamp: new Date()
        });

        res.json(connection);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// REJECT INVITE
router.put('/reject/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await Connection.findById(id);

        if (!connection) return res.status(404).json({ message: "Connection not found" });

        if (connection.toUserId.toString() !== req.userId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        connection.status = 'rejected';
        await connection.save();

        res.json(connection);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// GET MY CONNECTIONS
router.get('/mine', auth, async (req, res) => {
    try {
        const connections = await Connection.find({
            $or: [{ fromUserId: req.userId }, { toUserId: req.userId }]
        }).populate('fromUserId toUserId', '-password');
        res.json(connections);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;

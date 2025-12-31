import express from 'express';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify token (should be centralized)
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

// GET MY MESSAGES (Sent and Received)
router.get('/mine', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [{ senderId: req.userId }, { receiverId: req.userId }]
        }).sort({ timestamp: 1 });

        // Map _id to id for frontend compatibility
        const mappedMessages = messages.map(m => ({
            ...m.toObject(),
            id: m._id,
            timestamp: m.timestamp.getTime() // Frontend expects number timestamp often
        }));

        res.json(mappedMessages);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// SEND MESSAGE
router.post('/', auth, async (req, res) => {
    const { receiverId, content, type, metadata } = req.body;

    try {
        const newMessage = await Message.create({
            senderId: req.userId,
            receiverId,
            content,
            type,
            metadata,
            timestamp: new Date()
        });

        // Create Notification for new message
        await Notification.create({
            userId: receiverId,
            fromUserId: req.userId,
            type: 'message',
            content: 'sent you a message.',
            timestamp: new Date()
        });

        res.status(201).json({
            ...newMessage.toObject(),
            id: newMessage._id,
            timestamp: newMessage.timestamp.getTime()
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// MARK AS READ
router.put('/read/:buddyId', auth, async (req, res) => {
    try {
        const { buddyId } = req.params;

        // update all messages from buddy to me as read
        await Message.updateMany(
            { senderId: buddyId, receiverId: req.userId, read: false },
            { read: true }
        );

        res.json({ message: "Messages marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Recipient
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Sender/Triggerer
    type: { type: String, enum: ['invitation', 'acceptance', 'rejection', 'message', 'resource'], required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);

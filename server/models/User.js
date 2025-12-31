import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'student' },
    gradeOrClass: { type: String, default: 'Undecided' },
    department: { type: String, default: 'General' },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    subjects: [{
        name: String,
        strength: String // 'strong', 'moderate', 'weak'
    }],
    bio: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);

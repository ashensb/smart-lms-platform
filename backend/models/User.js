import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true, 
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['student', 'admin'], 
        default: 'student'
    },
    progress: [{
        courseId: String,
        completedChapters: [String],
        percentage: { type: Number, default: 0 }
    }]
}, {
    timestamps: true 
});

const User = mongoose.model('User', userSchema);
export default User;
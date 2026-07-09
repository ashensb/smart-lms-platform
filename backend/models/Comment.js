import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    courseId: {
        type: String, 
        required: true
    },
    lectureId: {
        type: String, 
        required: true
    },
    user: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: String, enum: ['student', 'admin'], default: 'student' }
    },
    text: {
        type: String,
        required: [true, 'Comment content cannot be empty']
    },
    replies: [{
        user: {
            id: { type: String, required: true },
            name: { type: String, required: true },
            role: { type: String, enum: ['student', 'admin'] }
        },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true 
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
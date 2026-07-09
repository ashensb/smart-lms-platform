import express from 'express';
import Comment from '../models/Comment.js';

const router = express.Router();

router.get('/:lectureId', async (req, res) => {
    try {
        const { lectureId } = req.params;
        const comments = await Comment.find({ lectureId }).sort({ createdAt: -1 }); 
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


router.post('/add', async (req, res) => {
    try {
        const { courseId, lectureId, userId, userName, userRole, text } = req.body;

        const newComment = new Comment({
            courseId,
            lectureId,
            user: { id: userId, name: userName, role: userRole },
            text
        });

        await newComment.save();
        res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


router.post('/reply/:commentId', async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId, userName, userRole, text } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        comment.replies.push({
            user: { id: userId, name: userName, role: userRole },
            text
        });

        await comment.save();
        res.status(200).json({ success: true, comment });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

export default router;
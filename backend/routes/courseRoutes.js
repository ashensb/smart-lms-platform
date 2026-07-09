import express from 'express'; 
import Course from '../models/Course.js'; 
import User from '../models/User.js';

const router = express.Router();

// ➕ 1. Create Course API
router.post('/create', async (req, res) => {
    try {
        const { title, description, instructor, thumbnail, category, modules } = req.body;
        
        const newCourse = new Course({
            title, description, instructor, thumbnail, category, modules
        });

        await newCourse.save();
        res.status(201).json({ success: true, message: 'Course created successfully! 🎓', course: newCourse });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// 📚 2. Get All Courses API
router.get('/all', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// 🔄 Course Update Route
router.put('/update/:id', async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCourse);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ❌ Course Delete Route
router.delete('/delete/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully!" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 🔄 3. Update Student Video Progress API 
router.post('/progress/update', async (req, res) => {
    try {
        const { userId, courseId, lectureId, totalLectures } = req.body;

        
        const user = await mongoose.model('User').findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

       
        let courseProgress = user.progress.find(p => p.courseId === courseId);

        if (!courseProgress) {
            
            courseProgress = {
                courseId,
                completedChapters: [lectureId],
                percentage: totalLectures > 0 ? Math.round((1 / totalLectures) * 100) : 0
            };
            user.progress.push(courseProgress);
        } else {
            
            if (!courseProgress.completedChapters.includes(lectureId)) {
                courseProgress.completedChapters.push(lectureId);
                
                courseProgress.percentage = Math.round((courseProgress.completedChapters.length / totalLectures) * 100);
            }
        }

        await user.save();
        res.status(200).json({ success: true, progress: user.progress });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// 📊 4. Get Student Progress For a Course API
router.get('/progress/:userId/:courseId', async (req, res) => {
    try {
        const { userId, courseId } = req.params;
        const user = await mongoose.model('User').findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const courseProgress = user.progress.find(p => p.courseId === courseId);
        res.status(200).json(courseProgress || { courseId, completedChapters: [], percentage: 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});
export default router;
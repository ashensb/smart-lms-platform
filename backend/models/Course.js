import mongoose from 'mongoose'; 

const lectureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    duration: { type: String }
});

const moduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lectures: [lectureSchema]
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    thumbnail: { type: String, default: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee' },
    category: { type: String, required: true },
    modules: [moduleSchema],
    createdIn: { type: Date, default: Date.now }
});


export default mongoose.model('Course', courseSchema);
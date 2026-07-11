import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, PlayCircle, CheckCircle2, Circle, Menu, Award, MessageSquare, CornerDownRight, Send } from 'lucide-react';

export default function CourseViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  
  const userId = "668be2ca22b8214fa3ca0d49";
  const userName = "Prof. Minel Student"; 
  const userRole = "student"; 

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLecture, setActiveLecture] = useState(null);
  
  // 📊 Progress States
  const [completedLectures, setCompletedLectures] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);

  // 💬 Q&A / Comment States
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyText, setReplyText] = useState({}); // { commentId: "text" }
  const [activeReplyBox, setActiveReplyBox] = useState(null); 

  //  Course & Progress Fetch
  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        const response = await axios.get(`http://65.2.25.61:5000/api/courses/all`);
        const foundCourse = response.data.find(c => c._id === id);
        setCourse(foundCourse);
        
        if (foundCourse?.modules?.[0]?.lectures?.[0]) {
          setActiveLecture(foundCourse.modules[0].lectures[0]);
        }

        if (userId) {
          const progressRes = await axios.get(`http://65.2.25.61:5000/api/courses/progress/${userId}/${id}`);
          if (progressRes.data && progressRes.data.success !== false) {
            setCompletedLectures(progressRes.data.completedChapters || []);
            setProgressPercentage(progressRes.data.percentage || 0);
          }
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseAndProgress();
  }, [id, userId]);

 
  useEffect(() => {
    if (activeLecture) {
      const lectureIdentifier = activeLecture._id || activeLecture.title;
      axios.get(`http://65.2.25.61:5000/api/comments/${lectureIdentifier}`)
        .then(res => setComments(res.data))
        .catch(err => console.error("Error fetching comments:", err));
    }
  }, [activeLecture]);

  const totalLectures = course?.modules?.reduce((acc, m) => acc + (m.lectures?.length || 0), 0) || 0;

 
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeLecture) return;

    const lectureIdentifier = activeLecture._id || activeLecture.title;

    try {
      const res = await axios.post(`http://65.2.25.61:5000/api/comments/add`, {
        courseId: id,
        lectureId: lectureIdentifier,
        userId,
        userName,
        userRole,
        text: newCommentText
      });

      if (res.data.success) {
        setComments([res.data.comment, ...comments]); 
        setNewCommentText('');
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleReplySubmit = async (commentId) => {
    const text = replyText[commentId];
    if (!text || !text.trim()) return;

    try {
      const res = await axios.post(`http://65.2.25.61:5000/api/comments/reply/${commentId}`, {
        userId,
        userName,
        userRole,
        text
      });

      if (res.data.success) {
        
        setComments(comments.map(c => c._id === commentId ? res.data.comment : c));
        setReplyText({ ...replyText, [commentId]: '' });
        setActiveReplyBox(null);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return "https://www.youtube.com/embed/w7wco9N_eNo";
    const regExp = /^.*(dQw4w9WgXcQ|kgaD6XvS9lY|youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : "https://www.youtube.com/embed/w7wco9N_eNo";
  };

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div></div>;
  if (!course) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Course not found!</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* TOP HEADER */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-4 sticky top-0 z-10">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white"><ChevronLeft className="h-5 w-5" /></button>
        <div className="overflow-hidden flex-1">
          <h2 className="text-sm font-bold text-white truncate">{course.title}</h2>
          <p className="text-xs text-slate-400 truncate">by {course.instructor}</p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT SIDE: VIDEO & COMMENTS */}
        <div className="flex-1 bg-black flex flex-col justify-start p-4 md:p-6 space-y-5 overflow-y-auto">
          
          {/* PROGRESS PANEL */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2 shadow-lg">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5 text-blue-400"><Award className="h-4 w-4" /> COURSE PROGRESS</span>
              <span>{progressPercentage}% Completed ({completedLectures.length}/{totalLectures})</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>

          {/* VIDEO PLAYER */}
          <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            {activeLecture ? (
              <iframe className="w-full h-full" src={getEmbedUrl(activeLecture?.videoUrl)} title={activeLecture?.title} allowFullScreen></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">No video selected</div>
            )}
          </div>

          {/* Title Box */}
          <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-900">
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full">Currently Playing</span>
            <h3 className="text-lg font-bold text-white mt-1.5">{activeLecture?.title || "Select a lecture"}</h3>
            <p className="text-xs text-slate-400">Duration: {activeLecture?.duration || 0} mins</p>
          </div>

          {/*  Q&A / COMMENT SECTION (NEW) */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 md:p-6 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" /> Discussion & Q&A ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex gap-3">
              <input
                type="text"
                placeholder="Ask a question or leave a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-blue-500 text-slate-200"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-xl transition-colors text-white shrink-0">
                <Send className="h-4 w-4" />
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4 pt-2">
              {comments.map((comment) => (
                <div key={comment._id} className="border-b border-slate-800/60 pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{comment.user?.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-semibold uppercase ${comment.user?.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400'}`}>
                        {comment.user?.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-300 ml-1">{comment.text}</p>

                  {/* Replies Rendering */}
                  {comment.replies?.map((reply, rIdx) => (
                    <div key={reply._id || rIdx} className="flex gap-2 ml-6 mt-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/40">
                      <CornerDownRight className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-300">{reply.user?.name}</span>
                          <span className={`text-[9px] px-1 py-0.2 rounded-sm font-semibold uppercase ${reply.user?.role === 'admin' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                            {reply.user?.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{reply.text}</p>
                      </div>
                    </div>
                  ))}

                  {/* Reply Button Trigger */}
                  <div className="ml-1 pt-1">
                    <button 
                      onClick={() => setActiveReplyBox(activeReplyBox === comment._id ? null : comment._id)}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      Reply
                    </button>
                  </div>

                  {/* Reply Input Box */}
                  {activeReplyBox === comment._id && (
                    <div className="flex gap-2 ml-6 mt-2">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText[comment._id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [comment._id]: e.target.value })}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-hidden focus:border-blue-500"
                      />
                      <button 
                        onClick={() => handleReplySubmit(comment._id)}
                        className="bg-slate-800 hover:bg-slate-700 text-xs px-3 rounded-lg text-white"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {comments.length === 0 && <p className="text-xs text-slate-500 text-center py-4">No questions yet. Be the first to ask!</p>}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: COURSE SYLLABUS */}
        <aside className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-5">
            <h3 className="font-bold text-sm text-white flex items-center gap-2"><Menu className="h-4 w-4 text-blue-500" /> Course Content</h3>
          </div>
          <div className="divide-y divide-slate-800/50">
            {course.modules?.map((module, mIdx) => (
              <div key={module._id || mIdx} className="p-2">
                <div className="px-3 py-2"><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider line-clamp-1">{module.title}</h4></div>
                <div className="mt-1 space-y-0.5">
                  {module.lectures?.map((lecture, lIdx) => {
                    const lectureIdentifier = lecture._id || lecture.title;
                    const isActive = activeLecture?._id === lecture._id || activeLecture?.title === lecture.title;
                    return (
                      <button key={lecture._id || lIdx} onClick={() => setActiveLecture(lecture)} className={`w-full flex items-start justify-between p-3 rounded-xl text-left transition-all ${isActive ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800/60 text-slate-300'}`}>
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <PlayCircle className={`h-4 w-4 mt-0.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          <div className="min-w-0">
                            <p className="text-xs font-medium line-clamp-2 leading-snug">{lecture.title}</p>
                            <span className={`text-[10px] block mt-1 ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>{lecture.duration || "00:00"} mins</span>
                          </div>
                        </div>
                        <div className="shrink-0 ml-2">
                          {completedLectures.includes(lectureIdentifier) ? <CheckCircle2 className={`h-4 w-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} /> : <Circle className={`h-4 w-4 ${isActive ? 'text-blue-300' : 'text-slate-700'}`} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}
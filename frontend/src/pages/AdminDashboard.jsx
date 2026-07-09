import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { 
  PlusCircle, BookOpen, Users, Trash2, Edit3,
  Loader2, FolderPlus, List, GraduationCap, LogOut, X, Tag, Video, Folder, PlayCircle, Layers
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);

  //  Course Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    thumbnail: '',
    category: 'Web Development' 
  });

  // 🎬 Module/Lecture Management States
  const [selectedCourseForContent, setSelectedCourseForContent] = useState(null);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('');
  
  const [lectureForm, setLectureForm] = useState({
    title: '',
    videoUrl: '',
    duration: ''
  });

  const defaultPlaceholder = "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=500";

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses/all');
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/courses/update/${currentCourseId}`, formData);
        alert('Course updated successfully! 🎉');
      } else {
        await axios.post('http://localhost:5000/api/courses/create', { ...formData, modules: [] });
        alert('Course added successfully! 🎓');
      }
      setFormData({ title: '', description: '', instructor: '', thumbnail: '', category: 'Web Development' });
      setIsEditing(false);
      setCurrentCourseId(null);
      setActiveTab('overview');
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to save course!");
    } finally {
      setIsLoading(false);
    }
  };

  //  Add Module Function
  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return alert("Enter a module title!");
    try {
      const updatedModules = [...(selectedCourseForContent.modules || []), { title: newModuleTitle, lectures: [] }];
      const res = await axios.put(`http://localhost:5000/api/courses/update/${selectedCourseForContent._id}`, {
        ...selectedCourseForContent,
        modules: updatedModules
      });
      setSelectedCourseForContent(res.data);
      setNewModuleTitle('');
      fetchCourses();
      alert("Module added! 📁");
    } catch (error) {
      alert("Failed to add module");
    }
  };

  //  Delete Module Function
  const handleDeleteModule = async (moduleId, moduleTitle) => {
    if (!window.confirm(`Are you sure you want to delete module "${moduleTitle}" and all its videos?`)) return;
    try {
      const updatedModules = selectedCourseForContent.modules.filter(mod => 
        moduleId ? mod._id !== moduleId : mod.title !== moduleTitle
      );

      const res = await axios.put(`http://localhost:5000/api/courses/update/${selectedCourseForContent._id}`, {
        ...selectedCourseForContent,
        modules: updatedModules
      });
      setSelectedCourseForContent(res.data);
      if (selectedModuleId === moduleId || selectedModuleId === moduleTitle) {
        setSelectedModuleId('');
      }
      fetchCourses();
      alert("Module deleted successfully! 🗑️");
    } catch (error) {
      alert("Failed to delete module");
    }
  };

  //  Add Lecture Function
  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (!selectedModuleId) return alert("Select a module first!");
    if (!lectureForm.title || !lectureForm.videoUrl) return alert("Fill all lecture details!");

    try {
      const updatedModules = selectedCourseForContent.modules.map(mod => {
        if (mod._id === selectedModuleId || mod.title === selectedModuleId) {
          return {
            ...mod,
            lectures: [...(mod.lectures || []), { ...lectureForm, duration: Number(lectureForm.duration) || 0 }]
          };
        }
        return mod;
      });

      const res = await axios.put(`http://localhost:5000/api/courses/update/${selectedCourseForContent._id}`, {
        ...selectedCourseForContent,
        modules: updatedModules
      });

      setSelectedCourseForContent(res.data);
      setLectureForm({ title: '', videoUrl: '', duration: '' });
      fetchCourses();
      alert("Lecture added successfully! 🚀");
    } catch (error) {
      alert("Failed to add lecture");
    }
  };

  //  Delete Lecture Function
  const handleDeleteLecture = async (modIdOrTitle, lectureIndex) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) return;
    try {
      const updatedModules = selectedCourseForContent.modules.map(mod => {
        if (mod._id === modIdOrTitle || mod.title === modIdOrTitle) {
          return {
            ...mod,
            lectures: mod.lectures.filter((_, idx) => idx !== lectureIndex)
          };
        }
        return mod;
      });

      const res = await axios.put(`http://localhost:5000/api/courses/update/${selectedCourseForContent._id}`, {
        ...selectedCourseForContent,
        modules: updatedModules
      });
      setSelectedCourseForContent(res.data);
      fetchCourses();
      alert("Lecture deleted successfully! 🗑️");
    } catch (error) {
      alert("Failed to delete lecture");
    }
  };

  const startEdit = (course) => {
    setFormData({ title: course.title, description: course.description, instructor: course.instructor, thumbnail: course.thumbnail, category: course.category || 'Web Development' });
    setCurrentCourseId(course._id);
    setIsEditing(true);
    setActiveTab('add-course');
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/delete/${courseId}`);
        fetchCourses();
      } catch (error) {
        alert("Failed to delete course!");
      }
    }
  };

  
  const currentActiveModule = selectedCourseForContent?.modules?.find(m => m._id === selectedModuleId || m.title === selectedModuleId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans">
      
      {/* 📁 SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-5 hidden md:flex sticky top-0 h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="space-y-7">
          <div className="flex items-center gap-3 py-2 px-1">
            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-md shadow-blue-100">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">AdminPanel</span>
          </div>

          <nav className="space-y-1">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
              <List className="h-4 w-4" /> Overview
            </button>
            <button onClick={() => { if(!isEditing) setFormData({ title: '', description: '', instructor: '', thumbnail: '', category: 'Web Development' }); setActiveTab('add-course'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'add-course' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
              <FolderPlus className="h-4 w-4" /> {isEditing ? 'Edit Course' : 'Add Course'}
            </button>
          </nav>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-1">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold uppercase border border-blue-100">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-md inline-block uppercase mt-0.5">ADMIN</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200/60 py-2.5 rounded-xl text-sm font-semibold transition-all text-slate-500">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* 💻 MAIN CONTENT CONTAINER */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto space-y-8 overflow-y-auto">
        
        {activeTab === 'overview' && (
          <>
            {/* TOP CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/50"><BookOpen className="h-5 w-5" /></div>
                <div><h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Courses</h3><p className="text-2xl font-bold text-slate-800">{courses.length}</p></div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/50"><Users className="h-5 w-5" /></div>
                <div><h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Students</h3><p className="text-2xl font-bold text-slate-800">142</p></div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100/50"><Tag className="h-5 w-5" /></div>
                <div><h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Categories</h3><p className="text-sm font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg inline-block mt-0.5">Active</p></div>
              </div>
            </div>

            {/*  COURSE LIST TABLE */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap className="text-blue-600" /> Manage Courses
              </h2>
              
              {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600" /></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-bold tracking-wider">
                        <th className="pb-3 px-4">Course Details</th>
                        <th className="pb-3 px-4">Category</th>
                        <th className="pb-3 px-4">Content</th>
                        <th className="pb-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {courses.map(c => (
                        <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 flex items-center gap-3.5">
                            <img src={c.thumbnail} alt="" className="w-14 aspect-video object-cover rounded-lg bg-slate-100 border border-slate-200/60 shadow-sm" onError={(e) => { e.target.onerror = null; e.target.src = defaultPlaceholder; }} />
                            <div>
                              <span className="font-semibold text-slate-700 line-clamp-1">{c.title}</span>
                              <span className="text-[11px] text-slate-400 font-medium">by {c.instructor}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium border border-slate-200/40">{c.category}</span>
                          </td>
                          <td className="py-4 px-4">
                            <button 
                              onClick={() => { setSelectedCourseForContent(c); setIsContentModalOpen(true); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-all border border-blue-100/50 shadow-2xs"
                            >
                              <Layers className="h-3.5 w-3.5" /> Videos ({c.modules?.reduce((acc, m) => acc + (m.lectures?.length || 0), 0) || 0})
                            </button>
                          </td>
                          <td className="py-4 px-4 text-right space-x-1">
                            <button onClick={() => startEdit(c)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(c._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/*  TAB 2: ADD / EDIT COURSE FORM */}
        {activeTab === 'add-course' && (
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <PlusCircle className="text-blue-600" /> {isEditing ? 'Edit Existing Course' : 'Create New Course'}
              </h2>
              {isEditing && (
                <button onClick={() => { setIsEditing(false); setFormData({title:'', description:'', instructor:'', thumbnail:'', category:'Web Development'}); setActiveTab('overview'); }} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1.5 tracking-wider">Course Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder-slate-400" placeholder="Ex: DevOps Masterclass" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1.5 tracking-wider">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none transition-all cursor-pointer font-medium">
                  <option value="Web Development">Web Development</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1.5 tracking-wider">Instructor Name</label>
                <input required type="text" value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder-slate-400" placeholder="Ex: Prof. Jenny" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1.5 tracking-wider">Thumbnail URL</label>
                <input required type="text" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder-slate-400" placeholder="https://images.unsplash.com/photo-..." />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1.5 tracking-wider">Description</label>
                <textarea required rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all resize-none placeholder-slate-400" placeholder="Enter course specifications..."></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-blue-100 transition-all active:scale-[0.99] text-sm mt-2">
                {isEditing ? 'Update Course' : 'Publish Course'}
              </button>
            </form>
          </div>
        )}

      </main>

      {/*  MODAL FOR ADDING & DELETING MODULES & VIDEOS */}
      {isContentModalOpen && selectedCourseForContent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-all">
          <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl p-6 md:p-8 shadow-2xl max-h-[85vh] overflow-y-auto space-y-6">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Video className="text-blue-600" /> Manage Videos & Course Syllabus</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Course: {selectedCourseForContent.title}</p>
              </div>
              <button onClick={() => { setIsContentModalOpen(false); setSelectedModuleId(''); }} className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all"><X className="h-5 w-5" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Create & Manage Module */}
              <div className="space-y-4 bg-slate-50/60 p-4 rounded-2xl border border-slate-200/50">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5"><Folder className="h-3.5 w-3.5 text-blue-500" /> 1. Create & Manage Module</h4>
                <div className="flex gap-2">
                  <input type="text" placeholder="e.g., Introduction" value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500 transition-all" />
                  <button onClick={handleAddModule} className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 rounded-xl text-xs font-bold shadow-sm transition-all">+</button>
                </div>

                {/* Modules List inside modal with DELETE Option */}
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pt-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Existing Modules:</p>
                  {selectedCourseForContent.modules?.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No modules added yet.</p>
                  ) : (
                    selectedCourseForContent.modules?.map((m, idx) => (
                      <div key={m._id || idx} className={`text-xs font-semibold px-3 py-2 rounded-xl flex justify-between items-center border transition-all shadow-2xs ${selectedModuleId === (m._id || m.title) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200/60 text-slate-600'}`}>
                        <span className="truncate pr-2 cursor-pointer flex-1" onClick={() => setSelectedModuleId(m._id || m.title)}>📁 {m.title}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-md text-slate-400 font-bold">{m.lectures?.length || 0} vids</span>
                          <button type="button" onClick={() => handleDeleteModule(m._id, m.title)} className="text-slate-400 hover:text-rose-600 transition-colors p-1 hover:bg-rose-50 rounded-md">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Add Video */}
              <div className="space-y-4">
                <form onSubmit={handleAddLecture} className="space-y-3 bg-slate-50/40 p-4 rounded-2xl border border-slate-200/40">
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5"><PlayCircle className="h-3.5 w-3.5 text-blue-500" /> 2. Add Video/Lecture</h4>
                  
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Select Module</label>
                    <select required value={selectedModuleId} onChange={e => setSelectedModuleId(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500 transition-all text-slate-700 font-medium">
                      <option value="">-- Choose Module --</option>
                      {selectedCourseForContent.modules?.map((m, idx) => (
                        <option key={m._id || idx} value={m._id || m.title}>{m.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Video Title</label>
                    <input required type="text" placeholder="e.g., Setting up Environment" value={lectureForm.title} onChange={e => setLectureForm({...lectureForm, title: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500" />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">YouTube URL</label>
                      <input required type="text" placeholder="https://www.youtube.com/watch?v=..." value={lectureForm.videoUrl} onChange={e => setLectureForm({...lectureForm, videoUrl: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Mins</label>
                      <input required type="number" placeholder="15" value={lectureForm.duration} onChange={e => setLectureForm({...lectureForm, duration: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs shadow-sm transition-all mt-1">
                    Add Video to Module
                  </button>
                </form>

                {/*  Lectures List with individual DELETE Buttons */}
                {selectedModuleId && (
                  <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/50 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Lectures in Selected Module ({currentActiveModule?.lectures?.length || 0}):</p>
                    <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
                      {(!currentActiveModule?.lectures || currentActiveModule.lectures.length === 0) ? (
                        <p className="text-xs text-slate-400 italic">No videos in this module yet.</p>
                      ) : (
                        currentActiveModule.lectures.map((lec, lIdx) => (
                          <div key={lIdx} className="text-xs bg-white border border-slate-200/60 px-3 py-2 rounded-xl flex justify-between items-center shadow-3xs">
                            <div className="truncate pr-2 flex flex-col">
                              <span className="font-semibold text-slate-700 truncate">{lIdx + 1}. {lec.title}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{lec.duration} mins</span>
                            </div>
                            <button type="button" onClick={() => handleDeleteLecture(selectedModuleId, lIdx)} className="text-slate-400 hover:text-rose-600 transition-colors p-1 hover:bg-rose-50 rounded-md shrink-0">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
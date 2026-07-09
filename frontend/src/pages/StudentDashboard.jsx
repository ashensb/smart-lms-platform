import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { 
  LogOut, BookOpen, Award, BarChart2, Bell, Search, 
  PlayCircle, Clock, BookOpenCheck, LayoutDashboard, User, Loader2, Mail, Shield, ChevronRight
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  //  States
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  //  Fetch All Courses
  useEffect(() => {
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
    fetchCourses();
  }, []);

  //  Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //  Default Placeholder Image URL
  const defaultPlaceholder = "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=500";

  return (
    
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans selection:bg-blue-500/10">
      
      {/* 📁 1. SIDEBAR (Premium Crisp Light Look) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-5 hidden md:flex sticky top-0 h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="space-y-7">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 py-2 px-1 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md shadow-blue-100">
              <BookOpenCheck className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">SmartLMS</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'courses' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <BookOpen className="h-4 w-4" /> My Courses
            </button>
            <button 
              onClick={() => setActiveTab('certificates')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'certificates' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Award className="h-4 w-4" /> Certificates
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'profile' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <User className="h-4 w-4" /> Profile
            </button>
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-1">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold uppercase border border-blue-100">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Student User'}</p>
              <p className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-md inline-block uppercase mt-0.5 tracking-wider">{user?.role || 'STUDENT'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200/60 py-2.5 rounded-xl text-sm font-semibold transition-all text-slate-500"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* 💻 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP NAVBAR (Clean Light Header) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 sticky top-0 z-10 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
          <div className="relative w-72 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search your courses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/60 relative transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-blue-600 rounded-full"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <span className="text-sm font-medium text-slate-600 hidden md:inline">Welcome, <b className="text-slate-800 font-semibold">{user?.name}</b></span>
          </div>
        </header>

        {/* ---------------- CONDITIONAL TABS RENDERING ---------------- */}
        <div className="p-6 md:p-10 max-w-6xl w-full mx-auto space-y-8 flex-1">
          
          {/* TAB 1: MAIN DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Banner (Professional Soft-Blue Tech Style) */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-md shadow-blue-100">
                <div className="relative z-10 max-w-md text-white">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Keep learning, <br/>reach your targets!</h2>
                  <p className="text-sm text-blue-100/90 leading-relaxed mt-3">You have completed 65% of your learning path this week. Keep up the amazing work!</p>
                </div>
                <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
              </div>

              {/* STATS CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/50"><BookOpen className="h-5 w-5" /></div>
                  <div><h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Enrolled Courses</h3><p className="text-2xl font-bold mt-0.5 text-slate-800">{courses.length}</p></div>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/50"><BarChart2 className="h-5 w-5" /></div>
                  <div><h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Progress</h3><p className="text-2xl font-bold mt-0.5 text-emerald-600">65%</p></div>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100/50"><Award className="h-5 w-5" /></div>
                  <div><h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Certificates</h3><p className="text-2xl font-bold mt-0.5 text-amber-600">1</p></div>
                </div>
              </div>

              {/* RECENT COURSES SECTION */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold tracking-tight text-slate-800 flex items-center gap-2">
                    <BookOpenCheck className="h-5 w-5 text-blue-600" /> Your Learning Progress
                  </h3>
                  <button onClick={() => setActiveTab('courses')} className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100/60 px-3 py-1.5 rounded-xl border border-blue-100 flex items-center gap-1">View All <ChevronRight className="h-3 w-3" /></button>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
                    <p className="text-xs font-semibold text-slate-500">Loading live courses...</p>
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border border-slate-200 shadow-sm font-medium text-sm">
                    No matching courses found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <div 
                        key={course._id} 
                        onClick={() => navigate(`/course/${course._id}`)} 
                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col group cursor-pointer shadow-sm"
                      >
                        <div className="relative aspect-video overflow-hidden bg-slate-100">
                          {/* 🌟 1 වෙනි තැන: Error Handling එකතු කළා */}
                          <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = defaultPlaceholder;
                            }}
                          />
                          <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                            <button className="p-3 bg-blue-600 text-white rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-500">
                              <PlayCircle className="h-5 w-5 fill-white/10" />
                            </button>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md border border-slate-200/40 uppercase tracking-wider">{course.category || 'Tech'}</span>
                            <h4 className="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200 mt-2">{course.title}</h4>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">by {course.instructor}</p>
                          </div>

                          <div className="space-y-2 pt-3 border-t border-slate-100">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-400 font-semibold flex items-center gap-1.5"><Clock className="h-3 w-3 text-slate-400" /> {course.modules?.length || 0} Modules</span>
                              <span className="font-bold text-blue-600">75%</span> 
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: `75%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: MY COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><BookOpen className="text-blue-600 h-5 w-5" /> Enrolled Courses ({courses.length})</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course._id} onClick={() => navigate(`/course/${course._id}`)} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col group cursor-pointer shadow-sm">
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      {/*  2  */}
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = defaultPlaceholder;
                        }}
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{course.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">by {course.instructor}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center max-w-md mx-auto space-y-4 shadow-sm">
              <div className="h-14 w-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-100 shadow-sm"><Award className="h-6 w-6" /></div>
              <h3 className="text-lg font-bold text-slate-800">MERN Stack Completion Certificate</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Issued on successfully completing all requirements of the Web Development path.</p>
              <button className="w-full mt-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold rounded-xl text-slate-700 transition-all">Download PDF Certificate</button>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
                <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-md shadow-blue-100">{user?.name?.charAt(0) || 'S'}</div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{user?.name}</h3>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-1 flex items-center gap-1"><Shield className="h-3 w-3" /> {user?.role || 'STUDENT'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Full Name</label>
                  <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm text-slate-700 font-medium">{user?.name}</div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Email Address</label>
                  <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm text-slate-700 font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" /> {user?.email || "student@smartlms.com"}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
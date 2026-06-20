import { useState, useMemo, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, ArrowLeft, ChevronRight, ArrowRight, CheckCircle } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// Remove mock data import
import axios from 'axios';

// Sub-components
import { YearSelection, SemesterSelection, SubjectSelection } from '../components/study/SelectionComponents';
import GroupContent from '../components/study/GroupContent';
import PersonalizedPanel from '../components/study/PersonalizedPanel';
import { StudyModals } from '../components/study/StudyModals';

const staticYears = [
    { id: 'y1', label: 'Year 1', desc: 'Freshman Foundation', stats: '12 Active Groups', color: 'from-blue-600 to-indigo-700', bgFade: 'bg-blue-100', iconColor: 'text-blue-700' },
    { id: 'y2', label: 'Year 2', desc: 'Core Modules', stats: '24 Active Groups', color: 'from-emerald-500 to-teal-600', bgFade: 'bg-emerald-100', iconColor: 'text-emerald-700' },
    { id: 'y3', label: 'Year 3', desc: 'Advanced Topics', stats: '18 Active Groups', color: 'from-amber-500 to-orange-600', bgFade: 'bg-amber-100', iconColor: 'text-amber-700' },
    { id: 'y4', label: 'Year 4', desc: 'Final Project', stats: '8 Active Groups', color: 'from-purple-600 to-rose-600', bgFade: 'bg-purple-100', iconColor: 'text-purple-700' }
];

const staticSemesters = [
    { id: 's1', label: 'Semester 1', desc: 'First half of the academic year', stats: '20+ Subjects', color: 'from-violet-600 to-fuchsia-700', bgFade: 'bg-violet-100', iconColor: 'text-violet-700' },
    { id: 's2', label: 'Semester 2', desc: 'Second half of the academic year', stats: '18+ Subjects', color: 'from-cyan-500 to-blue-600', bgFade: 'bg-cyan-100', iconColor: 'text-cyan-700' }
];

const StudyPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useContext(AuthContext);

    const selectedYear = searchParams.get('y') || null;
    const selectedSemester = searchParams.get('s') || null;
    const selectedSubject = searchParams.get('sub') || null;
    const selectedGroup = searchParams.get('g') || null;

    // State
    const [dbStudyGroups, setDbStudyGroups] = useState([]);
    const [dbStudyMaterials, setDbStudyMaterials] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [activeTab, setActiveTab] = useState('notes');
    const [localMaterials, setLocalMaterials] = useState({ notes: [], videos: [], links: [] });
    const [localReminders, setLocalReminders] = useState([]);
    const [myMaterials, setMyMaterials] = useState([]);
    const [bookmarkState, setBookmarkState] = useState({});
    
    // Modal States
    const [ratingModal, setRatingModal] = useState({ show: false, type: null, id: null, title: '', rating: 0, reviews: 0, comment: '', comments: [] });
    const [editModal, setEditModal] = useState({ show: false, type: null, material: null });
    const [addModal, setAddModal] = useState({ show: false, type: null });
    const [reminderModal, setReminderModal] = useState({ show: false, mode: 'add', reminder: null });
    const [summaryModal, setSummaryModal] = useState({ show: false, material: null, summary: '', loading: false, error: '' });
    const [commentsModal, setCommentsModal] = useState({ show: false, video: null, newComment: '' });
    
    const [addModalFile, setAddModalFile] = useState(null);
    const [addModalImage, setAddModalImage] = useState(null);
    const [editModalImage, setEditModalImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [dragOverImg, setDragOverImg] = useState(false);
    const [successToast, setSuccessToast] = useState({ show: false, message: '' });
    const fileInputRef = useRef(null);

    const updateParams = (updates, deletes) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([k, v]) => newParams.set(k, v));
        deletes.forEach(k => newParams.delete(k));
        setSearchParams(newParams);
    };

    const setSelectedYear = (val) => val ? updateParams({ y: val }, ['s', 'sub', 'g']) : updateParams({}, ['y', 's', 'sub', 'g']);
    const setSelectedSemester = (val) => val ? updateParams({ s: val }, ['sub', 'g']) : updateParams({}, ['s', 'sub', 'g']);

    // Data Fetching
    const fetchGroups = async () => {
        try {
            const { data } = await axios.get('/api/study-groups');
            setDbStudyGroups(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching study groups:", error);
        }
    };

    const fetchGroupMaterials = async (groupId) => {
        try {
            const url = userInfo ? `/api/study-materials/${groupId}?userId=${userInfo._id || userInfo.id}` : `/api/study-materials/${groupId}`;
            const { data } = await axios.get(url);
            setDbStudyMaterials(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching study materials:", error);
            setDbStudyMaterials([]);
        }
    };

    const fetchReminders = async () => {
        if (!userInfo?.token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/lecture-reminders', config);
            setLocalReminders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching reminders:", error);
            setLocalReminders([]);
        }
    };

    const fetchMyMaterials = async () => {
        if (!userInfo?._id) return;
        try {
            const { data } = await axios.get(`/api/study-materials/user/${userInfo._id}`);
            const formatted = Array.isArray(data) ? data.map(m => ({ ...m, id: m._id })) : [];
            setMyMaterials(formatted);
        } catch (error) {
            console.error("Error fetching my materials:", error);
            setMyMaterials([]);
        }
    };

    useEffect(() => {
        fetchGroups();
        const interval = setInterval(() => {
            fetchGroups();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            fetchGroupMaterials(selectedGroup);
        }
    }, [selectedGroup]);

    useEffect(() => {
        fetchReminders();
        fetchMyMaterials();
    }, [userInfo]);

    useEffect(() => {
        if (dbStudyMaterials.length > 0 && userInfo) {
            const initialState = {};
            dbStudyMaterials.forEach(m => {
                const bookmarks = m.bookmarks || [];
                const isBookmarked = userInfo.noteBookmarks?.includes(m._id.toString()) || bookmarks.includes(userInfo._id.toString());
                initialState[m._id] = { bookmarked: isBookmarked, count: bookmarks.length };
            });
            setBookmarkState(initialState);
        }
    }, [dbStudyMaterials, userInfo]);

    // Handlers
    const handleBookmark = async (noteId) => {
        if (!userInfo) { setShowAuthModal(true); return; }
        const current = bookmarkState[noteId] || { bookmarked: false, count: 0 };
        const newBookmarked = !current.bookmarked;

        setBookmarkState(prev => ({
            ...prev,
            [noteId]: { bookmarked: newBookmarked, count: newBookmarked ? current.count + 1 : Math.max(0, current.count - 1) }
        }));

        try {
            const { data } = await axios.post(`/api/study-materials/${noteId}/bookmark`, { userId: userInfo._id || userInfo.id });
            const newUserInfo = { ...userInfo, noteBookmarks: data.noteBookmarks || [] };
            setUserInfo(newUserInfo);
            localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
        } catch (error) {
            setBookmarkState(prev => ({ ...prev, [noteId]: current }));
            console.error('Bookmark error:', error);
        }
    };

    const [submitTimer, setSubmitTimer] = useState(null);

    const handleRatingSubmit = (score) => {
        if (!userInfo) { setShowAuthModal(true); return; }
        
        setRatingModal(prev => ({ ...prev, rating: score }));
        
        if (submitTimer) clearTimeout(submitTimer);
        
        const newTimer = setTimeout(async () => {
            const { id } = ratingModal;
            setIsSubmitting(true);
            try {
                await axios.post(`/api/study-materials/${id}/rate`, {
                    userId: userInfo._id || userInfo.id,
                    ratingValue: score
                });
                
                setTimeout(() => {
                    setRatingModal(prev => ({ ...prev, show: false }));
                    setIsSubmitting(false);
                    fetchGroupMaterials(selectedGroup);
                }, 800);
            } catch (err) {
                setIsSubmitting(false);
                alert("Failed to submit rating.");
            }
        }, 1500);
        
        setSubmitTimer(newTimer);
    };

    const handleSummarize = async (material) => {
        setSummaryModal({ show: true, material, summary: '', loading: true, error: '' });
        try {
            const { data } = await axios.post(`/api/study-materials/${material.id}/summarize`);
            setSummaryModal(prev => ({ ...prev, summary: data.summary, loading: false }));
        } catch (error) {
            console.error("Frontend Summarization Error:", error);
            const msg = error.response?.data?.message || error.message || "Failed to generate AI summary.";
            setSummaryModal(prev => ({ ...prev, loading: false, error: msg }));
        }
    };

    const handleManualAddMaterial = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target);
        
        const processImage = async (imageFile) => {
            if (!imageFile) return null;
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(imageFile);
                reader.onload = () => resolve(reader.result);
            });
        };

        const processFile = async (file) => {
            if (!file) return { data: null, name: null };
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve({ data: reader.result, name: file.name });
            });
        };

        try {
            const imageUrl = await processImage(addModalImage);
            const { data: fileData, name: fileName } = await processFile(addModalFile);

            const payload = {
                groupId: selectedGroup,
                type: addModal.type,
                title: formData.get('title'),
                description: formData.get('description'),
                author: formData.get('extra'),
                link: addModal.type === 'videos' ? formData.get('extra') : null,
                uploaderId: userInfo?._id,
                coverImage: imageUrl,
                fileData: fileData,
                fileName: fileName
            };

            await axios.post('/api/study-materials', payload);
            fetchGroupMaterials(selectedGroup);
            setAddModal({ show: false, type: null });
            setAddModalImage(null);
            setAddModalFile(null);
            setIsSubmitting(false);
        } catch (error) {
            console.error("Add material error:", error);
            setIsSubmitting(false);
        }
    };

    const handleDeleteMaterial = async (type, id) => {
        if (!window.confirm('Are you sure you want to delete this material?')) return;
        
        try {
            await axios.delete(`/api/study-materials/${id}`);
            // Force refresh of the lists to avoid stale state issues
            if (selectedGroup) await fetchGroupMaterials(selectedGroup);
            await fetchMyMaterials();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete the material. Please try again.");
        }
    };

    const handleCommentSubmit = async () => {
        if (!userInfo) { setShowAuthModal(true); return; }
        try {
            const { data } = await axios.post(`/api/study-materials/${commentsModal.video.id}/comments`, {
                userId: userInfo._id,
                userName: userInfo.name,
                text: commentsModal.newComment
            });
            setCommentsModal(prev => ({ ...prev, newComment: '', video: { ...prev.video, comments: data.comments } }));
            fetchGroupMaterials(selectedGroup);
        } catch (err) { console.error(err); }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target);
        
        const processImage = async (imageFile) => {
            if (!imageFile) return null;
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(imageFile);
                reader.onload = () => resolve(reader.result);
            });
        };

        try {
            const newImageUrl = await processImage(editModalImage);
            const payload = {
                title: formData.get('title'),
                description: formData.get('description'),
                author: formData.get('extra'),
            };
            if (newImageUrl) payload.coverImage = newImageUrl;

            await axios.put(`/api/study-materials/${editModal.material.id}`, payload);
            if (selectedGroup) fetchGroupMaterials(selectedGroup);
            fetchMyMaterials();
            setEditModal({ show: false, type: null, material: null });
            setEditModalImage(null);
            setIsSubmitting(false);
        } catch (error) {
            console.error("Edit material error:", error);
            setFormError("Failed to update material.");
            setIsSubmitting(false);
        }
    };

    const handleSaveReminder = async (e) => {
        e.preventDefault();
        console.log("--- START SAVE REMINDER ---");
        setIsSubmitting(true);
        const formData = new FormData(e.target);
        
        const payload = {
            lectureId: formData.get('lectureId'),
            moduleCode: formData.get('moduleCode'),
            lectureTitle: formData.get('lectureTitle') || formData.get('moduleCode'), // FallbackTitle
            reminderTime: formData.get('reminderTime'),
            academicType: formData.get('alertType'), 
            reminderBefore: formData.get('reminderBefore') || '1 day before',
            notes: formData.get('notes')
        };

        console.log("Payload Prepared:", payload);

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            let response;

            if (reminderModal.mode === 'add') {
                console.log("API CALL: POST /api/lecture-reminders");
                response = await axios.post('/api/lecture-reminders', payload, config);
            } else {
                console.log(`API CALL: PUT /api/lecture-reminders/${reminderModal.reminder._id}`);
                response = await axios.put(`/api/lecture-reminders/${reminderModal.reminder._id}`, payload, config);
            }

            console.log("API Response Success:", response.data);

            // 1. Show Success Toast
            setSuccessToast({ show: true, message: 'Study Reminder Saved!' });
            
            setReminderModal({ show: false, mode: 'add', reminder: null, lecture: null });
            
            // Immediate Fetch to update UI
            await fetchReminders();

            setTimeout(() => setSuccessToast({ show: false, message: '' }), 3000);

            // 2. Ultra-Smooth scroll to active reminders after save
            setTimeout(() => {
                const element = document.getElementById('active-reminders');
                if (element) {
                    const yOffset = -120;
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                    
                    element.classList.add('ring-4', 'ring-indigo-500/20', 'bg-indigo-50/5');
                    setTimeout(() => element.classList.remove('ring-4', 'ring-indigo-500/20', 'bg-indigo-50/5'), 4000);
                }
            }, 500);

        } catch (error) {
            console.error("Critical Save Error:", error.response?.data || error.message);
            setFormError(error.response?.data?.message || "Failed to save reminder.");
        } finally {
            setIsSubmitting(false);
            console.log("--- END SAVE REMINDER ---");
        }
    };

    const handleDeleteReminder = async (id) => {
        if (window.confirm('Delete reminder?')) {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete(`/api/lecture-reminders/${id}`, config);
            fetchReminders();
        }
    };

    // Memoized Data
    const filteredGroups = useMemo(() => {
        return dbStudyGroups.filter(g => g.year === selectedYear && g.semester === selectedSemester);
    }, [dbStudyGroups, selectedYear, selectedSemester]);

    const dynamicSubjects = useMemo(() => {
        const subjects = [];
        filteredGroups.forEach((g) => {
            let subj = subjects.find((s) => s.code === g.subjectCode);
            if (!subj) {
                subj = { id: g.subjectCode, name: g.subjectName, code: g.subjectCode, image: g.image, microGroups: [] };
                subjects.push(subj);
            }
            subj.microGroups.push({ id: g._id, name: g.groupName, members: g.members || 1 });
        });
        return subjects;
    }, [filteredGroups]);

    const sortedMaterials = useMemo(() => {
        const filterType = (t) => dbStudyMaterials.filter(m => m.type === t).map(m => ({
            id: m._id, title: m.title, author: m.author, year: m.author, description: m.description, 
            reviews: m.ratingCount, rating: m.averageRating, currentUserRating: m.currentUserRating,
            imageUrl: m.coverImage, isTutorMaterial: m.isTutorMaterial, isDb: true, uploaderId: m.uploaderId, 
            link: m.link, fileName: m.fileName
        })); // Sorting is handled by backend

        return { notes: filterType('notes'), papers: filterType('papers'), videos: filterType('videos') };
    }, [dbStudyMaterials]);

    const currentYearData = staticYears.find(y => y.id === selectedYear);
    const currentSemesterData = staticSemesters.find(s => s.id === selectedSemester);
    const currentSubjectData = dynamicSubjects.find(s => s.id === selectedSubject);
    const activeGroupFromDB = dbStudyGroups.find(g => g._id === selectedGroup);
    const currentGroupData = activeGroupFromDB ? { id: activeGroupFromDB._id, name: activeGroupFromDB.groupName, moduleCode: activeGroupFromDB.subjectCode } : null;

    const Breadcrumbs = () => (
        <div className="flex items-center justify-center gap-3 mb-2 text-base font-black uppercase tracking-widest animate-in fade-in">
            <button onClick={() => updateParams({}, ['y', 's', 'sub', 'g'])} className="text-indigo-600 hover:text-indigo-800">Study Hub</button>
            {selectedYear && <><ChevronRight className="w-3 h-3 text-slate-300" /><button onClick={() => updateParams({}, ['s', 'sub', 'g'])} className="text-indigo-600">{currentYearData?.label}</button></>}
            {selectedSemester && <><ChevronRight className="w-3 h-3 text-slate-300" /><button onClick={() => updateParams({}, ['sub', 'g'])} className="text-indigo-600">{currentSemesterData?.label}</button></>}
            {selectedSubject && <><ChevronRight className="w-3 h-3 text-slate-300" /><button onClick={() => updateParams({}, ['g'])} className="text-indigo-600">{currentSubjectData?.name}</button></>}
            {selectedGroup && <><ChevronRight className="w-3 h-3 text-slate-300" /><span className="text-indigo-400">{currentGroupData?.name}</span></>}
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg">
            <div className="h-20 w-full shrink-0"></div>
            <div className="flex-1 bg-gradient-to-br from-[#8ca0b3] via-[#cbdbe8] to-[#eaf2f7] dark:from-slate-900 dark:to-slate-800 flex flex-col items-center px-4 pt-8 pb-16 relative overflow-hidden">
                <div className="w-full max-w-6xl mx-auto px-4 mb-8 text-center">
                    {selectedYear && <Breadcrumbs />}
                    {!selectedYear && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-1000 mt-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-rose-600 rounded-3xl shadow-lg shadow-indigo-500/30 dark:shadow-none mb-8 mx-auto">
                                <BookOpen className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Study Hub</h1>
                            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">Unlock your full academic potential. Sync with official lecture schedules, manage your time with smart reminders, and master your studies.</p>
                        </div>
                    )}
                </div>

                <div className="w-full flex flex-col items-center">
                    {!selectedYear && <YearSelection staticYears={staticYears} setSelectedYear={setSelectedYear} />}
                    {selectedYear && !selectedSemester && <SemesterSelection staticSemesters={staticSemesters} setSelectedSemester={setSelectedSemester} />}
                    {selectedYear && selectedSemester && !selectedGroup && <SubjectSelection dynamicSubjects={dynamicSubjects} updateParams={updateParams} />}
                    {selectedGroup && (
                        <GroupContent 
                            currentGroupData={currentGroupData} joinedGroups={joinedGroups} selectedGroup={selectedGroup}
                            handleJoinGroup={(id) => setJoinedGroups(prev => Array.isArray(prev) ? [...prev, id] : [id])} activeTab={activeTab} setActiveTab={setActiveTab}
                            materials={sortedMaterials} bookmarkState={bookmarkState} handleBookmark={handleBookmark}
                            userInfo={userInfo} setEditModal={setEditModal} handleDeleteMaterial={handleDeleteMaterial}
                            handleSummarize={handleSummarize} handleReviewClick={(type, id, title, r, rev) => setRatingModal({ show: true, type, id, title, rating: r, reviews: rev, comment: '', comments: [] })}
                            setAddModal={setAddModal} setCommentsModal={setCommentsModal} dbStudyMaterials={dbStudyMaterials}
                            setShowAuthModal={setShowAuthModal} setReminderModal={setReminderModal}
                        />
                    )}
                </div>

                <StudyModals 
                    ratingModal={ratingModal} setRatingModal={setRatingModal} handleRatingSubmit={handleRatingSubmit} hoveredStar={hoveredStar} setHoveredStar={setHoveredStar}
                    editModal={editModal} setEditModal={setEditModal} handleEditSubmit={handleEditSubmit} editModalImage={editModalImage} setEditModalImage={setEditModalImage} isSubmitting={isSubmitting} formError={formError}
                    showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} navigate={navigate}
                    summaryModal={summaryModal} setSummaryModal={setSummaryModal}
                    addModal={addModal} setAddModal={setAddModal} handleManualAddMaterial={handleManualAddMaterial} 
                    addModalImage={addModalImage} setAddModalImage={setAddModalImage} addModalFile={addModalFile} setAddModalFile={setAddModalFile} 
                    fileInputRef={fileInputRef} userInfo={userInfo} dragOver={dragOver} setDragOver={setDragOver} dragOverImg={dragOverImg} setDragOverImg={setDragOverImg}
                    commentsModal={commentsModal} setCommentsModal={setCommentsModal} handleCommentSubmit={handleCommentSubmit}
                    reminderModal={reminderModal} setReminderModal={setReminderModal} handleSaveReminder={handleSaveReminder}
                />

                <PersonalizedPanel 
                    localReminders={localReminders} 
                    setReminderModal={setReminderModal} 
                    handleDeleteReminder={handleDeleteReminder}
                />

                <button
                    onClick={() => {
                        if (selectedGroup) updateParams({}, ['g']);
                        else if (selectedSubject) updateParams({}, ['sub']);
                        else if (selectedSemester) updateParams({}, ['s']);
                        else if (selectedYear) updateParams({}, ['y']);
                        else navigate('/');
                    }}
                    className="fixed bottom-12 left-12 flex items-center gap-4 text-slate-900 font-black hover:text-indigo-600 transition-all group z-30"
                >
                    <div className="w-14 h-14 rounded-[1.5rem] bg-white border border-slate-100 flex items-center justify-center group-hover:shadow-2xl shadow-xl"><ArrowLeft className="w-6 h-6" /></div>
                    <span className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl text-xs uppercase tracking-widest border">{selectedGroup ? 'Back to Subject' : 'Back'}</span>
                </button>

                {/* Custom Success Toast */}
                {successToast.show && (
                    <div className="fixed top-6 right-6 z-[1000] flex items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 duration-500">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white font-black text-[10px] uppercase tracking-widest">{successToast.message}</p>
                            <p className="text-slate-400 text-[9px] font-bold mt-0.5">Redirecting to active reminders</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyPage;

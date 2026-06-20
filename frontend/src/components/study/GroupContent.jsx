import { 
    Users, FileText, Book, Play, Plus, Bookmark, Pencil, Trash2, Award, Star, ThumbsUp, MessageSquare, Download, Sparkles,
    Calendar as LucideCalendar, Clock, MapPin, User, AlarmClock, CheckCircle, ChevronRight, BookOpen, Trash, Brain, X, Layout, Flag, Eye, Lock
} from 'lucide-react';
import axios from 'axios';

const GroupContent = ({ 
    currentGroupData, 
    joinedGroups, 
    selectedGroup, 
    handleJoinGroup, 
    activeTab, 
    setActiveTab, 
    materials, 
    bookmarkState, 
    handleBookmark, 
    userInfo, 
    setEditModal, 
    handleDeleteMaterial, 
    handleSummarize, 
    handleReviewClick,
    setAddModal,
    setCommentsModal,
    dbStudyMaterials,
    setShowAuthModal,
    academicLectures,
    setReminderModal
}) => {
    
    const getGradient = (title, type = 'notes') => {
        const grads = type === 'notes' 
            ? ['from-indigo-500 to-purple-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600', 'from-rose-500 to-pink-600', 'from-blue-500 to-cyan-600', 'from-fuchsia-500 to-purple-600']
            : ['from-indigo-600 to-blue-700', 'from-purple-600 to-indigo-700', 'from-fuchsia-600 to-purple-700', 'from-cyan-600 to-blue-700'];
        
        let hash = 0;
        const str = title || '';
        for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        return grads[Math.abs(hash) % grads.length];
    };

    const handleViewOrDownload = async (materialId, fileName, mode = 'download') => {
        try {
            const { data } = await axios.get(`/api/study-materials/material/${materialId}`);
            if (!data.fileData) {
                alert("No file data available.");
                return;
            }

            const isBase64 = data.fileData.includes('base64,');
            const pureBase64 = isBase64 ? data.fileData.split(',')[1] : data.fileData;
            
            if (mode === 'view') {
                try {
                    const byteCharacters = atob(pureBase64);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const file = new Blob([byteArray], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL, '_blank');
                } catch (e) {
                    console.error("View failed, falling back to download", e);
                    // Fallback to download if blob creation fails
                    const link = document.createElement('a');
                    link.href = isBase64 ? data.fileData : `data:application/pdf;base64,${data.fileData}`;
                    link.download = fileName || 'Document.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            } else {
                const link = document.createElement('a');
                link.href = isBase64 ? data.fileData : `data:application/pdf;base64,${data.fileData}`;
                link.download = fileName || 'Document.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (err) {
            console.error("Action error:", err);
        }
    };

    const isJoined = joinedGroups.includes(selectedGroup);

    if (!currentGroupData) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center animate-pulse">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl mb-4" />
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Loading Group Data...</p>
            </div>
        );
    }

    if (!isJoined) {
        return (
            <div className="text-center p-12 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-[3rem] shadow-2xl max-w-2xl w-full animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-indigo-100 dark:bg-dark-accent/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <Users className="w-12 h-12 text-indigo-600 dark:text-dark-accent" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text-main mb-4">Join {currentGroupData.name}</h2>
                <p className="text-gray-500 dark:text-dark-text-muted mb-8">
                    {!userInfo 
                        ? "You need to be logged in and part of this micro-group to access the shared notes, past papers, and video tutorials."
                        : "You need to be part of this micro-group to access the shared notes, past papers, and video tutorials."}
                </p>
                <button
                    onClick={() => {
                        if (!userInfo) {
                            setShowAuthModal(true);
                        } else {
                            handleJoinGroup(selectedGroup);
                        }
                    }}
                    className="px-10 py-4 bg-indigo-600 dark:bg-dark-accent text-white font-bold rounded-2xl hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                    {!userInfo ? 'Sign In to Join' : 'Join This Group'}
                </button>
            </div>
        );
    }

    const TABS = [
        { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" />, color: 'indigo' },
        { id: 'papers', label: 'Pass Papers', icon: <Book className="w-4 h-4" />, color: 'purple' },
        { id: 'videos', label: 'Videos', icon: <Play className="w-4 h-4" />, color: 'indigo' },
    ];

    const tabColorMap = {
        indigo: { active: 'bg-indigo-600 text-white shadow-indigo-200', inactive: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100', icon: 'bg-indigo-100 text-indigo-500' },
        purple: { active: 'bg-purple-600 text-white shadow-purple-200', inactive: 'text-purple-600 bg-purple-50 hover:bg-purple-100', icon: 'bg-purple-100 text-purple-500' },
        amber: { active: 'bg-amber-600 text-white shadow-amber-200', inactive: 'text-amber-600 bg-amber-50 hover:bg-amber-100', icon: 'bg-amber-100 text-amber-500' },
    };

    return (
        <div className="w-full max-w-6xl space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-dark-text-main">{currentGroupData.name}</h2>
                    <p className="text-gray-500 dark:text-dark-text-muted">Resource Library & Collaborative Learning</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-4 py-2.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-2xl text-sm font-bold flex items-center gap-2 border border-green-200 dark:border-green-900/30 shadow-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Active Member
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-dark-card rounded-2xl w-full overflow-x-auto border dark:border-slate-800">
                {TABS.map(tab => {
                    const isActive = activeTab === tab.id;
                    const colors = tabColorMap[tab.color];
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex-shrink-0 ${isActive ? `${colors.active} shadow-lg dark:shadow-none` : `${colors.inactive} dark:bg-slate-800/50 dark:text-dark-text-muted dark:hover:bg-slate-800`}`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {activeTab === 'notes' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-indigo-100 dark:bg-dark-accent/10 rounded-xl flex items-center justify-center">
                                <FileText className="w-5 h-5 text-indigo-500 dark:text-dark-accent" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-dark-text-main">Top Rated Notes</h3>
                        </div>
                        <button onClick={() => setAddModal({ show: true, type: 'notes' })} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 dark:bg-dark-accent text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-md">
                            <Plus className="w-4 h-4" /> Add Note
                        </button>
                    </div>
                    
                    {/* Bookmarks Section */}
                    {Object.values(bookmarkState).some(b => b.bookmarked) && (
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Bookmark className="w-4.5 h-4.5 text-indigo-500 dark:text-dark-accent fill-indigo-500 dark:text-dark-accent" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 dark:text-dark-accent">
                                    Saved Notes ({Object.values(bookmarkState).filter(b => b.bookmarked).length})
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {materials.notes.filter(n => bookmarkState[n.id]?.bookmarked).map((note) => (
                                    <div key={`bm-${note.id}`} className="bg-white dark:bg-dark-card rounded-[2rem] border-2 border-indigo-100 dark:border-dark-accent/20 shadow-sm relative overflow-hidden group/bm transition-all hover:shadow-lg">
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-600 dark:bg-dark-accent text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md">
                                                <Bookmark className="w-3 h-3 fill-white" /> Saved
                                            </span>
                                        </div>
                                        {(note.imageUrl || note.coverImage) ? (
                                            <div className="w-full h-32 overflow-hidden border-b dark:border-slate-800 relative">
                                                <img src={note.imageUrl || note.coverImage} alt={note.title} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-indigo-600/10" />
                                            </div>
                                        ) : (
                                            <div className={`w-full h-32 bg-gradient-to-br ${getGradient(note.title, 'notes')} flex flex-col items-center justify-center p-4 border-b dark:border-slate-800`}>
                                                <FileText className="w-8 h-8 text-white/30 mb-2" />
                                                <span className="text-white text-[9px] font-black uppercase text-center line-clamp-1">{note.title}</span>
                                            </div>
                                        )}
                                        <div className="p-5">
                                            <h4 className="font-bold text-gray-900 dark:text-dark-text-main mb-1 text-sm truncate">{note.title}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 dark:text-dark-text-muted mb-4">By {note.author}</p>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleBookmark(note.id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                                                    <Bookmark className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleViewOrDownload(note.id, note.fileName, 'download')} className="flex-1 py-2.5 bg-indigo-600 dark:bg-dark-accent text-white font-black text-[9px] uppercase tracking-widest rounded-xl hover:shadow-lg transition-all">Download</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {(materials?.notes || []).map((note, idx) => (
                            <div key={note.id || idx} className={`bg-white dark:bg-dark-card rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group/card flex flex-col ${idx === 0 ? 'ring-2 ring-indigo-50 dark:ring-dark-accent/20' : ''}`}>
                                {idx === 0 && (
                                    <div className="absolute top-0 right-0 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-2xl flex items-center gap-1.5 shadow-lg z-20">
                                        <Award className="w-3.5 h-3.5" /> Best Choice
                                    </div>
                                )}
                                
                                {(note.imageUrl || note.coverImage) ? (
                                    <div className="w-full h-40 overflow-hidden border-b dark:border-slate-800 relative">
                                        <img src={note.imageUrl || note.coverImage} alt={note.title} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/10 group-hover/card:opacity-0 transition-opacity" />
                                    </div>
                                ) : (
                                    <div className={`w-full h-40 bg-gradient-to-br ${getGradient(note.title, 'notes')} p-6 flex flex-col items-center justify-center text-center border-b dark:border-slate-800 relative overflow-hidden`}>
                                        <div className="absolute inset-0 opacity-10">
                                            <FileText className="w-40 h-40 absolute -bottom-10 -right-10 transform rotate-12" />
                                        </div>
                                        <FileText className="w-12 h-12 text-white/40 mb-3 relative z-10" />
                                        <h5 className="text-white font-black text-sm uppercase tracking-wider line-clamp-2 relative z-10">{note.title}</h5>
                                        <div className="mt-2 w-8 h-1 bg-white/30 rounded-full relative z-10" />
                                    </div>
                                )}

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1 min-w-0 pr-4">
                                            {note.isTutorMaterial && (
                                                <div className="inline-flex items-center gap-1 mb-2.5 px-2 py-1 bg-slate-900 text-white rounded-lg text-[7px] font-black uppercase tracking-[0.2em] shadow-md">
                                                    <Award className="w-2.5 h-2.5 text-indigo-400" /> Tutor Post
                                                </div>
                                            )}
                                            <h4 className="font-black text-gray-900 dark:text-dark-text-main leading-tight mb-1 truncate text-base">{note.title}</h4>
                                            <p className="text-[10px] font-black text-slate-400 dark:text-dark-text-muted uppercase tracking-widest">By {note.author || 'Anonymous'}</p>
                                        </div>
                                        <div 
                                            onClick={(e) => { e.stopPropagation(); handleReviewClick('notes', note.id, note.title, note.currentUserRating || 0, note.reviews); }}
                                            className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/10 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-900/20 shadow-sm cursor-pointer hover:scale-105 transition-all"
                                        >
                                            <Star className={`w-3.5 h-3.5 ${note.rating > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                                            <span className="text-sm font-black text-gray-900 dark:text-dark-text-main">{note.rating > 0 ? note.rating : '0'}</span>
                                        </div>
                                    </div>

                                    {note.description && <p className="text-xs text-gray-500 dark:text-dark-text-muted/80 mb-6 line-clamp-2 italic font-medium">"{note.description}"</p>}
                                    
                                    <div className="flex items-center justify-between gap-3 mt-auto pt-5 border-t border-slate-50 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            {note.isDb && (
                                                <button onClick={() => handleSummarize(note)} className="w-10 h-10 bg-amber-50 dark:bg-amber-900/10 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 group/tool" title="AI Summary">
                                                    <Sparkles className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 p-1 bg-slate-50 dark:bg-dark-bg rounded-2xl border border-slate-100 dark:border-slate-800">
                                            <button 
                                                onClick={() => handleViewOrDownload(note.id, note.fileName, 'view')}
                                                className="w-9 h-9 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
                                                title="Quick View"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleViewOrDownload(note.id, note.fileName, 'download')}
                                                className="w-9 h-9 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl flex items-center justify-center hover:bg-slate-600 hover:text-white hover:scale-110 transition-all duration-300"
                                                title="Download"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            
                                            {(!note.uploaderId || (userInfo && note.uploaderId === userInfo._id)) ? (
                                                <>
                                                    <button 
                                                        onClick={() => setEditModal({ show: true, type: 'notes', material: note })}
                                                        className="w-9 h-9 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl flex items-center justify-center hover:bg-amber-600 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteMaterial('notes', note.id)}
                                                        className="w-9 h-9 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-rose-500/20 transition-all duration-300"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="w-9 h-9 bg-slate-50 dark:bg-dark-bg/50 flex items-center justify-center rounded-xl opacity-20 filter grayscale" title="Read Only">
                                                    <Lock className="w-3 h-3 text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'papers' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                                <Book className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-dark-text-main">Pass Papers</h3>
                        </div>
                        <button onClick={() => setAddModal({ show: true, type: 'papers' })} className="px-4 py-2.5 bg-purple-600 text-white rounded-2xl text-sm font-bold hover:bg-purple-700 transition-all shadow-md">
                            <Plus className="w-4 h-4 inline mr-1" /> Add Paper
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {materials.papers.map((paper) => (
                            <div key={paper.id} className="bg-white dark:bg-dark-card rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group/card relative overflow-hidden flex flex-col">
                                {(paper.imageUrl || paper.coverImage) ? (
                                    <div className="w-full h-40 overflow-hidden border-b dark:border-slate-800 relative">
                                        <img src={paper.imageUrl || paper.coverImage} alt={paper.title} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/10 group-hover/card:opacity-0 transition-opacity" />
                                    </div>
                                ) : (
                                    <div className={`w-full h-40 bg-gradient-to-br ${getGradient(paper.title, 'papers')} p-6 flex flex-col items-center justify-center text-center border-b dark:border-slate-800 relative overflow-hidden`}>
                                        <div className="absolute inset-0 opacity-10">
                                            <Book className="w-40 h-40 absolute -bottom-10 -right-10 transform rotate-12" />
                                        </div>
                                        <Book className="w-12 h-12 text-white/40 mb-3 relative z-10" />
                                        <h5 className="text-white font-black text-sm uppercase tracking-wider line-clamp-2 relative z-10">{paper.title}</h5>
                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/20 rounded-md text-[8px] font-black text-white uppercase tracking-widest mt-2 relative z-10">
                                            {paper.year} Exam Paper
                                        </div>
                                    </div>
                                )}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h4 className="font-black text-gray-900 dark:text-dark-text-main mb-1 truncate text-base">{paper.title}</h4>
                                            <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black tracking-widest uppercase">{paper.year}</span>
                                        </div>
                                        <div onClick={() => handleReviewClick('papers', paper.id, paper.title, paper.rating, paper.reviews)} className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 cursor-pointer hover:scale-105 transition-all">
                                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                            <span className="text-sm font-black text-gray-900">{Math.round(paper.rating)}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between gap-3 mt-auto pt-5 border-t border-slate-50 dark:border-slate-800">
                                        <button onClick={() => handleSummarize(paper)} className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center shadow-sm" title="AI Review">
                                            <Sparkles className="w-4 h-4" />
                                        </button>
                                        
                                        <div className="flex items-center gap-1.5 p-1 bg-slate-50 dark:bg-dark-bg rounded-2xl border border-slate-100 dark:border-slate-800">
                                            <button 
                                                onClick={() => handleViewOrDownload(paper.id, paper.fileName, 'view')}
                                                className="w-9 h-9 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                                                title="Quick View"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleViewOrDownload(paper.id, paper.fileName, 'download')}
                                                className="w-9 h-9 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl flex items-center justify-center hover:bg-slate-600 hover:text-white hover:scale-110 transition-all duration-300"
                                                title="Download"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            
                                            {(!paper.uploaderId || (userInfo && paper.uploaderId === userInfo._id)) ? (
                                                <>
                                                    <button 
                                                        onClick={() => setEditModal({ show: true, type: 'papers', material: paper })}
                                                        className="w-9 h-9 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl flex items-center justify-center hover:bg-amber-600 hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteMaterial('papers', paper.id)}
                                                        className="w-9 h-9 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="w-9 h-9 bg-slate-50 dark:bg-dark-bg/50 flex items-center justify-center rounded-xl opacity-20 filter grayscale" title="Read Only">
                                                    <Lock className="w-3 h-3 text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'videos' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-indigo-100 dark:bg-dark-accent/10 rounded-xl flex items-center justify-center">
                                <Play className="w-5 h-5 text-indigo-600 dark:text-dark-accent" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-dark-text-main">Video Lessons</h3>
                        </div>
                        <button onClick={() => setAddModal({ show: true, type: 'videos' })} className="px-4 py-2.5 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md">
                            <Plus className="w-4 h-4 inline mr-1" /> Add Video
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {materials.videos.map((video) => {
                            const vidBookmark = bookmarkState[video.id] || { bookmarked: false, count: 0 };
                            const dbMat = dbStudyMaterials.find(m => m._id === video.id);
                            const commentCount = dbMat?.comments?.length || 0;
                            return (
                                <div key={video.id} className="group/vid flex flex-col gap-5 bg-white dark:bg-dark-card p-4 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500">
                                    <div className="relative aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-lg group-hover/vid:-translate-y-1 transition-all duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                        {video.imageUrl && <img src={video.imageUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover opacity-80" />}
                                        <div className="absolute inset-0 flex items-center justify-center z-20" onClick={() => video.link && window.open(video.link, '_blank')}>
                                            <div className="w-16 h-16 bg-white/25 backdrop-blur-xl rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer border border-white/40 group/play">
                                                <Play className="w-7 h-7 text-white fill-white ml-1 group-hover/play:scale-110 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-2 space-y-4">
                                        <h4 className="text-slate-900 dark:text-dark-text-main font-black text-lg line-clamp-1 uppercase tracking-tight">{video.title}</h4>
                                        
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setCommentsModal({ show: true, video: { ...video, comments: dbMat?.comments || [] }, newComment: '' })} className="w-10 h-10 bg-slate-100 dark:bg-dark-bg rounded-xl flex items-center justify-center text-slate-500 hover:bg-indigo-600 hover:text-white transition-all" title="Comments">
                                                    <MessageSquare className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleSummarize(video)} className="w-10 h-10 bg-amber-50 dark:bg-amber-900/10 text-amber-600 rounded-xl flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all" title="Auto-Review">
                                                    <Sparkles className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-1.5 p-1 bg-slate-100/50 dark:bg-dark-bg/50 rounded-2xl">
                                                <button 
                                                    onClick={() => video.link && window.open(video.link, '_blank')}
                                                    className="w-9 h-9 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:scale-110 transition-all"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            {(!video.uploaderId || (userInfo && video.uploaderId === userInfo._id)) ? (
                                                <>
                                                    <button 
                                                        onClick={() => setEditModal({ show: true, type: 'videos', material: video })}
                                                        className="w-9 h-9 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl flex items-center justify-center hover:bg-amber-600 hover:text-white hover:scale-110 transition-all"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteMaterial('videos', video.id)}
                                                        className="w-9 h-9 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white hover:scale-110 transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="w-9 h-9 bg-slate-50 dark:bg-dark-bg/50 flex items-center justify-center rounded-xl opacity-20 filter grayscale" title="Read Only">
                                                    <Lock className="w-3 h-3 text-slate-400" />
                                                </div>
                                            )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupContent;

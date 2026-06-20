import React from 'react';
import { 
    Star, MessageSquare, GraduationCap, Lock, Sparkles, Brain, FileText, Download, Upload, Play, Clock, ChevronRight,
    Calendar, Briefcase, Award, Bell, Flag, Layout, ChevronDown, CheckCircle, X, BookOpen, AlarmClock, MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudyModals = ({
    ratingModal, setRatingModal, handleRatingSubmit, hoveredStar, setHoveredStar,
    editModal, setEditModal, handleEditSubmit, editModalImage, setEditModalImage, isSubmitting, formError,
    showAuthModal, setShowAuthModal, navigate,
    summaryModal, setSummaryModal,
    addModal, setAddModal, handleManualAddMaterial, addModalImage, setAddModalImage, addModalFile, setAddModalFile, fileInputRef, userInfo, dragOver, setDragOver, dragOverImg, setDragOverImg,
    commentsModal, setCommentsModal, handleCommentSubmit,
    reminderModal, setReminderModal, handleSaveReminder
}) => {
    
    // Hooks MUST be at the top level
    const [formData, setFormData] = React.useState({
        title: '',
        moduleCode: '',
        academicType: 'Assignment',
        reminderTime: '',
        reminderBefore: '1 day before',
        notes: ''
    });

    // Sync formData when modal opens or lecture changes
    React.useEffect(() => {
        if (reminderModal.show) {
            const lecture = reminderModal.lecture;
            const reminder = reminderModal.reminder;
            setFormData({
                title: lecture?.title || '',
                moduleCode: lecture?.moduleCode || '',
                academicType: reminder?.academicType || 'Assignment',
                reminderTime: reminder?.reminderTime ? new Date(reminder.reminderTime).toISOString().slice(0, 16) : '',
                reminderBefore: '1 day before',
                notes: reminder?.notes || ''
            });
        }
    }, [reminderModal.show, reminderModal.lecture, reminderModal.reminder]);

    if (!ratingModal?.show && !editModal?.show && !showAuthModal && !summaryModal?.show && !addModal?.show && !commentsModal?.show && !reminderModal?.show) return null;

    const renderRatingModal = () => {
        if (!ratingModal.show) return null;
        return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4">
                <div className="bg-white dark:bg-dark-card rounded-[1.75rem] p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-500 border border-slate-100 dark:border-slate-800 relative flex flex-col overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />
                    
                    <div className="text-center mb-8 pt-2">
                        <div className="relative w-14 h-14 mx-auto mb-4 transform transition-transform duration-500">
                            <div className="absolute inset-0 bg-amber-400 opacity-20 blur-2xl rounded-full" />
                            <div className="relative w-14 h-14 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-xl shadow-lg flex items-center justify-center">
                                <Star className="w-7 h-7 text-white fill-white" />
                            </div>
                        </div>
                        
                        <h3 className="text-2xl font-black text-slate-900 dark:text-dark-text-main mb-2 tracking-tight">How was it?</h3>
                        <p className="text-slate-500 dark:text-dark-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            Rating: <span className="text-amber-500">"{ratingModal.title}"</span>
                        </p>
                    </div>

                    <div className="bg-slate-50/50 dark:bg-dark-bg/50 p-6 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/50 mb-4 relative group overflow-hidden">
                        {isSubmitting && (
                            <div className="absolute inset-0 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-in fade-in">
                                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                    <Star className="w-6 h-6 text-white fill-white" />
                                </div>
                                <p className="mt-2 text-[10px] text-emerald-600 font-black uppercase tracking-[0.1em]">Saved!</p>
                            </div>
                        )}
                        
                        <div className="flex justify-center items-center gap-3 relative z-10">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const isActive = star <= (hoveredStar || ratingModal.rating || 0);
                                return (
                                    <button
                                        key={star}
                                        onMouseEnter={() => !isSubmitting && setHoveredStar(star)}
                                        onMouseLeave={() => !isSubmitting && setHoveredStar(0)}
                                        onClick={() => !isSubmitting && handleRatingSubmit(star)}
                                        className="group/star relative transition-all duration-300 hover:scale-125 active:scale-90"
                                        disabled={isSubmitting}
                                    >
                                        <Star 
                                            className={`w-9 h-9 transition-all duration-500 ${isActive ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]' : 'text-slate-100 dark:text-slate-800'}`} 
                                            strokeWidth={isActive ? 0 : 2.5}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Select a Star to Submit</p>

                    <button
                        onClick={() => setRatingModal({ show: false, type: null, id: null, title: '', rating: 0, reviews: 0, comment: '', comments: [] })}
                        className="text-slate-400 dark:text-dark-text-muted font-bold text-[10px] uppercase tracking-widest hover:text-rose-500 transition-all py-1"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        );
    };

    const renderEditModal = () => {
        if (!editModal.show) return null;
        return (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                <div className="bg-white dark:bg-dark-card rounded-[1.75rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto no-scrollbar">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-dark-text-main mb-2">Edit Material</h3>
                    <p className="text-gray-500 dark:text-dark-text-muted mb-8 text-sm">Update resource details.</p>
                    {formError && <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold border border-rose-100">{formError}</div>}
                    <form onSubmit={handleEditSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Title</label>
                            <input name="title" required defaultValue={editModal.material.title} className="w-full p-4 bg-slate-50 dark:bg-dark-bg border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold" />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Description</label>
                            <textarea name="description" defaultValue={editModal.material.description} className="w-full p-4 bg-slate-50 dark:bg-dark-bg border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold" rows={3}></textarea>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">
                                {editModal.type === 'notes' ? 'Author' : editModal.type === 'videos' ? 'YouTube Link' : 'Target Year'}
                            </label>
                            <input name="extra" defaultValue={editModal.material.author || editModal.material.year || editModal.material.link} className="w-full p-4 bg-slate-50 dark:bg-dark-bg border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Visual Cover Page</label>
                            <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-[2.5rem] cursor-pointer transition-all overflow-hidden relative group/cover min-h-[140px] ${(editModalImage || editModal.material.imageUrl) ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'}`}>
                                {(editModalImage || editModal.material.imageUrl) ? (
                                    <>
                                        <img 
                                            src={editModalImage ? URL.createObjectURL(editModalImage) : editModal.material.imageUrl} 
                                            alt="Preview" 
                                            className="absolute inset-0 w-full h-full object-cover group-hover/cover:scale-110 transition-transform duration-500 opacity-40" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 to-transparent pointer-events-none" />
                                        <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in-90">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg mb-2">
                                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest bg-white/90 px-3 py-1 rounded-lg">Change Cover Image</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3 group-hover/cover:scale-110 group-hover/cover:bg-indigo-50 transition-all">
                                            <Layout className="w-6 h-6 text-slate-400 group-hover/cover:text-indigo-500" />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center group-hover/cover:text-indigo-600 transition-colors">Add Cover Page</span>
                                    </>
                                )}
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => setEditModalImage(e.target.files?.[0] || null)} />
                            </label>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => setEditModal({ show: false, type: null, material: null })} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all">
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderAuthModal = () => {
        if (!showAuthModal) return null;
        return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
                <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <Lock className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 text-center mb-4">Sign In Mandatory</h3>
                    <p className="text-slate-500 text-center mb-10">To join this group and access premium study materials, you need to be logged into your account.</p>
                    <div className="space-y-4">
                        <button onClick={() => navigate('/login')} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all">Sign In Now</button>
                        <button onClick={() => setShowAuthModal(false)} className="w-full py-2 text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm">Maybe Later</button>
                    </div>
                </div>
            </div>
        );
    };

    const renderSummaryModal = () => {
        if (!summaryModal.show) return null;
        return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[400] flex items-center justify-center p-4">
                <div className="bg-white dark:bg-dark-card rounded-[2rem] p-8 max-w-2xl w-full shadow-2xl border border-white/20 relative overflow-hidden flex flex-col max-h-[85vh]">
                    <div className="relative flex-1 flex flex-col min-h-0">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100">
                                    <Sparkles className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-dark-text-main">AI Study Summary</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Powered by Gemini AI</p>
                                </div>
                            </div>
                            <button onClick={() => setSummaryModal({ show: false, material: null, summary: '', loading: false, error: '' })} className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 font-bold">✕</button>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
                            {summaryModal.loading ? (
                                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                                    <Brain className="w-16 h-16 text-indigo-400 animate-pulse" />
                                    <p className="text-slate-900 dark:text-dark-text-main font-black text-lg">Analyzing Document...</p>
                                </div>
                            ) : summaryModal.error ? (
                                <div className="p-8 bg-rose-50 text-center rounded-[2.5rem]">
                                    <Lock className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                                    <h4 className="text-rose-900 font-black mb-2 px-4">{summaryModal.error}</h4>
                                    <button onClick={() => setSummaryModal({ ...summaryModal, show: false })} className="mt-4 px-8 py-3 bg-white text-rose-600 font-bold rounded-2xl">Got it</button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="p-6 bg-slate-50 dark:bg-dark-bg border border-slate-100 rounded-3xl">
                                        <div className="whitespace-pre-line text-slate-800 dark:text-dark-text-main leading-relaxed font-medium">
                                            {summaryModal.summary}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="pt-8 mt-4 border-t border-slate-100 flex gap-4">
                            {!summaryModal.loading && !summaryModal.error && (
                                <button
                                    onClick={() => {
                                        const blob = new Blob([summaryModal.summary], { type: 'text/plain' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a'); a.href = url;
                                        a.download = `${summaryModal.material?.title}_Summary.txt`; a.click();
                                    }}
                                    className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3"
                                >
                                    <Download className="w-5 h-5" /> Export Summary
                                </button>
                            )}
                            <button onClick={() => setSummaryModal({ show: false, material: null, summary: '', loading: false, error: '' })} className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderAddModal = () => {
        if (!addModal.show) return null;
        return (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                <div className="bg-white dark:bg-dark-card rounded-[1.75rem] p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-dark-text-main mb-2">Add New {addModal.type}</h3>
                    <p className="text-gray-500 text-sm mb-6">Share resources with your micro-group members.</p>
                    {formError && <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold border border-rose-100">{formError}</div>}
                    <form onSubmit={handleManualAddMaterial} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Material Title</label>
                            <input name="title" required placeholder={`Enter ${addModal.type} title`} className="w-full p-4 bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-slate-800 rounded-2xl outline-none font-semibold focus:ring-2 focus:ring-indigo-500 transition-all" />
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Description (Optional)</label>
                            <textarea name="description" placeholder="Short description about this resource..." className="w-full p-4 bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-slate-800 rounded-2xl outline-none font-semibold focus:ring-2 focus:ring-indigo-500 transition-all" rows={3}></textarea>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">
                                {addModal.type === 'notes' ? 'Author' : addModal.type === 'videos' ? 'YouTube Link' : 'Target Year'}
                            </label>
                            {addModal.type === 'notes' ? (
                                <input name="extra" required value={userInfo?.name || ''} readOnly className="w-full p-4 bg-slate-100 text-slate-500 rounded-2xl font-semibold cursor-not-allowed opacity-70" />
                            ) : (
                                <input name="extra" required placeholder={addModal.type === 'videos' ? 'https://youtube.com/watch?v=...' : 'e.g. 2024'} className="w-full p-4 bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-slate-800 rounded-2xl font-semibold focus:ring-2 focus:ring-indigo-500 transition-all" />
                            )}
                        </div>

                        {(addModal.type === 'notes' || addModal.type === 'papers') && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Document File</label>
                                    <label className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${addModalFile ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
                                        <Upload className={`w-5 h-5 mb-2 ${addModalFile ? 'text-indigo-600' : 'text-slate-400'}`} />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{addModalFile ? addModalFile.name : 'Upload PDF/Doc'}</span>
                                        <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setAddModalFile(e.target.files?.[0] || null)} />
                                    </label>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Visual Cover Page</label>
                                    <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all overflow-hidden relative group/cover ${addModalImage ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'}`}>
                                        {addModalImage ? (
                                            <>
                                                <img src={URL.createObjectURL(addModalImage)} alt="Preview" className="absolute inset-0 w-full h-full object-cover group-hover/cover:scale-110 transition-transform duration-500 opacity-40" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 to-transparent pointer-events-none" />
                                                <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in-90">
                                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg mb-2">
                                                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest bg-white/90 px-3 py-1 rounded-lg">Update Image</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3 group-hover/cover:scale-110 group-hover/cover:bg-indigo-50 transition-all">
                                                    <Layout className="w-6 h-6 text-slate-400 group-hover/cover:text-indigo-500" />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center group-hover/cover:text-indigo-600 transition-colors">Add Cover Page</span>
                                                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tight mt-1">Recommended: 16:9 Aspect Ratio</span>
                                            </>
                                        )}
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setAddModalImage(e.target.files?.[0] || null)} />
                                    </label>
                                </div>
                            </div>
                        )}
                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => setAddModal({ show: false, type: null })} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all">
                                {isSubmitting ? 'Adding...' : 'Add to Group'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderVideoCommentsModal = () => {
        if (!commentsModal.show || !commentsModal.video) return null;
        return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                <div className="bg-white dark:bg-dark-card w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                    <div className="flex items-center gap-3 p-6 border-b border-slate-100">
                        <MessageSquare className="w-5 h-5 text-rose-500" />
                        <h3 className="text-lg font-black text-slate-900 dark:text-dark-text-main truncate flex-1">{commentsModal.video.title}</h3>
                        <button onClick={() => setCommentsModal({ show: false, video: null, newComment: '' })} className="text-slate-400 hover:text-slate-600 font-bold text-xl">✕</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                        {(!commentsModal.video.comments || commentsModal.video.comments.length === 0) ? (
                            <p className="text-center text-slate-400 font-bold text-sm py-10">No comments yet.</p>
                        ) : (
                            commentsModal.video.comments.map((c, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0">{(c.userName || 'S').charAt(0).toUpperCase()}</div>
                                    <div className="flex-1 bg-slate-50 dark:bg-dark-bg rounded-2xl px-4 py-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-black text-slate-700 dark:text-dark-text-main">{c.userName}</span>
                                            <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-dark-text-muted">{c.text}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-4 border-t border-slate-100 flex gap-3 items-end">
                        <textarea
                            rows={2} placeholder="Add a comment..."
                            value={commentsModal.newComment}
                            onChange={(e) => setCommentsModal(prev => ({ ...prev, newComment: e.target.value }))}
                            className="flex-1 bg-slate-50 dark:bg-dark-bg rounded-2xl border p-3 text-sm focus:outline-none"
                        />
                        <button onClick={handleCommentSubmit} disabled={!commentsModal.newComment.trim()} className="w-11 h-11 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
                            <Play className="w-4 h-4 fill-current rotate-[-90deg]" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    const renderReminderModal = () => {
        if (!reminderModal.show) return null;
        const lecture = reminderModal.lecture;

        const academicTypes = [
            { id: 'Assignment', icon: <FileText />, color: 'blue', border: 'border-blue-100', text: 'text-blue-600', activeBg: 'bg-blue-50/50', activeBorder: 'border-blue-500' },
            { id: 'Mid Exam', icon: <GraduationCap />, color: 'amber', border: 'border-amber-100', text: 'text-amber-600', activeBg: 'bg-amber-50/50', activeBorder: 'border-amber-500' },
            { id: 'Final Exam', icon: <Award />, color: 'rose', border: 'border-rose-100', text: 'text-rose-600', activeBg: 'bg-rose-50/50', activeBorder: 'border-rose-500' },
            { id: 'Presentation', icon: <Layout />, color: 'fuchsia', border: 'border-fuchsia-100', text: 'text-fuchsia-600', activeBg: 'bg-fuchsia-50/50', activeBorder: 'border-fuchsia-500' },
            { id: 'Other', icon: <Sparkles />, color: 'indigo', border: 'border-indigo-100', text: 'text-indigo-600', activeBg: 'bg-indigo-50/50', activeBorder: 'border-indigo-500' }
        ];

        const isFormValid = formData.moduleCode && formData.reminderTime;

        return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[500] flex items-center justify-center p-4">
                <div className="bg-white rounded-[1.75rem] w-full max-w-[500px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 fade-in duration-300 border border-slate-100 flex flex-col max-h-[90vh]">
                    {/* Compact Accent Header */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
                    
                    <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <AlarmClock className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Study Reminder</h3>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1 opacity-70">Focus on your goals</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setReminderModal({ show: false, mode: 'add', lecture: null })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-all text-slate-300 hover:text-slate-500"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <form onSubmit={handleSaveReminder} className="p-7 space-y-6 overflow-y-auto no-scrollbar">
                        {/* Top Contextual Row */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Subject / Module <span className="text-rose-500 font-bold">*</span></label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <input 
                                        name="moduleCode" required
                                        value={formData.moduleCode}
                                        onChange={(e) => setFormData({...formData, moduleCode: e.target.value.toUpperCase()})}
                                        placeholder="E.G., CS101" 
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none rounded-xl font-bold text-xs text-slate-700 transition-all uppercase placeholder:normal-case" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Deadline <span className="text-rose-500 font-bold">*</span></label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <input 
                                        type="datetime-local" name="reminderTime" required
                                        value={formData.reminderTime}
                                        onChange={(e) => setFormData({...formData, reminderTime: e.target.value})}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none rounded-xl font-black text-xs text-slate-700 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Task Type Grid - Compact Cards */}
                        <div className="space-y-3">
                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Academic Category</label>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                {academicTypes.map((type) => {
                                    const isActive = formData.academicType === type.id;
                                    return (
                                        <button
                                            key={type.id} type="button"
                                            onClick={() => setFormData({...formData, academicType: type.id})}
                                            className={`flex flex-col items-center gap-2 px-2 py-3 rounded-2xl border-2 transition-all duration-300 group relative overflow-hidden ${
                                                isActive 
                                                ? `${type.activeBg} ${type.activeBorder} shadow-sm scale-100` 
                                                : 'bg-white border-slate-50 hover:border-slate-100 shadow-none'
                                            }`}
                                        >
                                            <div className={`p-2 rounded-lg transition-colors ${isActive ? type.text : 'bg-slate-50 text-slate-400 group-hover:text-slate-500'}`}>
                                                {React.cloneElement(type.icon, { className: 'w-4 h-4' })}
                                            </div>
                                            <span className={`text-[8px] font-black uppercase tracking-tighter text-center leading-none px-0.5 ${isActive ? type.text : 'text-slate-400'}`}>
                                                {type.id}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            <input type="hidden" name="alertType" value={formData.academicType} />
                            <input type="hidden" name="lectureTitle" value={formData.academicType} />
                            <input type="hidden" name="lectureId" value={lecture?._id || ''} />
                        </div>

                        {/* Secondary Row */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Smart Notification</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <select 
                                        value={formData.reminderBefore}
                                        onChange={(e) => setFormData({...formData, reminderBefore: e.target.value})}
                                        className="w-full pl-11 pr-8 py-3 bg-slate-50/50 border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none rounded-xl font-bold text-xs text-slate-700 transition-all appearance-none cursor-pointer"
                                    >
                                        <option>1 hour before</option>
                                        <option>1 day before</option>
                                        <option>2 days before</option>
                                        <option>1 week before</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                                </div>
                            </div>
                            <div className="flex items-end pb-1">
                                {!isFormValid && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 rounded-lg text-rose-500 text-[9px] font-black uppercase tracking-[0.1em] border border-rose-100 animate-pulse">
                                        <X className="w-3 h-3" /> Required Fields
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notes Area - Proportional */}
                        <div className="space-y-2">
                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Additional Notes</label>
                            <textarea 
                                value={formData.notes}
                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                placeholder="ANY SPECIFIC POINTS TO REMEMBER..."
                                className="w-full p-4 bg-slate-50/50 border-2 border-slate-50 focus:border-indigo-100 focus:bg-white outline-none rounded-2xl font-bold text-xs text-slate-600 transition-all min-h-[80px] placeholder:text-slate-300 resize-none uppercase text-[10px]"
                            />
                        </div>

                        {/* Balanced Footer */}
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                            <button 
                                type="button" 
                                onClick={() => setReminderModal({ show: false, mode: 'add', lecture: null })}
                                className="px-6 py-2.5 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-rose-500 transition-all"
                            >
                                Discard
                            </button>
                            <button 
                                type="submit" 
                                disabled={!isFormValid || isSubmitting}
                                className={`px-10 py-3.5 rounded-xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
                                    isFormValid 
                                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 hover:shadow-indigo-200 hover:-translate-y-0.5' 
                                    : 'bg-slate-200 cursor-not-allowed opacity-50 shadow-none'
                                }`}
                            >
                                {isSubmitting ? 'Syncing...' : <><CheckCircle className="w-4.5 h-4.5" /> Confirm Reminder</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <>
            {renderRatingModal()}
            {renderEditModal()}
            {renderAuthModal()}
            {renderSummaryModal()}
            {renderAddModal()}
            {renderVideoCommentsModal()}
            {renderReminderModal()}
        </>
    );
};

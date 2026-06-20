import { 
    Calendar, Clock, Bell, Trash, 
    MapPin, User, ChevronRight, AlarmClock, Plus,
    FileText, Play, Book, Star, Pencil, Trash2
} from 'lucide-react';

const PersonalizedPanel = ({ 
    localReminders, 
    setReminderModal, 
    handleDeleteReminder
}) => {

    
    return (
        <div className="w-full max-w-4xl mx-auto space-y-10 mt-8 pb-16 px-4">
            {/* Header Section */}
            <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Personal Study Dashboard</h2>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Manage your active learning reminders</p>
            </div>

            <div className="w-full">
                {/* Part 2: Student-Managed Reminders - Now Main Focus */}
                <div id="active-reminders" className="space-y-8 scroll-mt-24">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <Bell className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">Active Reminders</h3>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Your upcoming study goals</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setReminderModal({ show: true, mode: 'add', lecture: null })}
                            className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100 group"
                        >
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                        {localReminders && Array.isArray(localReminders) && localReminders.length > 0 ? (
                            localReminders.filter(r => r && r._id).map(reminder => (
                                <div key={reminder._id} className="bg-white p-5 rounded-[1.75rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all duration-500">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500">
                                            <AlarmClock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                                                    reminder.academicType === 'Assignment' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    reminder.academicType === 'Mid Exam' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    reminder.academicType === 'Final Exam' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    reminder.academicType === 'Presentation' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    'bg-slate-50 text-slate-600 border-slate-100'
                                                }`}>
                                                    {reminder.academicType || 'Lecture'}
                                                </div>
                                                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{reminder.moduleCode || 'UNTITLED'}</p>
                                            </div>
                                            <h4 className="text-sm font-black text-slate-900 tracking-tight">{reminder.lectureTitle || 'Study Session'}</h4>
                                            <div className="flex items-center gap-4 mt-2 text-[11px] font-bold text-slate-400">
                                                <span className="flex items-center gap-1.5 align-middle">
                                                    <Clock className="w-3.5 h-3.5 text-slate-300" /> 
                                                    {reminder.reminderTime ? new Date(reminder.reminderTime).toLocaleString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'No Time Set'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteReminder(reminder._id)}
                                        className="w-11 h-11 bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4.5 h-4.5" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
                                <Bell className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">No active reminders</p>
                                <p className="text-slate-300 text-[9px] font-bold mt-1">Click the + button to create a study reminder.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalizedPanel;

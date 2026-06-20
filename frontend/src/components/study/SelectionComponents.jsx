import React from 'react';
import { GraduationCap, ArrowRight, Calendar, BookOpen } from 'lucide-react';

export const YearSelection = ({ staticYears, setSelectedYear }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {staticYears.map((year) => (
            <button
                key={year.id}
                onClick={() => setSelectedYear(year.id)}
                className="group relative p-6 bg-white dark:bg-dark-card rounded-[2rem] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 text-left border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col justify-between min-h-[240px]"
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${year.color} opacity-[0.25] group-hover:opacity-[0.4] transition-opacity duration-500`} />
                <div>
                    <div className={`w-12 h-12 ${year.bgFade} dark:bg-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-sm relative z-10 border border-white dark:border-slate-700`}>
                        <GraduationCap className={`w-6 h-6 ${year.iconColor} dark:text-dark-accent`} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-dark-text-main mb-1.5 tracking-tight relative z-10">{year.label}</h3>
                    <p className="text-slate-500 dark:text-dark-text-muted text-sm font-semibold relative z-10">{year.desc}</p>
                </div>
                <div className="relative z-10 flex items-center justify-end">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${year.color} flex items-center justify-center text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-lg`}>
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </div>
            </button>
        ))}
    </div>
);

export const SemesterSelection = ({ staticSemesters, setSelectedSemester }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        {staticSemesters.map(sem => (
            <button
                key={sem.id}
                onClick={() => setSelectedSemester(sem.id)}
                className="group relative p-8 bg-white dark:bg-dark-card rounded-[2rem] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 text-left border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col justify-between min-h-[220px]"
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${sem.color} opacity-[0.25] group-hover:opacity-[0.4] transition-opacity duration-500`} />
                <div>
                    <div className={`w-12 h-12 ${sem.bgFade} dark:bg-slate-800 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 shadow-sm relative z-10 border border-white dark:border-slate-700`}>
                        <Calendar className={`w-6 h-6 ${sem.iconColor} dark:text-dark-accent`} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-dark-text-main mb-1.5 tracking-tight relative z-10">{sem.label}</h3>
                    <p className="text-slate-500 dark:text-dark-text-muted text-sm font-semibold relative z-10">{sem.desc}</p>
                </div>
                <div className="relative z-10 flex items-center justify-end">
                    <div className="w-9 h-9 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </button>
        ))}
    </div>
);

export const SubjectSelection = ({ dynamicSubjects, updateParams }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        {dynamicSubjects.map(subject => (
            <div
                key={subject.id}
                className="group bg-white dark:bg-dark-card rounded-2xl shadow-[0_10px_35px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_-12px_rgba(30,41,59,0.12)] transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden border border-slate-100 dark:border-slate-800"
            >
                <div className="relative h-44 w-full bg-slate-50 dark:bg-dark-bg shrink-0">
                    {subject.image ? (
                        <img src={subject.image} alt={subject.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                            <BookOpen className="w-10 h-10 text-indigo-300 dark:text-dark-accent opacity-60" />
                        </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm border border-white/50 dark:border-slate-700/50 flex items-center justify-center">
                        <span className="text-[10px] font-black text-indigo-600 dark:text-dark-accent tracking-widest uppercase">{subject.code}</span>
                    </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-main mb-2 line-clamp-1">{subject.name}</h3>
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-dark-text-muted mb-6 flex-grow line-clamp-3">
                        Explore micro groups, study materials, and collaborative sessions for {subject.name}.
                    </p>
                    <div className="space-y-2 mt-auto">
                        {subject.microGroups.map(group => (
                            <div key={group.id} className="flex gap-2 w-full items-stretch">
                                <button
                                    onClick={() => updateParams({ sub: subject.id, g: group.id }, [])}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-dark-accent dark:hover:bg-indigo-600 text-white rounded-xl py-2.5 px-4 flex items-center justify-center transition-colors shadow-sm"
                                >
                                    <span className="font-bold text-[10px] tracking-widest uppercase">
                                        JOIN {group.name}
                                    </span>
                                </button>
                                <button
                                    onClick={() => updateParams({ sub: subject.id, g: group.id }, [])}
                                    className="w-10 items-center justify-center flex bg-white dark:bg-dark-card hover:bg-indigo-50 dark:hover:bg-dark-bg border border-slate-100 dark:border-slate-800 rounded-xl transition-all text-slate-400 dark:text-dark-text-muted hover:text-indigo-600 dark:hover:text-dark-accent shrink-0 shadow-sm"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ))}
        {dynamicSubjects.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400 dark:text-dark-text-muted font-medium bg-white/50 dark:bg-dark-card/50 rounded-3xl border border-slate-100 dark:border-slate-800 border-dashed">
                No subjects or study groups found for this semester.
            </div>
        )}
    </div>
);

import { Info, ArrowLeft, GraduationCap, Users, Award, HeartHandshake } from 'lucide-react'
import { Link } from 'react-router-dom'

const AboutPage = () => (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg transition-colors duration-500">
        {/* Spacer for transparent navbar area to retain exactly the same look */}
        <div className="h-20 w-full shrink-0"></div>
        
        {/* Main Content Area with requested Gradient */}
        <div className="flex-1 bg-gradient-to-br from-[#8ca0b3] via-[#cbdbe8] to-[#eaf2f7] dark:from-slate-900 dark:to-slate-800 px-4 pt-12 pb-20">
            <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-300/40 dark:shadow-none mb-8 mx-auto">
                    <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl font-black text-gray-900 dark:text-dark-text-main mb-4">About campusgedara</h1>
                <p className="text-gray-500 dark:text-dark-text-muted text-lg max-w-2xl mx-auto">
                    We're building Sri Lanka's most comprehensive university life management platform — connecting students to everything they need on campus.
                </p>
            </div>

            {/* Mission cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {[
                    {
                        icon: GraduationCap,
                        title: 'Our Mission',
                        desc: 'To empower Sri Lankan university students with smart digital tools that simplify academic, social, and daily campus life.',
                        color: 'from-indigo-500 to-violet-600',
                        bg: 'bg-indigo-50 dark:bg-dark-card',
                        border: 'border-white/80 dark:border-slate-800'
                    },
                    {
                        icon: Users,
                        title: 'Who We Are',
                        desc: 'A passionate student-led team building technology solutions that address the real challenges of campus life in Sri Lanka.',
                        color: 'from-purple-500 to-pink-600',
                        bg: 'bg-purple-50 dark:bg-dark-card',
                        border: 'border-white/80 dark:border-slate-800'
                    },
                    {
                        icon: Award,
                        title: 'What We Offer',
                        desc: 'Study tools, event management, campus resources, accommodation, food, and transport — all in one unified platform.',
                        color: 'from-emerald-500 to-teal-600',
                        bg: 'bg-emerald-50 dark:bg-dark-card',
                        border: 'border-white/80 dark:border-slate-800'
                    },
                    {
                        icon: HeartHandshake,
                        title: 'Our Values',
                        desc: 'Student-first approach, transparency, community, and continuous improvement — your success is our success.',
                        color: 'from-amber-500 to-orange-600',
                        bg: 'bg-amber-50 dark:bg-dark-card',
                        border: 'border-white/80 dark:border-slate-800'
                    },
                ].map(({ icon: Icon, title, desc, color, bg, border }) => (
                    <div key={title} className={`${bg} rounded-3xl p-8 border ${border} shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-main mb-3">{title}</h3>
                        <p className="text-gray-600 dark:text-dark-text-muted text-sm leading-relaxed">{desc}</p>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 dark:text-dark-accent font-semibold hover:text-indigo-800 dark:hover:text-indigo-400 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
            </div>
            </div>
        </div>
    </div>
)

export default AboutPage

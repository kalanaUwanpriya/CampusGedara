import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, GraduationCap } from 'lucide-react'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        'Platform': [
            { label: 'Home', to: '/' },
            { label: 'Study', to: '/study' },
            { label: 'Events', to: '/events' },
            { label: 'Resources', to: '/resources' },
            { label: 'Living', to: '/living' },
            { label: 'About', to: '/about' },
        ],
        'Living': [
            { label: 'Accommodation', to: '/living' },
            { label: 'Food & Dining', to: '/living' },
            { label: 'Transportation', to: '/living' },
            { label: 'Smart Packages', to: '/living' },
        ],
        'Support': [
            { label: 'Help Centre', to: '#' },
            { label: 'FAQs', to: '#' },
            { label: 'Privacy Policy', to: '#' },
            { label: 'Terms of Service', to: '#' },
        ],
    }

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
    ]

    return (
        <footer className="bg-gray-950 dark:bg-dark-bg text-gray-400 dark:text-dark-text-muted border-t border-gray-800 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center space-x-3 mb-5 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div className="leading-none">
                                <span className="text-lg font-black text-white dark:text-slate-200">campus</span>
                                <span className="text-lg font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">gedara</span>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6 max-w-xs">
                            Sri Lanka's comprehensive university life platform — study, events, resources, accommodation, food, and transport in one place.
                        </p>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-indigo-400 dark:text-dark-accent flex-shrink-0" /><span>hello@campusgedara.lk</span></div>
                            <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-indigo-400 dark:text-dark-accent flex-shrink-0" /><span>+94 11 123 4567</span></div>
                            <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-indigo-400 dark:text-dark-accent flex-shrink-0" /><span>Colombo, Sri Lanka</span></div>
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="font-bold text-white dark:text-slate-200 text-sm mb-5 uppercase tracking-wider">{category}</h4>
                            <ul className="space-y-3">
                                {links.map(({ label, to }) => (
                                    <li key={label}>
                                        <Link
                                            to={to}
                                            className="text-sm hover:text-indigo-400 dark:hover:text-dark-accent transition-colors duration-200"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="mt-14 pt-8 border-t border-gray-800 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-600 dark:text-dark-text-muted">
                        © {currentYear} campusgedara. All rights reserved. Built with ❤️ for Sri Lankan students.
                    </p>
                    <div className="flex items-center space-x-3">
                        {socialLinks.map(({ icon: Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                className="w-9 h-9 rounded-xl bg-gray-800 dark:bg-dark-card flex items-center justify-center text-gray-500 hover:bg-indigo-600 dark:hover:bg-dark-accent hover:text-white transition-all duration-300 hover:scale-110"
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer

import { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }) => {
    const [mode, setMode] = useState(initialMode);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setFormData({ name: '', email: '', password: '' });
        }
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock authentication
        console.log('Authenticating:', mode, formData);
        
        // Redirect to Home Page after login
        navigate('/');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative border border-white/20">
                {/* Decorative background gradients */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>

                <div className="relative p-8">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="text-center mb-8 pt-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">
                            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-gray-500 mt-2 text-sm">
                            {mode === 'signin'
                                ? 'Enter your details to access your account'
                                : 'Join our vibrant campus community today'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                    placeholder="student@university.edu"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5 ml-1 px-1">
                                <label className="block text-sm font-semibold text-gray-700">Password</label>
                                {mode === 'signin' && (
                                    <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot Password?
                                    </a>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all duration-200 mt-6"
                        >
                            {mode === 'signin' ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                            className="font-bold text-indigo-600 hover:text-indigo-500"
                        >
                            {mode === 'signin' ? 'Create one now' : 'Sign in instead'}
                        </button>
                    </div>
                    
                    <div className="mt-6 pt-5 border-t border-gray-100/50 text-center">
                        <span className="text-xs text-gray-400 mr-2">Staff or Faculty?</span>
                        <button 
                            onClick={() => { onClose(); navigate('/admin'); }}
                            className="text-xs font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest transition-colors cursor-pointer"
                        >
                            Admin Portal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;

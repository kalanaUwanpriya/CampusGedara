import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Lock, Mail, Sparkles } from 'lucide-react';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { register, userInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        const res = await register(name, email, password);
        if (!res.success) {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-dark-bg font-sans pt-24 transition-colors duration-500">
            <div className="bg-white dark:bg-dark-card rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative border border-white/20 dark:border-slate-800">
                {/* Decorative background gradients */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 dark:opacity-5"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 dark:opacity-5"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 dark:opacity-5"></div>

                <div className="relative p-8">
                    <div className="text-center mb-8 pt-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-200 dark:shadow-none">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-dark-text-main">
                            Create Account
                        </h2>
                        <p className="text-gray-500 dark:text-dark-text-muted mt-2 text-sm">
                            Join our vibrant campus community today
                        </p>
                    </div>

                    {error && (
                        <div className='bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl'>
                            <p className='text-sm text-red-700 dark:text-red-400 font-medium'>{error}</p>
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text-main mb-1.5 ml-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 dark:text-dark-text-muted" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-dark-text-main placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-dark-bg transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text-main mb-1.5 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 dark:text-dark-text-muted" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-dark-text-main placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-dark-bg transition-all"
                                    placeholder="student@university.edu"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text-main mb-1.5 ml-1 px-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 dark:text-dark-text-muted" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-dark-text-main placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-dark-bg transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-dark-accent dark:to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 hover:scale-[1.02] transition-all duration-200 mt-6"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600 dark:text-dark-text-muted">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-bold text-indigo-600 dark:text-dark-accent hover:text-indigo-500 dark:hover:text-indigo-400"
                        >
                            Sign in instead
                        </Link>
                    </div>

                    <div className="mt-6 pt-5 border-t border-gray-100/50 dark:border-slate-800 text-center">
                        <span className="text-xs text-gray-400 dark:text-dark-text-muted/40 mr-2">Staff or Faculty?</span>
                        <button
                            onClick={() => navigate('/admin')}
                            className="text-xs font-black text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 uppercase tracking-widest transition-colors cursor-pointer"
                        >
                            ADMIN PORTAL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

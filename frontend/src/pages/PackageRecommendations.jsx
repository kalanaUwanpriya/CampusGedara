import { useState, useRef, useEffect, useContext } from 'react';
import { Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';

const PackageRecommendations = () => {
    const { userInfo } = useContext(AuthContext);
    const [messages, setMessages] = useState([
        { 
            role: 'ai', 
            text: "Hello! I am your AI campus assistant. Tell me what kind of accommodation or dining you are looking for, your budget, and preferences. I will search the active database for the best combo!" 
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = inputValue;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Need authorization header configured globally or passed inline via AuthContext token?
            // Assuming AuthContext token handles authorization if setup, else just public post.
            // In the backend aiRoutes.js, we put "protect" middleware. We must pass the token. Let's assume standard auth headers.
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo?.token}`
                }
            };

            const { data } = await axios.post('/api/ai/find-package', { prompt: userMsg }, config);
            
            setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
        } catch (error) {
            const apiMsg = error.response?.data?.message || error.message || "Failed to contact AI engine.";
            setMessages(prev => [...prev, { role: 'ai', text: `Internal Connection Error: ${apiMsg}` }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] max-h-[800px] bg-white dark:bg-dark-card rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors duration-500">
            {/* Header */}
            <div className="bg-indigo-600 dark:bg-dark-accent p-6 shrink-0 flex items-center justify-between shadow-lg z-10 w-full">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight leading-tight">Smart Packages AI</h2>
                        <p className="text-indigo-100/80 text-[10px] font-black uppercase tracking-widest">Real-time Database Engine</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl border border-white/10">
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Systems Active</span>
                </div>
            </div>

            {/* Chat Area */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50 dark:bg-dark-bg scroll-smooth no-scrollbar">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`flex items-end max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-indigo-600 dark:bg-dark-accent ml-4' : 'bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 mr-4'}`}>
                                {msg.role === 'user' ? (
                                    <User className="w-6 h-6 text-white" />
                                ) : (
                                    <Bot className="w-7 h-7 text-indigo-500 dark:text-dark-accent" />
                                )}
                            </div>
                            
                            {/* Bubble */}
                            <div className={`px-6 py-5 rounded-[2rem] shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 dark:bg-dark-accent text-white rounded-br-none' : 'bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text-main rounded-bl-none border border-slate-100 dark:border-slate-800'}`}>
                                {msg.role === 'user' ? (
                                    <p className="leading-relaxed font-bold">{msg.text}</p>
                                ) : (
                                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-indigo-600 dark:prose-p:text-dark-text-main font-bold">
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex items-end max-w-[80%] flex-row">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 mr-4 shadow-sm">
                                <Bot className="w-7 h-7 text-indigo-500 dark:text-dark-accent" />
                            </div>
                            <div className="px-6 py-5 rounded-[2rem] rounded-bl-none bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Campus Data...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white dark:bg-dark-card border-t border-slate-100 dark:border-slate-800 shrink-0">
                <form onSubmit={handleSendMessage} className="relative flex items-center max-w-4xl mx-auto group">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask anything about campus life..."
                        className="w-full pl-8 pr-20 py-5 bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-dark-accent outline-none shadow-inner text-slate-900 dark:text-dark-text-main placeholder-slate-400 dark:placeholder-dark-text-muted font-bold transition-all"
                        disabled={isTyping}
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isTyping}
                        className="absolute right-3 w-14 h-14 bg-indigo-600 dark:bg-dark-accent hover:bg-indigo-700 dark:hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                    >
                        <Send className="w-6 h-6 ml-1" />
                    </button>
                </form>
                <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-dark-text-muted uppercase tracking-widest">AI verified campus assistant</p>
                </div>
            </div>
        </div>
    );
};

export default PackageRecommendations;

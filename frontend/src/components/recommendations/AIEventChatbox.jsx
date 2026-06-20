import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const QUESTIONS = [
    "What kind of vibe or mood are you looking for today? (e.g., educational, fun, cultural, competitive)",
    "What time of day works best for you? (Morning, Afternoon, Evening)",
    "Are you looking for something related to your faculty (e.g., IT/Engineering) or open to all students?",
    "Do you prefer to actively participate (like in a workshop/match) or just passively enjoy (like watching a show/tech talk)?"
];

const AIEventChatbox = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([{ sender: 'ai', text: `Hi there! I'm your Campus Event Assistant. Let's find the perfect event for you!\n\n${QUESTIONS[0]}` }]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        
        if (!inputValue.trim()) return;

        const newAnswers = [...answers, inputValue];
        setAnswers(newAnswers);
        
        setMessages(prev => [...prev, { sender: 'user', text: inputValue }]);
        setInputValue('');

        if (currentQuestionIndex < QUESTIONS.length - 1) {
            const nextIdx = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIdx);
            
            setIsTyping(true);
            setTimeout(() => {
                setMessages(prev => [...prev, { sender: 'ai', text: QUESTIONS[nextIdx] }]);
                setIsTyping(false);
            }, 600); 
        } else {
            setIsTyping(true);
            // Quick artificial delay to simulate "thinking about all 4 answers"
            setTimeout(async () => {
                try {
                    const response = await axios.post('/api/ai/recommend-events', { answers: newAnswers });
                    setMessages(prev => [...prev, { sender: 'ai', text: response.data.reply }]);
                } catch (error) {
                    setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I had trouble finding an event. Please try again later!" }]);
                } finally {
                    setIsTyping(false);
                    setCurrentQuestionIndex(QUESTIONS.length); // mark complete
                }
            }, 800);
        }
    };

    const handleReset = () => {
        setMessages([{ sender: 'ai', text: `Hi there! I'm your Campus Event Assistant. Let's find the perfect event for you!\n\n${QUESTIONS[0]}` }]);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setInputValue('');
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                title="AI Event Assistant"
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer border-none z-[9999] shadow-[0_10px_25px_-5px_rgba(99,102,241,0.4)] hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
            >
                <Sparkles className="w-6 h-6 text-white" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col h-[600px] max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                
                <div className="py-4 px-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg leading-tight">AI Event Assistant</h3>
                            <span className="text-xs font-semibold text-indigo-600">Online</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleReset} className="text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors px-2 py-1">Restart</button>
                        <button onClick={() => setOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 custom-scrollbar">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-indigo-100' : 'bg-white shadow-sm border border-gray-100'}`}>
                                    {msg.sender === 'user' ? <User className="w-4 h-4 text-indigo-600" /> : <Sparkles className="w-4 h-4 text-purple-600" />}
                                </div>
                                <div className={`p-4 rounded-2xl text-sm ${
                                    msg.sender === 'user' 
                                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                                        : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm'
                                }`}>
                                    {msg.sender === 'ai' ? (
                                        <div className="prose prose-sm prose-indigo max-w-none">
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex gap-3 max-w-[85%] flex-row">
                                <div className="w-8 h-8 rounded-full shrink-0 bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm rounded-tl-sm flex items-center gap-1.5 h-12">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSend} className="relative flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={currentQuestionIndex >= QUESTIONS.length ? "Chat completed..." : "Type your answer..."}
                            disabled={currentQuestionIndex >= QUESTIONS.length || isTyping}
                            className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button 
                            type="submit" 
                            disabled={!inputValue.trim() || isTyping || currentQuestionIndex >= QUESTIONS.length}
                            className="absolute right-2 p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-sm cursor-pointer"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default AIEventChatbox;

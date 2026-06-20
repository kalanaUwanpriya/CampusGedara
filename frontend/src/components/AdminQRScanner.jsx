import React, { useEffect, useState, useContext } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, XCircle, Loader2, Camera, ShieldCheck, User, Calendar, Clock } from 'lucide-react';

const AdminQRScanner = () => {
    const { userInfo } = useContext(AuthContext);
    const authToken = userInfo?.token;
    
    const [scanResult, setScanResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        let scanner = null;
        
        // Only initialize if we don't have a result yet
        if (!scanResult) {
            const timer = setTimeout(() => {
                if (document.getElementById('reader')) {
                    scanner = new Html5QrcodeScanner('reader', {
                        qrbox: { width: 250, height: 250 },
                        fps: 5,
                        rememberLastUsedCamera: true
                    });

                    scanner.render(onScanSuccess, onScanError);
                }
            }, 500);

            return () => {
                clearTimeout(timer);
                if (scanner) {
                    scanner.clear().catch(err => console.error("Failed to clear", err));
                }
            };
        }

        function onScanSuccess(result) {
            if (scanner) {
                scanner.clear().then(() => {
                    setScanResult(result);
                    verifyBooking(result);
                }).catch(err => console.error("Scanner clear failed:", err));
            } else {
                setScanResult(result);
                verifyBooking(result);
            }
        }

        function onScanError(err) { }
    }, [scanResult]);

    const verifyBooking = async (bookingId) => {
        console.log("Verifying Booking ID:", bookingId);
        
        if (!authToken) {
            console.error("Auth Token is missing. UserInfo state:", userInfo);
            setError(`Admin session error. Please logout and login again as Admin. (UserInfo: ${userInfo ? 'Present' : 'Null'})`);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            };
            // Use relative URL to utilize Vite proxy, same as other dashboard components
            const { data } = await axios.put(`/api/resource-bookings/verify/${bookingId.trim()}`, {}, config);
            console.log("Verification Success:", data);
            setSuccess(data.booking);
        } catch (err) {
            console.error("Verification Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || 'Verification failed. Make sure you are an Admin.');
        } finally {
            setLoading(false);
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setError(null);
        setSuccess(null);
        // Removed reload as it might cause state loss/redirects
    };

    return (
        <div className="flex flex-col items-center gap-6 p-4">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-black text-gray-900 dark:text-dark-text-main flex items-center justify-center gap-2">
                    <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-dark-accent" />
                    Smart Resource Booking Verification
                </h2>
                <p className="text-gray-500 dark:text-dark-text-muted mt-1">Scan student booking QR codes to verify entry</p>
            </div>

            {!scanResult ? (
                <div className="w-full max-w-md bg-white dark:bg-dark-card p-4 rounded-[2.5rem] shadow-xl border dark:border-slate-800 overflow-hidden">
                    <div id="reader" className="overflow-hidden rounded-2xl"></div>
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-400">
                        <Camera className="w-4 h-4" />
                        <span>Position QR code within the square</span>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-md animate-in zoom-in-95 duration-300">
                    {loading ? (
                        <div className="bg-white dark:bg-dark-card p-12 rounded-[2.5rem] shadow-xl border dark:border-slate-800 flex flex-col items-center gap-4">
                            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                            <p className="font-black text-gray-600 dark:text-dark-text-muted">Verifying Booking...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] shadow-xl border-2 border-red-100 dark:border-red-900/30 flex flex-col items-center text-center gap-6">
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                <XCircle className="w-12 h-12 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-dark-text-main">Verification Failed</h3>
                                <p className="text-red-600 font-bold mt-2">{error}</p>
                            </div>
                            <button 
                                onClick={resetScanner}
                                className="w-full py-4 bg-gray-900 dark:bg-dark-bg text-white font-black rounded-2xl hover:bg-gray-800 transition-all"
                            >
                                SCAN ANOTHER
                            </button>
                        </div>
                    ) : success ? (
                        <div className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] shadow-xl border-2 border-emerald-100 dark:border-emerald-900/30 flex flex-col items-center gap-6">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-emerald-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-black text-gray-900 dark:text-dark-text-main">Access Granted</h3>
                                <p className="text-emerald-600 font-bold mt-1 uppercase tracking-widest text-xs">Booking Verified</p>
                            </div>

                            <div className="w-full bg-slate-50 dark:bg-dark-bg/50 p-6 rounded-3xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-dark-card rounded-xl shadow-sm">
                                        <User className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</p>
                                        <p className="font-bold text-gray-900 dark:text-dark-text-main">{success.userName}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-dark-card rounded-xl shadow-sm">
                                            <Calendar className="w-4 h-4 text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                                            <p className="font-bold text-gray-900 dark:text-dark-text-main text-sm">{success.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-dark-card rounded-xl shadow-sm">
                                            <Clock className="w-4 h-4 text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</p>
                                            <p className="font-bold text-gray-900 dark:text-dark-text-main text-sm">{success.startTime}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={resetScanner}
                                className="w-full py-4 bg-indigo-600 dark:bg-dark-accent text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                            >
                                SCAN NEXT
                            </button>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default AdminQRScanner;

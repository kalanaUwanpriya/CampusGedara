import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(
        localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo'))
            : null
    );

    const login = async (email, password) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post(
                '/api/users/login',
                { email, password },
                config
            );
            setUserInfo(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post(
                '/api/users',
                { name, email, password },
                config
            );
            setUserInfo(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            };
        }
    };

    const updateProfile = async (user) => {
        try {
            if (!userInfo || !userInfo.token) {
                return { success: false, message: 'Session expired, please log in again.' };
            }
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.put('/api/users/profile', user, config);
            setUserInfo(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
    };

    const toggleBookmark = async (type, id) => {
        try {
            if (!userInfo || !userInfo.token) {
                return { success: false, message: 'Session expired, please log in again.' };
            }

            // --- OPTIMISTIC UI UPDATE ---
            let targetArrayName = '';
            if (type === 'accommodation') targetArrayName = 'accommodationBookmarks';
            else if (type === 'food') targetArrayName = 'foodBookmarks';
            else if (type === 'note') targetArrayName = 'noteBookmarks';

            if (targetArrayName) {
                const currentArr = userInfo[targetArrayName] || [];
                const isBookmarked = currentArr.includes(id);
                const optimisticArr = isBookmarked 
                    ? currentArr.filter(bId => bId !== id) 
                    : [...currentArr, id];
                
                const optimisticUserInfo = {
                    ...userInfo,
                    [targetArrayName]: optimisticArr
                };
                setUserInfo(optimisticUserInfo);
            }
            // -----------------------------

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.post(`/api/users/bookmarks/${type}/${id}`, {}, config);
            
            // Update local state with actual verified arrays from DB
            const newUserInfo = {
                ...userInfo,
                accommodationBookmarks: data.accommodationBookmarks,
                foodBookmarks: data.foodBookmarks,
                noteBookmarks: data.noteBookmarks
            };
            setUserInfo(newUserInfo);
            localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
            return { success: true };
        } catch (error) {
            // Revert on error could be implemented here, but typically a refresh fetches newest.
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to toggle bookmark',
            };
        }
    };

    return (
        <AuthContext.Provider
            value={{ userInfo, login, register, updateProfile, logout, toggleBookmark }}
        >
            {children}
        </AuthContext.Provider>
    );
};

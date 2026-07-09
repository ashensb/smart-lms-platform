import React, { createContext, useState, useEffect } from 'react';
import API from '../api'; 
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const storedUser = localStorage.getItem('lms_user'); 
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // 🔐 Login Function
    const login = async (email, password, role) => {
        try {
            
            const response = await API.post('/auth/login', { 
                email, 
                password, 
                role 
            });
            
            if (response.data && response.data.token) {
                setUser(response.data); 
                localStorage.setItem('lms_user', JSON.stringify(response.data)); 
                
                return { success: true, role: response.data.role };
            }
        } catch (error) {
            
            return { 
                success: false, 
                message: error.response?.data?.message || "Login Failed! Please try again." 
            };
        }
    };

    // 🚪 Logout Function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('lms_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
import React, { useState, useContext } from 'react';
import api from '../api/axios'; // Changed from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useTheme } from '../components/ThemeProvider';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const { theme } = useTheme();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/auth/register', formData); // Changed from axios.post
            console.log('Registration successful:', res.data);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error.response?.data?.message);
            alert(`Registration failed: ${error.response?.data?.message || 'Server error'}`);
        }
    };

    // Theme-based styles
    const cardBg = theme === 'dark' ? 'rgba(30, 30, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
    const inputBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
    const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] relative overflow-hidden pt-16">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-6 py-8"
            >
                <motion.div 
                    className={`rounded-2xl shadow-2xl p-8 backdrop-blur-lg border ${borderColor}`}
                    style={{ 
                        backgroundColor: cardBg,
                        boxShadow: theme === 'dark' ? '0 0 30px rgba(123, 104, 238, 0.3)' : '0 0 30px rgba(0, 0, 0, 0.1)'
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                    <div className="text-center mb-8">
                        <motion.h2 
                            className={`text-3xl font-bold mb-2 ${textColor}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Join the Journey
                        </motion.h2>
                        <motion.p 
                            className={`text-sm ${secondaryText}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Create your account to start coding
                        </motion.p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <motion.div 
                            className="mb-4"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className={`block mb-2 text-sm font-medium ${textColor}`}>Username</label>
                            <input
                                type="text"
                                name="username"
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg ${inputBg} ${borderColor} border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-purple-500' : 'focus:ring-blue-500'} transition-all`}
                                required
                            />
                        </motion.div>

                        <motion.div 
                            className="mb-4"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label className={`block mb-2 text-sm font-medium ${textColor}`}>Email</label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg ${inputBg} ${borderColor} border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-purple-500' : 'focus:ring-blue-500'} transition-all`}
                                required
                            />
                        </motion.div>

                        <motion.div 
                            className="mb-6"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <label className={`block mb-2 text-sm font-medium ${textColor}`}>Password</label>
                            <input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg ${inputBg} ${borderColor} border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-purple-500' : 'focus:ring-blue-500'} transition-all`}
                                required
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <motion.button 
                                type="submit" 
                                className="w-full px-6 py-3 font-medium rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all"
                                whileHover={{ 
                                    scale: 1.02,
                                    boxShadow: '0 5px 15px rgba(123, 104, 238, 0.4)'
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Register
                            </motion.button>
                        </motion.div>
                    </form>

                    <motion.div 
                        className="text-center mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <p className={`text-sm ${secondaryText}`}>
                            Already have an account?{' '}
                            <Link 
                                to="/login" 
                                className={`font-medium ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-blue-600 hover:text-blue-500'} transition-colors`}
                            >
                                Login
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: '300px',
                            height: '300px',
                            background: 'radial-gradient(circle, rgba(123, 104, 238, 0.1) 0%, rgba(0,0,0,0) 70%)',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0.2, 0.4, 0.2],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default RegisterPage;
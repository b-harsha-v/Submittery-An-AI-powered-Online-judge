import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios'; // Changed from 'axios'
import { ThemeToggle } from './ThemeToggle';
import { Button } from "@/components/ui/button";

const Navbar = () => {
    const { authUser, setAuthUser } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await api.post('/api/auth/logout'); // Changed from axios.post
            setAuthUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setIsLoading(false);
            setShowDropdown(false);
        }
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <nav className="bg-gradient-to-r from-purple-700 to-violet-400 dark:from-violet-900 dark:to-violet-700 shadow-md">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-3">
                    {/* Left side - Logo and Problems link */}
                    <div className="flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-2xl font-extrabold text-white hover:text-gray-100 transition-colors"
                            style={{
                                fontFamily: 'Consolas, Monaco, monospace',
                                letterSpacing: '-0.5px'
                            }}
                        >
                            Submittery
                        </Link>
                        
                        <Link 
                            to="/problems" 
                            className="text-white hover:text-gray-100 font-medium transition-colors"
                        >
                            Problems
                        </Link>
                    </div>

                    {/* Right side - Theme toggle and auth buttons */}
                    <div className="flex items-center space-x-6">
                        
                        <ThemeToggle />
                        
                        {authUser ? (
                            <div className="flex items-center space-x-4 relative">
                                {authUser.role === 'admin' && (
                                    <Link 
                                        to="/admin/problems" 
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-purple-700 dark:text-violet-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                
                                {/* User dropdown menu */}
                                <div className="relative">
                                    <Button 
                                        variant="ghost"
                                        onClick={toggleDropdown}
                                        className="flex items-center space-x-2 focus:outline-none text-white hover:bg-white/10"
                                    >
                                        <div className="flex items-center">
                                            {authUser.avatar ? (
                                                <img 
                                                    src={authUser.avatar} 
                                                    alt={authUser.username} 
                                                    className="h-8 w-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-white">
                                            {authUser.username}
                                        </span>
                                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </Button>
                                    
                                    {showDropdown && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-violet-800 ring-1 ring-black dark:ring-violet-600 ring-opacity-5 focus:outline-none z-50">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-violet-700"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <div className="flex items-center">
                                                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    Profile
                                                </div>
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-violet-700"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <div className="flex items-center">
                                                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Settings
                                                </div>
                                            </Link>
                                            <div className="border-t border-gray-200 dark:border-violet-600 my-1"></div>
                                            <button
                                                onClick={handleLogout}
                                                disabled={isLoading}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-violet-700 flex items-center"
                                            >
                                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                {isLoading ? 'Logging out...' : 'Logout'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className="px-3 py-1.5 text-sm font-medium rounded-md text-white hover:text-gray-100 border border-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-purple-700 dark:text-violet-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
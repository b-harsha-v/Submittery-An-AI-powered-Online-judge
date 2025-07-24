import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../components/ThemeProvider';

const ProblemsListPage = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await axios.get('/api/problems');
                setProblems(res.data);
            } catch (error) {
                console.error('Failed to fetch problems', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    // Theme-based styles
    const cardBg = theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/80';
    const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    const headerBg = theme === 'dark' ? 'bg-purple-900/70' : 'bg-purple-600/90';
    const rowHover = theme === 'dark' ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100/70';
    const difficultyColor = (difficulty) => {
        if (theme === 'dark') {
            return difficulty === 'Easy' ? 'text-green-400' : 
                   difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400';
        }
        return difficulty === 'Easy' ? 'text-green-600' : 
               difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600';
    };

    if (loading) {
        return (
            <div className={`flex justify-center items-center min-h-[calc(100vh-4rem)] ${textColor}`}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full"
                />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`container mx-auto p-4 min-h-[calc(100vh-4rem)] ${textColor}`}
        >
            <div className="max-w-7xl mx-auto">
                <motion.h1 
                    className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Problemset
                </motion.h1>

                <motion.div
                    className={`rounded-xl shadow-xl overflow-hidden backdrop-blur-lg border ${borderColor} ${cardBg}`}
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className={`${headerBg} text-white`}>
                                    <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">ID</th>
                                    <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Title</th>
                                    <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Difficulty</th>
                                    <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Topics</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {problems.map((problem, index) => (
                                    <motion.tr 
                                        key={problem._id}
                                        className={`${rowHover} transition-colors duration-200`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + index * 0.03 }}
                                    >
                                        <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                                            {index + 1}
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <Link 
                                                to={`/problems/${problem._id}`} 
                                                className={`text-sm font-medium hover:text-purple-500 transition-colors ${textColor}`}
                                            >
                                                {problem.title}
                                            </Link>
                                        </td>
                                        <td className={`py-4 px-6 whitespace-nowrap text-sm font-bold ${difficultyColor(problem.difficulty)}`}>
                                            {problem.difficulty}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-wrap gap-2">
                                                {problem.tags.map((tag, i) => (
                                                    <span 
                                                        key={i}
                                                        className={`text-xs px-2 py-1 rounded-full ${
                                                            theme === 'dark' ? 'bg-purple-900/50 text-purple-200' : 'bg-purple-100 text-purple-800'
                                                        }`}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Pagination would go here */}
                <div className="mt-6 flex justify-center">
                    <nav className="flex space-x-2">
                        <button className={`px-3 py-1 rounded-md ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                            Previous
                        </button>
                        <button className={`px-3 py-1 rounded-md bg-purple-600 text-white`}>
                            1
                        </button>
                        <button className={`px-3 py-1 rounded-md ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                            Next
                        </button>
                    </nav>
                </div>
            </div>
        </motion.div>
    );
};

export default ProblemsListPage;
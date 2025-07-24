// client/src/pages/AddProblemPage.jsx
import React, { useState } from 'react';
import api from '../api/axios'; // Changed from 'axios'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../components/ThemeProvider';

const AddProblemPage = () => {
    const [title, setTitle] = useState('');
    const [statement, setStatement] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [hiddenTestCases, setHiddenTestCases] = useState([{ input: '', output: '' }]);
    const { theme } = useTheme();

    const navigate = useNavigate();

    // Theme-based styles
    const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
    const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
    const cardBg = theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80';
    const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
    const inputBg = theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800';
    const inputBorder = theme === 'dark' ? 'border-gray-600 focus:border-purple-400' : 'border-gray-300 focus:border-purple-400';
    const inputPlaceholder = theme === 'dark' ? 'placeholder-gray-400' : 'placeholder-gray-500';
    const labelColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';

    const handleTestCaseChange = (index, event) => {
        const values = [...hiddenTestCases];
        values[index][event.target.name] = event.target.value;
        setHiddenTestCases(values);
    };

    const addTestCase = () => {
        setHiddenTestCases([...hiddenTestCases, { input: '', output: '' }]);
    };

    const removeTestCase = (index) => {
        const values = [...hiddenTestCases];
        values.splice(index, 1);
        setHiddenTestCases(values);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Changed from 'axios.post' to 'api.post'
            await api.post('/api/problems', { 
                title, 
                statement, 
                difficulty, 
                hiddenTestCases 
            });
            alert('Problem added successfully!');
            navigate('/problems');
        } catch (error) {
            console.error('Failed to add problem:', error);
            alert(`Error: ${error.response.data.message}`);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`min-h-screen ${bgColor} ${textColor}`}
        >
            <div className="container mx-auto p-4">
                <motion.h1 
                    className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Add New Problem
                </motion.h1>
                
                <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className={`${cardBg} rounded-xl shadow-xl backdrop-blur-lg border ${borderColor} p-8 max-w-4xl mx-auto`}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Field */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className={`block font-medium mb-2 ${labelColor}`}>Title</label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                className={`w-full p-3 border rounded-lg ${inputBg} ${inputBorder} ${inputPlaceholder} focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                                required 
                            />
                        </motion.div>

                        {/* Problem Statement Field */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className={`block font-medium mb-2 ${labelColor}`}>Problem Statement</label>
                            <textarea 
                                value={statement} 
                                onChange={(e) => setStatement(e.target.value)} 
                                rows="10" 
                                className={`w-full p-3 border rounded-lg ${inputBg} ${inputBorder} ${inputPlaceholder} focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-vertical`}
                                required
                            />
                        </motion.div>

                        {/* Difficulty Field */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label className={`block font-medium mb-2 ${labelColor}`}>Difficulty</label>
                            <select 
                                value={difficulty} 
                                onChange={(e) => setDifficulty(e.target.value)} 
                                className={`w-full p-3 border rounded-lg ${inputBg} ${inputBorder} focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </motion.div>

                        {/* Hidden Test Cases Section */}
                        <motion.div 
                            className="space-y-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h2 className={`text-2xl font-semibold ${textColor} mb-4`}>Hidden Test Cases</h2>
                            {hiddenTestCases.map((testCase, index) => (
                                <motion.div 
                                    key={index} 
                                    className={`p-6 border rounded-lg space-y-4 ${borderColor} ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/50'}`}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                >
                                    <h3 className={`font-medium text-lg ${textColor}`}>Test Case {index + 1}</h3>
                                    
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Input</label>
                                        <textarea 
                                            name="input" 
                                            value={testCase.input} 
                                            onChange={e => handleTestCaseChange(index, e)} 
                                            rows="3" 
                                            className={`w-full p-3 border rounded-lg ${inputBg} ${inputBorder} ${inputPlaceholder} focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-vertical`}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Output</label>
                                        <textarea 
                                            name="output" 
                                            value={testCase.output} 
                                            onChange={e => handleTestCaseChange(index, e)} 
                                            rows="3" 
                                            className={`w-full p-3 border rounded-lg ${inputBg} ${inputBorder} ${inputPlaceholder} focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-vertical`}
                                        />
                                    </div>
                                    
                                    <button 
                                        type="button" 
                                        onClick={() => removeTestCase(index)} 
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            theme === 'dark' ? 'bg-red-600 hover:bg-red-500' : 'bg-red-500 hover:bg-red-400'
                                        } text-white`}
                                    >
                                        Remove Test Case
                                    </button>
                                </motion.div>
                            ))}
                            
                            <motion.button 
                                type="button" 
                                onClick={addTestCase} 
                                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                                    theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-600 hover:bg-gray-700'
                                } text-white`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Add Test Case
                            </motion.button>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="pt-6"
                        >
                            <button 
                                type="submit" 
                                className={`w-full px-6 py-4 rounded-lg font-bold text-lg transition-all ${
                                    theme === 'dark' ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700'
                                } text-white shadow-lg hover:shadow-xl`}
                            >
                                Add Problem
                            </button>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AddProblemPage;
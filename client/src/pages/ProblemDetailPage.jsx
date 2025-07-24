import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios'; // Changed from 'axios'
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { AuthContext } from '../context/AuthContext';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/ThemeProvider";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ProblemDetailPage = () => {
    // State for all features
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('cpp');
    const [code, setCode] = useState('// Your code here');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [explanation, setExplanation] = useState('');
    const [isExplained, setIsExplained] = useState(false);
    const [isExplaining, setIsExplaining] = useState(false);
    const [debugExplanation, setDebugExplanation] = useState('');
    const [isDebugging, setIsDebugging] = useState(false);
    const [customInput, setCustomInput] = useState('');
    const [runOutput, setRunOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [review, setReview] = useState('');
    const [isReviewing, setIsReviewing] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    
    const { authUser } = useContext(AuthContext);
    const { id: problemId } = useParams();
    const { theme } = useTheme();

    // All handler functions and useEffects remain the same
    useEffect(() => { const fetchProblem = async () => { try { const res = await api.get(`/api/problems/${problemId}`); setProblem(res.data); } catch (error) { console.error('Failed to fetch problem', error); } finally { setLoading(false); } }; fetchProblem(); }, [problemId]);
    useEffect(() => { const fetchSubmissions = async () => { if (authUser) { try { const res = await api.get(`/api/submissions/problem/${problemId}`); setSubmissions(res.data); } catch (error) { console.error("Failed to fetch submissions", error); } } }; fetchSubmissions(); }, [problemId, authUser, result]);
    const handleSubmit = async () => { if (!authUser) { alert('Please log in.'); return; } setIsSubmitting(true); setResult(null); setDebugExplanation(''); try { const res = await api.post('/api/submissions', { language, code, problemId }); setResult(res.data); } catch (error) { setResult({ verdict: 'Error', output: 'Submission failed.' }); } finally { setIsSubmitting(false); } };
    const handleRunCode = async () => { if (!authUser) { alert('Please log in.'); return; } setIsRunning(true); setRunOutput(null); try { const res = await api.post('/api/submissions/run-custom', { language, code, input: customInput }); setRunOutput(res.data); } catch (error) { setRunOutput({ verdict: 'Error', error: 'Run failed.' }); } finally { setIsRunning(false); } };
    const handleExplainProblem = async () => { setIsExplaining(true); try { const res = await api.post('/api/ai/explain', { problemId }); setExplanation(res.data.explanation); setIsExplained(true); } catch (error) { setExplanation("Couldn't get explanation."); } finally { setIsExplaining(false); } };
    const handleDebugCode = async () => { setIsDebugging(true); setDebugExplanation(''); try { const res = await api.post('/api/ai/debug', { problemId, userCode: code, language, verdict: result.verdict, actualOutput: result.output }); setDebugExplanation(res.data.explanation); } catch (error) { setDebugExplanation("Couldn't get debug hint."); } finally { setIsDebugging(false); } };
    const handleCodeReview = async () => { if (!authUser) { alert('Please log in.'); return; } setIsReviewModalOpen(true); setIsReviewing(true); setReview(''); try { const res = await api.post('/api/ai/review', { language, code }); setReview(res.data.review); } catch (error) { setReview('An error occurred.'); } finally { setIsReviewing(false); } };

    if (loading) return <div>Loading problem...</div>;
    if (!problem) return <div>Problem not found.</div>;

    return (
        <>
            {selectedSubmission && ( <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"><div className="bg-card rounded-lg w-3/4 h-3/4 flex flex-col shadow-2xl border"><div className="p-4 border-b flex justify-between items-center"><h2 className="text-xl font-bold">Submitted Code ({selectedSubmission.language})</h2><Button variant="ghost" size="icon" onClick={() => setSelectedSubmission(null)}><span className="text-2xl">&times;</span></Button></div><div className="flex-grow"><Editor height="100%" language={selectedSubmission.language} value={selectedSubmission.code} theme={theme === 'dark' ? 'vs-dark' : 'light'} options={{ readOnly: true, minimap: { enabled: false } }} /></div></div></div> )}
            {isReviewModalOpen && ( <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"><div className="bg-card rounded-lg w-1/2 h-3/4 flex flex-col shadow-2xl border"><div className="p-4 border-b flex justify-between items-center"><h2 className="text-xl font-bold">🤖 AI Code Review</h2><Button variant="ghost" size="icon" onClick={() => setIsReviewModalOpen(false)}><span className="text-2xl">&times;</span></Button></div><div className="flex-grow p-6 overflow-y-auto prose dark:prose-invert max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{isReviewing ? 'Reviewing...' : review}</ReactMarkdown></div></div></div> )}

           <div className="fixed inset-0 pt-16"> {/* Full viewport height minus navbar */}
                <PanelGroup direction="horizontal" className="h-full">
                    {/* Left Panel - Problem Statement */}
                    <Panel defaultSize={50} minSize={30} className="pr-4">
                        <div className="h-full flex flex-col overflow-hidden">
                            <div className="p-4">
                                <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
                                <span className={`px-2 py-1 text-sm font-semibold rounded ${problem.difficulty === 'Easy' ? 'bg-green-200 text-green-800' : problem.difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>
                                    {problem.difficulty}
                                </span>
                            </div>

                            <Tabs defaultValue="problem" className="flex flex-col h-full">
                                <TabsList className="grid w-full grid-cols-2 px-4">
                                    <TabsTrigger value="problem">Problem</TabsTrigger>
                                    <TabsTrigger value="submissions">My Submissions</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="problem" className="flex-1 overflow-y-auto px-4 pb-4">
                                    <div className="bg-card p-6 rounded-lg border h-full">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-2xl font-semibold">Problem Statement</h2>
                                            <Button onClick={handleExplainProblem} disabled={isExplaining} variant="secondary" size="sm">
                                                {isExplaining ? 'Thinking...' : '🤖 Explain'}
                                            </Button>
                                        </div>
                                        <div className="prose dark:prose-invert max-w-none h-full overflow-y-auto">
                                            <p className="whitespace-pre-wrap">{problem.statement}</p>
                                            {isExplained && (
                                                <div className="mt-6 pt-6 border-t">
                                                    <h3 className="text-xl font-semibold mb-4">AI Explanation</h3>
                                                    <div className="prose dark:prose-invert max-w-none">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {problem.examples && problem.examples.length > 0 && (
                                        <div className="mt-6">
                                            <h2 className="text-2xl font-semibold mb-4">Examples</h2>
                                            {problem.examples.map((example, index) => (
                                                <div key={index} className="bg-muted p-4 rounded-lg mb-4 border">
                                                    <h3 className="font-bold">Example {index + 1}</h3>
                                                    <div className="mt-2">
                                                        <p className="font-semibold">Input:</p>
                                                        <pre className="bg-primary-foreground text-secondary-foreground p-2 rounded mt-1">
                                                            <code>{example.input}</code>
                                                        </pre>
                                                    </div>
                                                    <div className="mt-2">
                                                        <p className="font-semibold">Output:</p>
                                                        <pre className="bg-primary-foreground text-secondary-foreground p-2 rounded mt-1">
                                                            <code>{example.output}</code>
                                                        </pre>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>
                                
                                <TabsContent value="submissions" className="flex-1 overflow-y-auto px-4 pb-4">
                                    <div className="bg-card rounded-lg border h-full overflow-hidden">
                                        <table className="min-w-full h-full">
                                            <thead className="bg-muted border-b">
                                                <tr>
                                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">When</th>
                                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Language</th>
                                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Verdict</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground">
                                                {submissions.length > 0 ? submissions.map(sub => (
                                                    <tr key={sub._id} className="hover:bg-muted/50 cursor-pointer border-t" onClick={() => setSelectedSubmission(sub)}>
                                                        <td className="text-left py-3 px-4">{new Date(sub.createdAt).toLocaleString()}</td>
                                                        <td className="text-left py-3 px-4">{sub.language}</td>
                                                        <td className={`text-left py-3 px-4 font-bold ${sub.verdict === 'Accepted' ? 'text-green-600' : 'text-red-600'}`}>
                                                            {sub.verdict}
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="3" className="text-center p-4">No submissions yet.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </Panel>
                    
                    <PanelResizeHandle className="w-2 bg-border hover:bg-primary transition-colors" />

                    {/* Right Panel - Editor */}
                    <Panel defaultSize={50} minSize={30} className="pl-4">
                        <div className="h-full flex flex-col">
                            <div className="flex justify-end items-center mb-2 p-4 pb-0">
                                <select 
                                    id="language-select" 
                                    value={language} 
                                    onChange={(e) => setLanguage(e.target.value)} 
                                    className="p-2 border rounded bg-card"
                                >
                                    <option value="cpp">C++</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                </select>
                            </div>
                            
                            <PanelGroup direction="vertical" className="flex-1">
                                <Panel defaultSize={65} minSize={20}>
                                    <div className="h-full">
                                        <Editor 
                                            height="100%" 
                                            language={language} 
                                            value={code} 
                                            onChange={(value) => setCode(value)} 
                                            theme={theme === 'dark' ? 'vs-dark' : 'light'}
                                            options={{
                                                minimap: { enabled: false },
                                                scrollBeyondLastLine: false
                                            }}
                                        />
                                    </div>
                                </Panel>
                                
                                <PanelResizeHandle className="h-2 bg-border hover:bg-primary transition-colors" />
                                
                                <Panel defaultSize={35} minSize={20}>
                                    <div className="h-full flex flex-col p-4">
                                        <div className="p-2 border-b font-medium text-sm text-muted-foreground">Test with Custom Input</div>
                                        <div className="flex-grow grid grid-cols-2 gap-2 pt-2">
                                            <div className="flex flex-col h-full">
                                                <label className="text-xs font-semibold mb-1 text-muted-foreground">INPUT</label>
                                                <textarea 
                                                    value={customInput} 
                                                    onChange={(e) => setCustomInput(e.target.value)} 
                                                    className="w-full h-full p-2 border rounded font-mono text-sm resize-none bg-background" 
                                                    placeholder="Enter input..."
                                                />
                                            </div>
                                            <div className="flex flex-col h-full">
                                                <label className="text-xs font-semibold mb-1 text-muted-foreground">OUTPUT</label>
                                                <pre className="w-full h-full p-2 border rounded bg-muted text-muted-foreground font-mono text-sm whitespace-pre-wrap overflow-y-auto">
                                                    {isRunning ? 'Running...' : (runOutput ? (runOutput.error || runOutput.output) : 'Run your code to see the output here.')}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </Panel>
                            </PanelGroup>
                            
                            <div className="mt-4 flex justify-end gap-4 p-4">
                                <Button variant="secondary" onClick={handleCodeReview} disabled={isReviewing || isRunning || isSubmitting}>
                                    {isReviewing ? 'Reviewing...' : 'AI Review'}
                                </Button>
                                <Button variant="secondary" onClick={handleRunCode} disabled={isRunning || isSubmitting}>
                                    {isRunning ? 'Running...' : 'Run'}
                                </Button>
                                <Button onClick={handleSubmit} disabled={isSubmitting || isRunning}>
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </Button>
                            </div>
                            
                            {result && (
                                <div className="mt-4 overflow-y-auto p-4">
                                    <h2 className="text-2xl font-semibold">Result</h2>
                                    <div className={`mt-2 p-4 rounded-lg border ${result.verdict === 'Accepted' ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}`}>
                                        <p className="font-bold text-lg">Verdict: {result.verdict}</p>
                                        <h3 className="font-semibold mt-2">Output:</h3>
                                        <pre className="bg-primary-foreground p-2 rounded mt-1 whitespace-pre-wrap">{result.output}</pre>
                                        {(result.verdict === 'Wrong Answer' || result.verdict === 'Runtime Error') && (
                                            <div className="mt-4">
                                                <Button variant="destructive" onClick={handleDebugCode} disabled={isDebugging}>
                                                    {isDebugging ? 'Analyzing...' : '🤖 Why is my code wrong?'}
                                                </Button>
                                            </div>
                                        )}
                                        {debugExplanation && (
                                            <div className="mt-4 bg-secondary/50 p-6 rounded-lg border prose dark:prose-invert max-w-none">
                                                <h3 className="text-xl font-semibold mb-2">AI Debugger</h3>
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{debugExplanation}</ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        </>
    );
};

export default ProblemDetailPage;
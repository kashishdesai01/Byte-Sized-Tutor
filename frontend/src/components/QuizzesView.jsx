import React, { useState, useEffect } from 'react';
import { API_URL, getAuthHeaders } from '../api';

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
);

function QuizzesView({ activeDocument, token, onGenerateQuiz, onViewAttempt, openConfirmationModal }) {
    const [pastAttempts, setPastAttempts] = useState([]);
    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
    const [selectedQuizAttempts, setSelectedQuizAttempts] = useState(new Set());

    const fetchQuizHistory = async () => {
        if (!activeDocument) return;
        try {
            const response = await fetch(`${API_URL}/documents/${activeDocument.id}/quiz-history`, { headers: getAuthHeaders(token) });
            if (response.ok) {
                setPastAttempts(await response.json());
            } else {
                setPastAttempts([]);
            }
        } catch (error) {
            console.error("Error fetching quiz history:", error);
            setPastAttempts([]);
        }
    };

    useEffect(() => {
        fetchQuizHistory();
        setSelectedQuizAttempts(new Set());
    }, [activeDocument, token]);

    const handleLocalGenerateQuiz = async () => {
        setIsGeneratingQuiz(true);
        await onGenerateQuiz();
        setIsGeneratingQuiz(false);
    };

    const handleQuizSelectionChange = (attemptId) => {
        setSelectedQuizAttempts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(attemptId)) {
                newSet.delete(attemptId);
            } else {
                newSet.add(attemptId);
            }
            return newSet;
        });
    };
    
    const handleDeleteSingleQuiz = (attemptId, e) => {
        e.stopPropagation();
        openConfirmationModal("Are you sure you want to delete this specific quiz attempt?", async () => {
            await fetch(`${API_URL}/quiz-attempts/${attemptId}`, { method: 'DELETE', headers: getAuthHeaders(token) });
            fetchQuizHistory();
        });
    };
    
    const handleDeleteSelectedQuizzes = () => {
        openConfirmationModal(`Are you sure you want to delete the ${selectedQuizAttempts.size} selected quiz attempts?`, async () => {
            await fetch(`${API_URL}/quiz-attempts/delete-multiple`, { method: 'POST', headers: getAuthHeaders(token), body: JSON.stringify({ attempt_ids: Array.from(selectedQuizAttempts) }) });
            fetchQuizHistory();
            setSelectedQuizAttempts(new Set());
        });
    };
    
    const handleDeleteAllQuizzes = () => {
        openConfirmationModal(`Are you sure you want to delete ALL quiz attempts for ${activeDocument.filename}?`, async () => {
            await fetch(`${API_URL}/documents/${activeDocument.id}/quizzes`, { method: 'DELETE', headers: getAuthHeaders(token) });
            fetchQuizHistory();
        });
    };

    return (
        <main className="w-2/3 flex flex-col p-4 h-full bg-slate-50 font-sans">
            <div className="bg-white rounded-lg flex-grow flex flex-col shadow-sm border border-slate-200">
                <div className="p-4 border-b border-slate-200">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{activeDocument.filename}</h2>
                            <p className="text-sm text-slate-500">Quiz History</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 items-end">
                            <button onClick={handleLocalGenerateQuiz} disabled={isGeneratingQuiz} className="py-2 px-4 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50">
                                {isGeneratingQuiz ? "Generating..." : "Generate New Quiz"}
                            </button>
                            {selectedQuizAttempts.size > 0 && 
                                <button onClick={handleDeleteSelectedQuizzes} className="py-2 px-4 bg-yellow-400 text-yellow-900 rounded-lg font-semibold text-sm hover:bg-yellow-500 transition-colors">
                                    Delete Selected ({selectedQuizAttempts.size})
                                </button>
                            }
                            <button onClick={handleDeleteAllQuizzes} disabled={pastAttempts.length === 0} className="py-2 px-4 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-50">
                                Delete All
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex-grow overflow-y-auto">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Past Attempts</h3>
                    {pastAttempts.length > 0 ? (
                        <ul className="space-y-3">
                            {pastAttempts.map(attempt => (
                                <li key={attempt.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200 transition-shadow hover:shadow-sm">
                                    <input
                                        type="checkbox"
                                        checked={selectedQuizAttempts.has(attempt.id)}
                                        onChange={() => handleQuizSelectionChange(attempt.id)}
                                        className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                                    />
                                    <div onClick={() => onViewAttempt(attempt)} className="flex-grow cursor-pointer">
                                        <p className="font-semibold text-slate-800">Score: {attempt.score.toFixed(1)}%</p>
                                        <p className="text-xs text-slate-500">{new Date(attempt.timestamp).toLocaleString()}</p>
                                    </div>
                                    <button onClick={(e) => handleDeleteSingleQuiz(attempt.id, e)} className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-100 flex-shrink-0">
                                        <TrashIcon />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-slate-500">No quiz attempts found.</p>
                            <p className="text-sm text-slate-400">Generate a quiz to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default QuizzesView;

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { API_URL, getAuthHeaders } from '../api';

const ActionButton = ({ onClick, disabled, children, colorClass }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${colorClass}`}
    >
        {children}
    </button>
);

function ChatView({ activeDocument, token, onGenerateQuiz, openConfirmationModal }) {
    const [chatHistory, setChatHistory] = useState([]);
    const [question, setQuestion] = useState('');
    const [isAsking, setIsAsking] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
    const chatEndRef = useRef(null);

    const fetchChatHistory = async () => {
        if (!activeDocument) return;
        try {
            const response = await fetch(`${API_URL}/documents/${activeDocument.id}/history`, { headers: getAuthHeaders(token) });
            const history = await response.json();
            setChatHistory(history.length > 0 ? history : [{ role: 'ai', content: `Hi! I'm your AI Study Buddy. How can I help you with **${activeDocument.filename}**?`}]);
        } catch (error) {
            setChatHistory([{ role: 'ai', content: `Hi! I'm your AI Study Buddy. How can I help you with **${activeDocument.filename}**?`}]);
        }
    };

    useEffect(() => {
        fetchChatHistory();
    }, [activeDocument]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleAskQuestion = async (e) => { };
    const handleSummarize = async () => { };
    const handleLocalGenerateQuiz = async () => {  };
    const handleDeleteChat = () => {  };

    return (
        
        <main className="w-2/3 flex flex-col h-full bg-slate-100">
            <div className="flex flex-col h-full m-4 bg-white rounded-lg shadow-lg border border-slate-200">
                
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 truncate" title={activeDocument.filename}>{activeDocument.filename}</h2>
                    <div className="flex gap-2 flex-shrink-0">
                        <ActionButton onClick={handleSummarize} disabled={isSummarizing || isAsking} colorClass="bg-purple-100 text-purple-700 hover:bg-purple-200">Summarize</ActionButton>
                        <ActionButton onClick={handleLocalGenerateQuiz} disabled={isAsking || isGeneratingQuiz} colorClass="bg-green-100 text-green-700 hover:bg-green-200">Generate Quiz</ActionButton>
                        <ActionButton onClick={handleDeleteChat} colorClass="bg-red-100 text-red-700 hover:bg-red-200">Delete Chat</ActionButton>
                    </div>
                </div>

                
                <div className="flex-grow p-6 overflow-y-auto">
                    {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex items-start gap-4 my-6 ${msg.role === 'human' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'ai' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 text-white flex items-center justify-center font-bold text-xs">AI</div>}
                            
                            <div className={`prose max-w-prose p-4 rounded-xl ${msg.role === 'human' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* ✅ UPDATED: Redesigned input form */}
                <div className="p-4 border-t border-slate-200 bg-white rounded-b-lg">
                    <form onSubmit={handleAskQuestion} onKeyDown={handleAskQuestion} className="flex gap-4">
                        <input
                            type="text"
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-grow p-3 rounded-lg bg-slate-100 text-slate-900 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            disabled={isAsking}
                        />
                        <button type="submit" disabled={isAsking || !question.trim()} className="py-3 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-slate-400 transition-colors">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default ChatView;

import React, { useState, useEffect } from 'react';
import { API_URL, getAuthHeaders } from '../api.jsx';
import DocumentSidebar from './DocumentSidebar.jsx';
import ChatView from './ChatView.jsx';
import QuizzesView from './QuizzesView.jsx';
import FlashcardsView from './FlashcardsView.jsx';
import Placeholder from './Placeholder.jsx';
import ConfirmationModal from './ConfirmationModal.jsx';
import QuizModal from './QuizModal.jsx';
import PastQuizView from './PastQuizView.jsx';
import FlashcardViewer from './FlashcardViewer.jsx';
import ProgressView from './ProgressView';

const AppLogo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="#4f46e5"/>
        <path d="M12 9H19C20.6569 9 22 10.3431 22 12V14C22 15.6569 20.6569 17 19 17H12V9Z" fill="white"/>
        <path d="M12 15H20C21.6569 15 23 16.3431 23 18V20C23 21.6569 21.6569 23 20 23H12V15Z" fill="#a5b4fc"/>
    </svg>
);

function MainApp({ token, onLogout }) {
    
    const [view, setView] = useState('chat');
    const [documents, setDocuments] = useState([]);
    const [activeDocument, setActiveDocument] = useState(null);
    const [quizData, setQuizData] = useState(null);
    const [selectedAttempt, setSelectedAttempt] = useState(null);
    const [activeFlashcardSet, setActiveFlashcardSet] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, message: '', onConfirm: () => {} });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');

    const fetchDocuments = async () => {
        try {
            const response = await fetch(`${API_URL}/documents/`, { headers: getAuthHeaders(token) });
            if (response.ok) {
                const docs = await response.json();
                setDocuments(docs);
                if (docs.length > 0 && !activeDocument) {
                    setActiveDocument(docs[0]);
                } else if (docs.length === 0) {
                    setActiveDocument(null);
                }
            } else if (response.status === 401) {
                onLogout();
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };
    
    useEffect(() => {
        if (token) fetchDocuments();
    }, [token]);

    useEffect(() => {
        setSelectedAttempt(null);
        setActiveFlashcardSet(null);
    }, [view, activeDocument]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setUploadMessage('');
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        setUploadMessage("Processing...");
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch(`${API_URL}/documents/upload`, { method: 'POST', headers: getAuthHeaders(token, false), body: formData });
            const result = await response.json();
            setUploadMessage(response.ok ? `Uploaded: ${result.filename}` : `Error: ${result.detail}`);
            if(response.ok) {
                await fetchDocuments();
                setSelectedFile(null);
                if(document.getElementById('file-input')) {
                    document.getElementById('file-input').value = "";
                }
            }
        } catch(err) {
            setUploadMessage('Upload failed. Server error.');
        } finally {
            setIsUploading(false);
        }
    };

    const openConfirmationModal = (message, onConfirm) => {
        setConfirmationModal({ isOpen: true, message, onConfirm: async () => {
            await onConfirm();
            setConfirmationModal({ isOpen: false, message: '', onConfirm: () => {} });
        }});
    };

    const handleDeleteDocument = (docId, e) => {
        e.stopPropagation();
        openConfirmationModal(
            "This will delete the document and all its associated chat and quiz data. This action cannot be undone.",
            async () => {
                await fetch(`${API_URL}/documents/${docId}`, { method: 'DELETE', headers: getAuthHeaders(token) });
                if(activeDocument?.id === docId) setActiveDocument(null);
                await fetchDocuments();
            }
        );
    };

    const handleGenerateQuiz = async () => {
        if (!activeDocument) return;
        const response = await fetch(`${API_URL}/generate-quiz`, { method: 'POST', headers: getAuthHeaders(token), body: JSON.stringify({ document_id: activeDocument.id }) });
        if (response.ok) {
            setQuizData(await response.json());
        } else {
            alert("Failed to generate quiz.");
        }
    };

    const handleQuizSubmitted = () => {};

    const renderView = () => {
        if (!activeDocument) {
            return <Placeholder text="Select or upload a document to begin." />;
        }
        switch (view) {
            case 'quizzes':
                return <QuizzesView token={token} activeDocument={activeDocument} onGenerateQuiz={handleGenerateQuiz} onViewAttempt={setSelectedAttempt} openConfirmationModal={openConfirmationModal} />;
            case 'flashcards':
                return <FlashcardsView token={token} activeDocument={activeDocument} onViewFlashcardSet={setActiveFlashcardSet} openConfirmationModal={openConfirmationModal} />;
            case 'progress':
                return <ProgressView token={token} activeDocument={activeDocument} />;
            case 'chat':
            default:
                return <ChatView token={token} activeDocument={activeDocument} onGenerateQuiz={handleGenerateQuiz} openConfirmationModal={openConfirmationModal} />;
        }
    };

    return (
       
        <div className="flex flex-col h-screen bg-slate-50 text-slate-800 font-sans">
            <ConfirmationModal isOpen={confirmationModal.isOpen} onClose={() => setConfirmationModal({isOpen: false})} onConfirm={confirmationModal.onConfirm} message={confirmationModal.message}/>
            {activeFlashcardSet && <FlashcardViewer set={activeFlashcardSet} onClose={() => setActiveFlashcardSet(null)} />}
            {quizData && <QuizModal quizData={quizData} token={token} activeDocument={activeDocument} onClose={() => setQuizData(null)} onQuizSubmit={handleQuizSubmitted} />}
            {selectedAttempt && <PastQuizView attempt={selectedAttempt} onClose={() => setSelectedAttempt(null)} />}
            
        
            <nav className="bg-white p-3 flex justify-between items-center border-b border-slate-200 flex-shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                    <AppLogo />
                    <h1 className="text-lg font-bold text-slate-800 hidden sm:block">Byte Sized Tutor</h1>
                </div>

                <div className="flex justify-center gap-2">
                    <button onClick={() => setView('chat')} className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${view === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>Chat</button>
                    <button onClick={() => setView('quizzes')} className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${view === 'quizzes' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>Quizzes</button>
                    <button onClick={() => setView('flashcards')} className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${view === 'flashcards' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>Flashcards</button>
                    <button onClick={() => setView('progress')} className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${view === 'progress' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>Progress</button>
                </div>

                <div>
                    <button onClick={onLogout} className="py-2 px-4 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors duration-200">
                        Logout
                    </button>
                </div>
            </nav>
            
            <div className="flex-grow flex overflow-hidden">
                <DocumentSidebar 
                    documents={documents}
                    activeDocument={activeDocument}
                    onDocumentSelect={setActiveDocument}
                    onFileChange={handleFileChange}
                    onUpload={handleUpload}
                    isUploading={isUploading}
                    selectedFile={selectedFile}
                    uploadMessage={uploadMessage}
                    onDeleteDocument={handleDeleteDocument}
                    onLogout={onLogout}
                />
                {renderView()}
            </div>
        </div>
    );
}

export default MainApp;

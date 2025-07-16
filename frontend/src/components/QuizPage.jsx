// components/QuizPage.jsx
import React from 'react';
import { TrashIcon } from './icons.jsx';

function QuizPage({ token, activeDocument, pastAttempts, setPastAttempts, selectedAttempt, setSelectedAttempt, selectedQuizAttempts, setSelectedQuizAttempts, setQuizData, setConfirmationModal, getHeaders }) {
  const API_URL = 'http://127.0.0.1:8000';

  const handleGenerateQuiz = async () => {
    const response = await fetch(`${API_URL}/generate-quiz`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ document_id: activeDocument.id })
    });
    if (response.ok) setQuizData(await response.json());
    else alert('Failed to generate quiz.');
  };

  const handleQuizSelectionChange = (attemptId) => {
    setSelectedQuizAttempts(prev => {
      const newSet = new Set(prev);
      newSet.has(attemptId) ? newSet.delete(attemptId) : newSet.add(attemptId);
      return newSet;
    });
  };

  const handleDeleteSingleQuiz = (attemptId, e) => {
    e.stopPropagation();
    setConfirmationModal({
      isOpen: true,
      message: 'Are you sure you want to delete this specific quiz attempt?',
      onConfirm: async () => {
        await fetch(`${API_URL}/quiz-attempts/${attemptId}`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        fetchQuizHistory();
        setConfirmationModal({ isOpen: false });
      }
    });
  };

  const handleDeleteAllQuizzes = () => {
    setConfirmationModal({
      isOpen: true,
      message: `Are you sure you want to delete ALL quiz attempts for ${activeDocument.filename}?`,
      onConfirm: async () => {
        await fetch(`${API_URL}/documents/${activeDocument.id}/quizzes`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        setPastAttempts([]);
        setConfirmationModal({ isOpen: false });
      }
    });
  };

  const handleDeleteSelectedQuizzes = () => {
    setConfirmationModal({
      isOpen: true,
      message: `Are you sure you want to delete the ${selectedQuizAttempts.size} selected quiz attempts?`,
      onConfirm: async () => {
        await fetch(`${API_URL}/quiz-attempts/delete-multiple`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ attempt_ids: Array.from(selectedQuizAttempts) })
        });
        setSelectedQuizAttempts(new Set());
        setPastAttempts([]);
        setConfirmationModal({ isOpen: false });
      }
    });
  };

  return (
    <main className="w-2/3 flex flex-col p-4">
      {activeDocument ? (
        <div className="bg-gray-700 rounded-lg flex-grow flex flex-col">
          <div className="p-4 border-b border-gray-600 flex justify-between items-center flex-wrap gap-2">
            <div>
              <h2 className="text-2xl font-semibold">{activeDocument.filename}</h2>
              <button onClick={handleGenerateQuiz} className="mt-2 py-2 px-4 bg-green-500 rounded-full text-white font-bold text-sm">Generate New Quiz</button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              {selectedQuizAttempts.size > 0 && <button onClick={handleDeleteSelectedQuizzes} className="py-2 px-4 bg-yellow-500 rounded-full text-black font-bold text-sm">Delete Selected ({selectedQuizAttempts.size})</button>}
              <button onClick={handleDeleteAllQuizzes} disabled={pastAttempts.length === 0} className="py-2 px-4 bg-red-600 rounded-full text-white font-bold text-sm disabled:bg-gray-500">Delete All</button>
            </div>
          </div>
          <div className="p-4 flex-grow overflow-y-auto">
            <h3 className="text-xl font-bold mb-2">Past Attempts</h3>
            {pastAttempts.length > 0 ? pastAttempts.map(attempt => (
              <div key={attempt.id} className="flex items-center gap-4 p-2 bg-gray-800 rounded-lg mb-2">
                <input type="checkbox" checked={selectedQuizAttempts.has(attempt.id)} onChange={() => handleQuizSelectionChange(attempt.id)} className="form-checkbox h-5 w-5 bg-gray-700 border-gray-500 rounded text-cyan-500 focus:ring-cyan-500 flex-shrink-0" />
                <div onClick={() => setSelectedAttempt(attempt)} className="flex-grow cursor-pointer">
                  <p className="font-semibold">Score: {attempt.score.toFixed(1)}%</p>
                  <p className="text-xs text-gray-400">{new Date(attempt.timestamp).toLocaleString()}</p>
                </div>
                <button onClick={(e) => handleDeleteSingleQuiz(attempt.id, e)} className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-red-500/50 flex-shrink-0"><TrashIcon /></button>
              </div>
            )) : <p className="text-gray-400">No quiz attempts found.</p>}
          </div>
        </div>
      ) : <p className="text-2xl text-center text-gray-400">Select a document to view quiz history.</p>}
    </main>
  );
}

export default QuizPage;

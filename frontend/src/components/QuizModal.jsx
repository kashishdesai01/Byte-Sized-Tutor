import React, { useState } from 'react';
import { API_URL } from '../api.jsx';

function QuizModal({ quizData, token, activeDocument, onClose, onQuizSubmit }) {
    const [userAnswers, setUserAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    if (!quizData || !quizData.questions) return null;

    const handleAnswer = (qIndex, option) => {
        if (submitted) return;
        setUserAnswers(prev => ({ ...prev, [qIndex]: option }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        let correctCount = 0;
        const submissionAnswers = quizData.questions.map((q, qIndex) => {
            const selected = userAnswers[qIndex] || "No answer";
            const isCorrect = selected === q.correct_answer;
            if(isCorrect) correctCount++;
            return { question_text: q.question, selected_answer: selected, correct_answer: q.correct_answer, is_correct: isCorrect };
        });
        
        const finalScore = (correctCount / quizData.questions.length) * 100;
        setScore(finalScore);

        await fetch(`${API_URL}/submit-quiz`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ document_id: activeDocument.id, score: finalScore, answers: submissionAnswers })
        });
        
        setSubmitted(true);
        setIsSubmitting(false);
        if(onQuizSubmit) onQuizSubmit();
    };

    const allAnswered = Object.keys(userAnswers).length === quizData.questions.length;

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-60 flex justify-center items-center z-50 p-4 font-sans">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">New Quiz</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-800 text-2xl transition-colors">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-50">
                {submitted ? (
                    <div className="text-center py-10">
                        <h3 className="text-3xl font-bold text-slate-800">Quiz Complete!</h3>
                        <p className="text-6xl font-extrabold text-indigo-600 my-4">{score.toFixed(1)}%</p>
                        <p className="text-slate-500">You can now close this window.</p>
                    </div>
                ) : (
                    quizData.questions.map((q, qIndex) => (
                        <div key={qIndex} className="mb-6 p-4 bg-white rounded-lg border border-slate-200">
                            <p className="font-semibold text-lg mb-4 text-slate-800">{qIndex + 1}. {q.question}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {q.options.map((option, oIndex) => (
                                    <button 
                                        key={oIndex} 
                                        onClick={() => handleAnswer(qIndex, option)} 
                                        className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200
                                            ${userAnswers[qIndex] === option 
                                                ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' 
                                                : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400'}`
                                        }
                                    >
                                        <span className="font-medium text-slate-700">{option}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="p-4 border-t border-slate-200 text-right bg-slate-50 rounded-b-lg">
                {!submitted ? (
                    <button onClick={handleSubmit} disabled={!allAnswered || isSubmitting} className="py-2 px-6 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:bg-slate-400">
                        {isSubmitting ? "Submitting..." : "Submit Answers"}
                    </button>
                ) : (
                    <button onClick={onClose} className="py-2 px-6 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">Close</button>
                )}
            </div>
          </div>
        </div>
    );
}

export default QuizModal;

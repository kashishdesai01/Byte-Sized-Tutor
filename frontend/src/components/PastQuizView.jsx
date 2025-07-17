import React from 'react';

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;


function PastQuizView({ attempt, onClose }) {
    if (!attempt) return null;

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-60 flex justify-center items-center z-50 p-4 font-sans">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Quiz Review</h2>
                        <p className="text-sm text-slate-500">Taken on {new Date(attempt.timestamp).toLocaleString()}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800 text-2xl transition-colors">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto bg-slate-50">
                    <h3 className="text-2xl font-bold mb-6 text-center text-slate-800">Final Score: <span className="text-indigo-600">{attempt.score.toFixed(1)}%</span></h3>
                    
                    <div className="space-y-4">
                        {attempt.answers.map((answer, index) => (
                            <div key={index} className="p-4 bg-white rounded-lg border border-slate-200">
                                <p className="font-semibold text-lg mb-3 text-slate-800">{index + 1}. {answer.question_text}</p>
                                
                                <p className={`p-3 rounded-lg flex items-center justify-between text-sm ${answer.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                                    <span className="font-medium text-slate-700">Your answer: <span className="font-bold">{answer.selected_answer}</span></span>
                                    {answer.is_correct ? <CheckIcon/> : <XIcon/>}
                                </p>
                                
                                {!answer.is_correct && (
                                    <p className="p-3 mt-2 rounded-lg bg-slate-100 text-sm font-medium text-slate-700">Correct answer: <span className="font-bold text-green-700">{answer.correct_answer}</span></p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PastQuizView;

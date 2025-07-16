import React, { useState } from 'react';

function FlashcardViewer({ set, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (!set || !set.cards || set.cards.length === 0) return null;
    
    const card = set.cards[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex(prev => (prev + 1) % set.cards.length), 150);
    };
    
    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex(prev => (prev - 1 + set.cards.length) % set.cards.length), 150);
    };

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-60 flex justify-center items-center z-50 p-4 font-sans">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[28rem] flex flex-col p-6 text-center">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800">{set.title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800 text-2xl transition-colors">&times;</button>
                </div>
                
                {/* The Flippable Card */}
                <div onClick={() => setIsFlipped(!isFlipped)} className="flex-grow flex justify-center items-center bg-slate-50 rounded-lg cursor-pointer p-6 border border-slate-200" style={{ perspective: '1000px' }}>
                    <div className={`relative w-full h-full transition-transform duration-500`} style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                        {/* Front of Card */}
                        <div className="absolute w-full h-full flex justify-center items-center" style={{ backfaceVisibility: 'hidden' }}>
                            <p className="text-2xl font-semibold text-slate-800">{card.front}</p>
                        </div>
                        {/* Back of Card */}
                        <div className="absolute w-full h-full flex justify-center items-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                            <p className="text-xl text-slate-700">{card.back}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex justify-between items-center mt-4">
                    <button onClick={handlePrev} className="py-2 px-6 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors">Prev</button>
                    <p className="text-sm font-medium text-slate-500">{currentIndex + 1} / {set.cards.length}</p>
                    <button onClick={handleNext} className="py-2 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">Next</button>
                </div>
            </div>
        </div>
    );
}

export default FlashcardViewer;

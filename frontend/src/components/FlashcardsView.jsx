import React, { useState, useEffect } from 'react';
import { API_URL, getAuthHeaders } from '../api';

// Assuming you have an icons.jsx file
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
);

function FlashcardsView({ activeDocument, token, onViewFlashcardSet, openConfirmationModal }) {
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
    const [selectedSets, setSelectedSets] = useState(new Set());

    const fetchFlashcardSets = async () => {
        if (!activeDocument) return;
        try {
            const response = await fetch(`${API_URL}/flashcards/document/${activeDocument.id}`, { headers: getAuthHeaders(token) });
            if (response.ok) {
                setFlashcardSets(await response.json());
            } else {
                setFlashcardSets([]);
            }
        } catch (error) {
            console.error("Error fetching flashcard sets:", error);
            setFlashcardSets([]);
        }
    };

    useEffect(() => {
        fetchFlashcardSets();
        setSelectedSets(new Set());
    }, [activeDocument, token]);

    // ✅ FIXED: Implemented the logic for this function
    const handleGenerateFlashcards = async () => {
        if (!activeDocument) return;
        setIsGeneratingFlashcards(true);
        try {
            const response = await fetch(`${API_URL}/flashcards/generate`, {
                method: 'POST',
                headers: getAuthHeaders(token),
                body: JSON.stringify({ document_id: activeDocument.id })
            });
            if (response.ok) {
                await fetchFlashcardSets(); // Refresh the list
            } else {
                alert("Failed to generate flashcards.");
            }
        } catch(error) {
            alert("An error occurred while generating flashcards.");
        } finally {
            setIsGeneratingFlashcards(false);
        }
    };

    // ✅ FIXED: Implemented the logic for this function
    const handleSelectionChange = (setId) => {
        setSelectedSets(prev => {
            const newSet = new Set(prev);
            if (newSet.has(setId)) {
                newSet.delete(setId);
            } else {
                newSet.add(setId);
            }
            return newSet;
        });
    };

    // ✅ FIXED: Implemented the logic for this function
    const handleDeleteSingle = (setId, e) => {
        e.stopPropagation();
        openConfirmationModal("Are you sure you want to delete this flashcard set?", async () => {
            await fetch(`${API_URL}/flashcards/set/${setId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(token),
            });
            fetchFlashcardSets();
        });
    };

    // ✅ FIXED: Implemented the logic for this function
    const handleDeleteSelected = () => {
        openConfirmationModal(`Are you sure you want to delete the ${selectedSets.size} selected sets?`, async () => {
            await fetch(`${API_URL}/flashcards/delete-multiple`, {
                method: 'POST',
                headers: getAuthHeaders(token),
                body: JSON.stringify({ item_ids: Array.from(selectedSets) }),
            });
            setSelectedSets(new Set());
            fetchFlashcardSets();
        });
    };

    // ✅ FIXED: Implemented the logic for this function
    const handleDeleteAll = () => {
        openConfirmationModal(`Are you sure you want to delete ALL flashcard sets for ${activeDocument.filename}?`, async () => {
            await fetch(`${API_URL}/flashcards/document/${activeDocument.id}/all`, {
                method: 'DELETE',
                headers: getAuthHeaders(token),
            });
            fetchFlashcardSets();
        });
    };

    return (
        <main className="w-2/3 flex flex-col p-4 h-full bg-slate-50">
            <div className="bg-white rounded-lg flex-grow flex flex-col shadow-sm border border-slate-200">
                <div className="p-4 border-b border-slate-200">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{activeDocument.filename}</h2>
                            <p className="text-sm text-slate-500">Flashcard Sets</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 items-end">
                             <button onClick={handleGenerateFlashcards} disabled={isGeneratingFlashcards} className="py-2 px-4 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50">
                                {isGeneratingFlashcards ? "Generating..." : "Generate New Set"}
                            </button>
                            {selectedSets.size > 0 && (
                                <button onClick={handleDeleteSelected} className="py-2 px-4 bg-yellow-400 text-yellow-900 rounded-lg font-semibold text-sm hover:bg-yellow-500 transition-colors">
                                    Delete Selected ({selectedSets.size})
                                </button>
                            )}
                            <button onClick={handleDeleteAll} disabled={flashcardSets.length === 0} className="py-2 px-4 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-50">
                                Delete All
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex-grow overflow-y-auto">
                    {flashcardSets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {flashcardSets.map(set => (
                                <div key={set.id} className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md">
                                    <div onClick={() => onViewFlashcardSet(set)} className="cursor-pointer p-4 mb-2">
                                        <p className="font-semibold text-slate-800">{set.title}</p>
                                        <p className="text-sm text-slate-500">{set.cards.length} cards</p>
                                        <p className="text-xs text-slate-400 mt-2">Created: {new Date(set.timestamp).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-200 pt-2 px-4 pb-3">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedSets.has(set.id)}
                                                onChange={() => handleSelectionChange(set.id)}
                                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-xs text-slate-600">Select</span>
                                        </label>
                                        <button onClick={(e) => handleDeleteSingle(set.id, e)} className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-100">
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-slate-500">No flashcard sets found.</p>
                            <p className="text-sm text-slate-400">Generate one to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default FlashcardsView;

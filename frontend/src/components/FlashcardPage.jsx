import React from 'react';

function FlashcardPage({
  activeDocument,
  flashcardSets,
  handleGenerateFlashcards,
  isGeneratingFlashcards,
  setActiveFlashcardSet
}) {
  const Placeholder = ({ text }) => (
    <div className="w-2/3 flex items-center justify-center h-full text-gray-500">
      <p className="text-2xl">{text}</p>
    </div>
  );

  return (
    <main className="w-2/3 flex flex-col p-4">
      {activeDocument ? (
        <div className="bg-gray-700 rounded-lg flex-grow flex flex-col">
          <div className="p-4 border-b border-gray-600">
            <h2 className="text-2xl font-semibold">{activeDocument.filename} - Flashcards</h2>
            <button
              onClick={handleGenerateFlashcards}
              disabled={isGeneratingFlashcards}
              className="mt-2 py-2 px-4 bg-blue-500 rounded-full text-white font-bold text-sm"
            >
              {isGeneratingFlashcards ? "Generating..." : "Generate New Set"}
            </button>
          </div>
          <div className="p-4 flex-grow overflow-y-auto">
            <h3 className="text-xl font-bold mb-2">My Flashcard Sets</h3>
            {flashcardSets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {flashcardSets.map(set => (
                  <div
                    key={set.id}
                    onClick={() => setActiveFlashcardSet(set)}
                    className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-600"
                  >
                    <p className="font-semibold">{set.title}</p>
                    <p className="text-sm text-gray-400">{set.cards.length} cards</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(set.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                No flashcard sets found. Generate one to get started!
              </p>
            )}
          </div>
        </div>
      ) : (
        <Placeholder text="Select a document to manage flashcards." />
      )}
    </main>
  );
}

export default FlashcardPage;

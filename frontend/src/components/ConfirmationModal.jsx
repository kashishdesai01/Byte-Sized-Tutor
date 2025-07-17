import React from 'react';

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.031-1.742 3.031H4.42c-1.532 0-2.492-1.697-1.742-3.031l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);


function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-60 flex justify-center items-center z-50 p-4 font-sans">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md text-center p-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                    <AlertIcon />
                </div>
                <h3 className="text-lg font-medium leading-6 text-slate-900 mt-4">Are you sure?</h3>
                <div className="mt-2">
                    <p className="text-sm text-slate-500">{message}</p>
                </div>
                <div className="mt-6 flex justify-center gap-4">
                    <button type="button" onClick={onClose} className="py-2 px-5 rounded-lg text-slate-700 bg-slate-200 hover:bg-slate-300 font-semibold transition-colors">
                        Cancel
                    </button>
                    <button type="button" onClick={onConfirm} className="py-2 px-5 rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold transition-colors">
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;

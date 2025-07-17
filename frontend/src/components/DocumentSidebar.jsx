import React from 'react';
import { TrashIcon } from './icons.jsx'; 

function DocumentSidebar({ 
    documents, 
    activeDocument, 
    onDocumentSelect, 
    onFileChange, 
    onUpload, 
    isUploading,
    selectedFile,
    uploadMessage, 
    onDeleteDocument, 
    onLogout 
}) {
    return (
        <aside className="w-1/3 max-w-sm bg-white pt-8 p-4 flex flex-col h-full border-r border-slate-200">
            <h2 className="text-xl font-bold mb-4 px-2 text-slate-800">My Documents</h2>
            
            <div className="mb-4 p-2 border-b border-slate-200 pb-4">
                <input id="file-input" type="file" onChange={onFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-slate-200 file:text-sm file:font-semibold file:bg-slate-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer transition-colors" />
                <button onClick={onUpload} disabled={isUploading || !selectedFile} className="w-full mt-2 py-2 px-4 bg-indigo-600 rounded-lg text-white font-semibold disabled:bg-slate-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors duration-200">
                    {isUploading ? 'Uploading...' : 'Upload New'}
                </button>
                {uploadMessage && <p className="text-xs text-center mt-2 text-indigo-600">{uploadMessage}</p>}
            </div>

            <div className="flex-grow overflow-y-auto space-y-1 pr-2">
                {documents.map(doc => (
                    <div 
                        key={doc.id} 
                        onClick={() => onDocumentSelect(doc)} 
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-150 ${activeDocument?.id === doc.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                        <p className="truncate flex-grow mr-2">{doc.filename}</p>
                        <button onClick={(e) => onDeleteDocument(doc.id, e)} className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-100 flex-shrink-0 transition-colors">
                            <TrashIcon/>
                        </button>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-slate-200">
                <button onClick={onLogout} className="w-full py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors duration-200">
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default DocumentSidebar;

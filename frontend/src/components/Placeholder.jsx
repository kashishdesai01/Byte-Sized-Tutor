import React from 'react';

const Placeholder = ({ text }) => (
    <main className="w-2/3 flex items-center justify-center h-full text-slate-400 p-4 bg-slate-100">
        <p className="text-xl text-center">{text}</p>
    </main>
);

export default Placeholder;

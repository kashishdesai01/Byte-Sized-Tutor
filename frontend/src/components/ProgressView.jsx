
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { API_URL, getAuthHeaders } from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex items-center">
        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
            {icon}
        </div>
        <div>
            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
            <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
    </div>
);

const QuizzesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const AvgIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const HighScoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;


function ProgressView({ activeDocument, token }) {
    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!activeDocument) return;
        const fetchProgressData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/documents/${activeDocument.id}/progress-report`, { headers: getAuthHeaders(token) });
                if (response.ok) setProgressData(await response.json());
                else setProgressData(null);
            } catch (error) {
                console.error("Failed to fetch progress report:", error);
                setProgressData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProgressData();
    }, [activeDocument, token]);

    if (loading) {
        return <div className="w-2/3 p-8 text-center text-slate-500">Loading progress report...</div>;
    }

    if (!progressData || progressData.total_quizzes_taken === 0) {
        return (
            <main className="w-2/3 flex flex-col p-4 h-full bg-slate-50">
                 <div className="bg-white rounded-lg flex-grow p-6 shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Progress Report: {activeDocument.filename}</h2>
                    <div className="text-center py-20">
                        <p className="text-slate-500">No quiz data available for this document.</p>
                        <p className="text-sm text-slate-400">Take a quiz to see your progress!</p>
                    </div>
                </div>
            </main>
        );
    }

    const chartData = {
        labels: progressData.scores_over_time.map((d, i) => `Attempt ${i + 1}`),
        datasets: [
            {
                label: 'Quiz Score %',
                data: progressData.scores_over_time.map(d => d.score),
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 1)',
                pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
                tension: 0.3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: true, max: 100, ticks: { color: '#64748b' } },
            x: { ticks: { color: '#64748b' } }
        }
    };

    return (
        <main className="w-2/3 flex flex-col p-4 h-full bg-slate-50">
            <div className="bg-white rounded-lg flex-grow flex flex-col p-6 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Progress Report: {activeDocument.filename}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Quizzes Taken" value={progressData.total_quizzes_taken} icon={<QuizzesIcon />} />
                    <StatCard title="Average Score" value={`${progressData.average_score.toFixed(1)}%`} icon={<AvgIcon />} />
                    <StatCard title="Highest Score" value={`${progressData.highest_score.toFixed(1)}%`} icon={<HighScoreIcon />} />
                </div>

                <div className="bg-white p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Score Trend</h3>
                    <Line options={chartOptions} data={chartData} />
                </div>
            </div>
        </main>
    );
}

export default ProgressView;

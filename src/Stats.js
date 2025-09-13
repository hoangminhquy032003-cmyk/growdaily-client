import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

function Stats({ journals, goals }) {
  const completedGoals = goals.filter(g => g.done).length;

  const data = {
    labels: ['Bài viết', 'Mục tiêu hoàn thành'],
    datasets: [
      {
        label: 'Thống kê GrowDaily',
        data: [journals.length, completedGoals],
        backgroundColor: ['#007bff', '#28a745'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };

  return (
    <div className="container mt-5">
      <h2>📊 Thống kê tiến trình</h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default Stats;
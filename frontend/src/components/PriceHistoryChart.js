import React from 'react';
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
  Filler,
} from 'chart.js';
import '../styles/components/PriceHistoryChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const PriceHistoryChart = ({ priceHistory, productName }) => {
  const data = {
    labels: priceHistory.map((entry) => formatDate(entry.timestamp)),
    datasets: [
      {
        label: 'Price',
        data: priceHistory.map((entry) => entry.price),
        fill: true,
        backgroundColor: 'rgba(255, 187, 0, 0.2)',
        borderColor: 'rgba(255, 187, 0, 1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(255, 187, 0, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 187, 0, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(28, 39, 76, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: (context) => `Price: $${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `$${value.toFixed(2)}`,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="price-history-chart">
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
      <div className="price-summary">
        <div className="summary-item">
          <span className="summary-label">Lowest Price:</span>
          <span className="summary-value">
            ${Math.min(...priceHistory.map((entry) => entry.price)).toFixed(2)}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Highest Price:</span>
          <span className="summary-value">
            ${Math.max(...priceHistory.map((entry) => entry.price)).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceHistoryChart;

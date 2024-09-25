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
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (value, index, values) {
            return '$' + value.toFixed(2);
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
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

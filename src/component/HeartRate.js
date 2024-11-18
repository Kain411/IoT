import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HeartRate = ({ heartRateData }) => {
    const data = {
        labels: heartRateData.map((_, index) => `${index + 1}`),
        datasets: [
            {
                label: 'Nhịp Tim (BPM)',
                data: heartRateData,
                fill: false,
                backgroundColor: 'red',
                borderColor: 'red',
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Thời gian (s)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Nhịp Tim (BPM)',
                },
                suggestedMin: 40,
                suggestedMax: 180,
            },
        },
    };

    return <Line data={data} options={options} width={300} height={150}/>;
};

export default HeartRate;

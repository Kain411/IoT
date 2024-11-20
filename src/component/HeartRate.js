import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HeartRate = ({ heartRateData }) => {
    const data = {
        // mấy cái gạch của trục hoành ấy (trong bào mình thì là lần đo: 1 2 3 4 ...)
        labels: heartRateData.map((_, index) => `${index + 1}`),
        datasets: [
            {
                // mấy cái gạch trục tung (100, 200 ...)
                label: 'Nhịp Tim (BPM)',
                // data để vẽ đồ thị
                data: heartRateData,
                fill: false,
                // màu mè các thứ
                backgroundColor: 'red',
                borderColor: 'red',
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            // tilte trục hoành
            x: {
                title: {
                    display: true,
                    text: 'Thời gian (s)',
                },
            },
            // title trục tung
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

    // Line là thư viện có sẵn để vẽ đồ thị dạng đường thẳng
    return <Line data={data} options={options} width={300} height={150}/>;
};

export default HeartRate;

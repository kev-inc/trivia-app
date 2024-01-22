import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const ResultsChart = () => {


    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                enabled: false
            },
            legend: {
                display: false
            },
        },
        scales: {
            x: {
                backgroundColor: '#fff',
                ticks: {
                    color: ['rgb(239 68 68)', 'rgb(59 130 246)', 'rgb(34 197 94)', 'rgb(234 179 8)'],
                    font: {
                        size: 32
                    }
                },
                grid: {
                    display: false,
                },
                
            },
            y: {
                display: false,
            },
        }
    };

    const data = {
        labels: ['▲', '◆', '●', '■'],
        datasets: [{
            data: [2, 6, 3, 1],
            backgroundColor: ['rgb(239 68 68)', 'rgb(59 130 246)', 'rgb(34 197 94)', 'rgb(234 179 8)']
        }]
    }

    return (
        <div className='h-full w-1/2 mx-auto'>
            <Bar options={options} data={data} />
        </div>
    )
}

export default ResultsChart
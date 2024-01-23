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
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(
    ChartDataLabels,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const ResultsChart = ({ labels, responses }) => {
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
            datalabels: {
                font: {
                    weight: 'bold',
                    size: 24,
                },
                color: 'white',
            }
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
                }
            },
            y: {
                display: false,
            },
        },
        layout: {
            padding: {
                top: 32
            }
        }
    };

    const data = {
        labels: labels,
        datasets: [{
            data: responses,
            backgroundColor: ['rgb(239 68 68)', 'rgb(59 130 246)', 'rgb(34 197 94)', 'rgb(234 179 8)'],
            datalabels: {
                align: 'end',
                anchor: 'end',
                
            }
        }]
    }

    return (
        <div className='h-full w-1/2 mx-auto'>
            <Bar options={options} data={data} />
        </div>
    )
}

export default ResultsChart
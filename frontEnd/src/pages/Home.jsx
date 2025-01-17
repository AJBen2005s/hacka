import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
    const [chartData, setChartData] = useState(null);

    // Fetch data for the pie chart
    useEffect(() => {
        axios.get('/form/room-stats') // Replace this with the correct API endpoint
            .then(response => {
                const { numOfRoomsDone, numOfRoomsNotDone } = response.data; // Destructure API response
                const total = numOfRoomsDone + numOfRoomsNotDone;
                const percentages = [
                    ((numOfRoomsDone / total) * 100).toFixed(2),
                    ((numOfRoomsNotDone / total) * 100).toFixed(2),
                ];
                setChartData({
                    labels: [
                        `Rooms Done (${percentages[0]}%)`,
                        `Rooms Not Done (${percentages[1]}%)`,
                    ], // Include percentages in labels
                    datasets: [
                        {
                            label: 'Room Completion',
                            data: [numOfRoomsDone, numOfRoomsNotDone], // Use fetched data
                            backgroundColor: ['#FF6384', '#36A2EB'],
                            hoverBackgroundColor: ['#FF6384', '#36A2EB'],
                        },
                    ],
                });
            })
            .catch(error => {
                console.error('Error fetching chart data:', error);
            });
    }, []);

    return (
        <div>
            {/* Inline styles applied to center the title */}
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Room Completion</h2>
            <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
                {chartData ? (
                    <Pie
                        data={chartData}
                        options={{
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: function (tooltipItem) {
                                            const value = tooltipItem.raw;
                                            const total = tooltipItem.dataset.data.reduce((a, b) => a + b, 0);
                                            const percentage = ((value / total) * 100).toFixed(2);
                                            return `${tooltipItem.label}: ${value} (${percentage}%)`;
                                        },
                                    },
                                },
                            },
                        }}
                    />
                ) : (
                    <p>Loading chart data...</p>
                )}
            </div>
        </div>
    );
};

export default Home;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
    const [chartData, setChartData] = useState(null);
    const [completedRooms, setCompletedRooms] = useState([]);
    const [nonCompletedRooms, setNonCompletedRooms] = useState([]);
    const [error, setError] = useState(null);

    // Fetch data for the pie chart and room data from API
    useEffect(() => {
        // Fetch room stats for pie chart
        axios.get('/form/room-stats') // Replace this with the correct API endpoint for room stats
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
                setError('Error fetching chart data');
            });

        // Fetch room data for completed and non-completed rooms
        axios.get('/form/rooms') // Replace this with the correct API endpoint for rooms
            .then(response => {
                const rooms = response.data; // Assuming the response returns an array of rooms

                // Split rooms into completed and non-completed
                const completed = rooms.filter(room => room.status === 'completed');
                const nonCompleted = rooms.filter(room => room.status !== 'completed');

                setCompletedRooms(completed);
                setNonCompletedRooms(nonCompleted);
            })
            .catch(error => {
                console.error('Error fetching room data:', error);
                setError('Error fetching room data');
            });
    }, []);

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    return (
        <div>
            {/* Pie Chart Section */}
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

            {/* Room List Section */}
            <div style={{ maxWidth: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', display: 'flex', justifyContent: 'center' }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: '10px', verticalAlign: 'top', textAlign: 'center' }}>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: '#f8f9fa',
                                    width: '100%',
                                    maxHeight: '300px',
                                    overflowY: 'auto'
                                }}>
                                    <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Completed Rooms</h4>
                                    {completedRooms.length > 0 ? (
                                        <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                                            {completedRooms.map((room) => (
                                                <li key={room.id}>{room.roomNumber}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No completed rooms.</p>
                                    )}
                                </div>
                            </td>
                            <td style={{ padding: '10px', verticalAlign: 'top', textAlign: 'center' }}>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: '#f8f9fa',
                                    width: '100%',
                                    maxHeight: '300px',
                                    overflowY: 'auto'
                                }}>
                                    <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Non-Completed Rooms</h4>
                                    {nonCompletedRooms.length > 0 ? (
                                        <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                                            {nonCompletedRooms.map((room) => (
                                                <li key={room.id}>{room.roomNumber}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No non-completed rooms.</p>
                                    )}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Home;

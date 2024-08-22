import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import axios from "axios";

// Register components
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

function TransactionsBarChart() {
	const [selectedMonth, setSelectedMonth] = useState("June");
	const [chartData, setChartData] = useState(null);

	useEffect(() => {
		const fetchBarChartData = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/barchart", // Corrected endpoint
					{ params: { month: selectedMonth } }
				);
				const categories = response.data.map((item) => item.range);
				const counts = response.data.map((item) => item.count);

				setChartData({
					labels: categories,
					datasets: [
						{
							label: "Number of Customers",
							data: counts,
							backgroundColor: "rgba(54, 162, 235, 0.6)",
						},
					],
				});
			} catch (error) {
				console.error("Error fetching bar chart data:", error);
			}
		};

		fetchBarChartData();
	}, [selectedMonth]);

	return (
		<>
			<div className="customer-service-report">
				<h2 className="text-2xl font-bold underline mb-4">Bar Chart Stats</h2>
				<label className="block mb-2">
					Select Month :
					<select
						value={selectedMonth}
						onChange={(e) => setSelectedMonth(e.target.value)}
						className="border rounded  m-5 px-2 py-1 border-gray-300">
						{[
							"January",
							"February",
							"March",
							"April",
							"May",
							"June",
							"July",
							"August",
							"September",
							"October",
							"November",
							"December",
						].map((month) => (
							<option key={month} value={month}>
								{month}
							</option>
						))}
					</select>
				</label>{" "}
				 
				{chartData ? (
					<div
						style={{
							width: "70%",
							height:
								window.innerWidth > 768
									? "300px"
									: window.innerWidth > 480
									? "200px"
									: "150px",
						}}>
						<Bar
							data={chartData}
							options={{
								width: 100,
								height: 100,
								title: {
									display: true,
									text: "Customer Distribution by Order Value Range",
								},
								scales: {
									y: {
										beginAtZero: true,
									},
									x: {
										ticks: {
											autoSkip: false, // Ensure all labels are shown even if long
											maxRotation: 45, // Rotate long labels for better readability
										},
									},
								},
								legend: {
									display: false, // Hide legend as there's only one dataset
								},
							}}
						/>
					</div>
				) : (
					<p>Loading chart...</p>
				)}
			</div>

			<div className="mt-4">
				<a
					href="/"
					className="bg-gray-500 hover:bg-gray-700 text-white font-bold  mt-5 py-2 px-4 rounded  ">
					Back to Home
				</a>
			</div>
		</>
	);
}

export default TransactionsBarChart;

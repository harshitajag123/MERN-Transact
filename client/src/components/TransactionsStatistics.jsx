import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function TransactionsStatistics() {
	const [selectedMonth, setSelectedMonth] = useState("June");
	const [statistics, setStatistics] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchStatistics = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/statistics",
					{
						params: {
							month: selectedMonth,
						},
					}
				);
				console.log("API Response:", response.data);
				setStatistics(response.data);
			} catch (error) {
				console.error("Error fetching statistics:", error);
				setError("Failed to fetch statistics. Please try again later.");
			}
		};

		fetchStatistics();
	}, [selectedMonth]);

	return (
		<>
			<h2 className="text-2xl font-bold underline mb-4">Statistics</h2>
			<div className="statistics-container flex flex-col items-center justify-center">
				<div className="statistics-header flex items-center justify-between mb-4">
					<h2 className="text-2xl font-bold">Statistics - {selectedMonth}</h2>
					<select
						value={selectedMonth}
						onChange={(e) => setSelectedMonth(e.target.value)}
						className="border rounded  m-3 px-2 py-1 border-gray-300">
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
				</div>

				{statistics ? (
					<div className="statistics-table bg-slate-200 rounded-lg p-4">
						<table>
							<tbody>
								<tr>
									<th className="text-left px-2 py-1">Total Sale</th>
									<td className="text-right px-2 py-1">
										{statistics.totalRevenue?.toFixed(2) || "N/A"}
									</td>
								</tr>
								<tr>
									<th className="text-left px-2 py-1">Total Sold Items</th>
									<td className="text-right px-2 py-1">
										{statistics.totalSoldItems || "N/A"}
									</td>
								</tr>
								<tr>
									<th className="text-left px-2 py-1">Total Not Sold Items</th>
									<td className="text-right px-2 py-1">
										{statistics.totalNotSoldItems || "N/A"}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				) : (
					<p>Loading statistics...</p>
				)}

				<div className="mt-4">
					<a
						href="/"
						className="bg-gray-500 hover:bg-gray-700 text-white font-bold  py-2 px-4 rounded  ">
						Back to Home
					</a>
				</div>
			</div>
		</>
	);
}

export default TransactionsStatistics;

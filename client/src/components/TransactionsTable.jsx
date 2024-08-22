import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function TransactionsTable() {
	const [selectedMonth, setSelectedMonth] = useState("March");
	const [transactions, setTransactions] = useState([]);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [perPage] = useState(10);

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/transactions",
					{
						params: {
							month: selectedMonth,
							page,
							perPage,
							search,
						},
					}
				);
				setTransactions(response.data.transactions);
				setTotal(response.data.total);
			} catch (error) {
				console.error("Error fetching transactions:", error);
			}
		};

		fetchTransactions();
	}, [selectedMonth, page, perPage, search]);

	const handleNextPage = () => {
		if (page * perPage < total) {
			setPage(page + 1);
		}
		console.log("Next Page Clicked");
	};

	const handlePreviousPage = () => {
		if (page > 1) {
			setPage(page - 1);
		}
		console.log("Previous Page Clicked");
	};

	return (
		<>
			<h2 className="text-2xl font-bold underline mb-4">Transaction table</h2>
			<div className="transaction-dashboard">
				{/* Search transaction and select month section */}
				<div className="search-select-container flex justify-between mb-4 p-5">
					<label className="text-gray-700 font-medium">
						Search transaction
					</label>
					<input
						type="text"
						placeholder="Search transactions..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="border rounded px-2 py-1 border-gray-300 w-2/3"
					/>
					<label className="text-gray-700 font-medium">Select Month</label>
					<select
						value={selectedMonth}
						onChange={(e) => setSelectedMonth(e.target.value)}
						className="border rounded px-2 py-1 border-gray-300">
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

				{/* Transactions table section */}
				<table className="transactions-table border border-gray-500 rounded-md w-full">
					<thead>
						<tr className="bg-gray-100 text-left font-medium text-gray-700">
							{/* <th className="px-4 py-2 border-b-2 border-gray-500">ID</th> */}
							<th className="px-4 py-2 border-b-2 border-gray-500">Title</th>
							<th className="px-4 py-2 border-b-2 border-gray-500">
								Description
							</th>
							<th className="px-4 py-2 border-b-2 border-gray-500">Price</th>
							<th className="px-4 py-2 border-b-2 border-gray-500">Category</th>
							<th className="px-4 py-2 border-b-2 border-gray-500">Sold</th>
						</tr>
					</thead>
					<tbody>
						{transactions.map((transaction) => (
							<tr key={transaction._id} className="hover:bg-gray-300">
								{/* <td className="px-4 py-2 border-b-2 border-gray-500">
									{transaction._id}
								</td> */}
								<td className="px-4 py-2 border-b-2 border-gray-500">
									{transaction.title}
								</td>
								<td className="px-4 py-2 border-b-2 border-gray-500">
									{transaction.description}
								</td>
								<td className="px-4 py-2 border-b-2 border-gray-500">
									{transaction.price}
								</td>
								<td className="px-4 py-2 border-b-2 border-gray-500">
									{transaction.category}
								</td>
								<td className="px-4 py-2 border-b-2 border-gray-500">
									{transaction.sold ? "Yes" : "No"}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{/* Pagination section */}
				<div className="pagination-container flex justify-between mt-4">
					<button
						onClick={handlePreviousPage}
						disabled={page === 1}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
						Previous
					</button>
					<div className="page-info">
						Page {page} of {Math.ceil(total / perPage)}
					</div>
					<button
						onClick={handleNextPage}
						disabled={page * perPage >= total}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
						Next
					</button>
				</div>

				{/* Back to Home button */}
				<div className="mt-4">
					<Link
						to="/"
						className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
						Back to Home
					</Link>
				</div>
			</div>
		</>
	);
}

export default TransactionsTable;

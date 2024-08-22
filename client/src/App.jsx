import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "./components/HomePage";
import TransactionsTable from "./components/TransactionsTable";
import TransactionsStatistics from "./components/TransactionsStatistics";
import TransactionsBarChart from "./components/TransactionsBarChart";
import React, { useState } from "react";

function App() {
	const [selectedMonth, setSelectedMonth] = useState("March");

	return (
		<>
			<Router>
				<div className="container mx-auto p-4">
					
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/table" element={<TransactionsTable />} />
						<Route path="/statistics" element={<TransactionsStatistics />} />
						<Route path="/barchart" element={<TransactionsBarChart />} />
					</Routes>
				</div>
			</Router>
		</>
	);
}

export default App;

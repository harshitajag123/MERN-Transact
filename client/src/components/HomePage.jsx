// import React from "react";
// import { Link } from "react-router-dom";

// function HomePage() {
// 	return (
// 		<>
// 			<div className="flex flex-col items-center">
// 				<h1 className="text-2xl font-bold mb-4 p-5 rounded-md bg-slate-500 w-2/3 text-center text-white">
// 					Transaction Dashboard
// 				</h1>
// 				<h2 className="text-xl font-bold mb-6 p-4">
// 					Welcome to the Transaction Dashboard!
// 				</h2>

// 				<Link
// 					to="/table"
// 					className="bg-slate-500 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded mb-4">
// 					Transaction Table
// 				</Link>
// 				<Link
// 					to="/statistics"
// 					className="bg-slate-500 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded mb-4">
// 					Transaction Statistics
// 				</Link>
// 				<Link
// 					to="/barchart"
// 					className="bg-slate-500 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded">
// 					Transaction Bar Chart
// 				</Link>
// 			</div>
// 		</>
// 	);
// }
// export default HomePage;

import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function HomePage() {
	const handleInitializeDatabase = async () => {
		try {
			const response = await axios.get("http://localhost:5000/api/init");
			alert("Database initialized successfully!");
		} catch (error) {
			console.error("Error initializing database:", error);
			alert("Failed to initialize database. Please try again.");
		}
	};

	return (
		<>
			<div className="flex flex-col items-center">
				<h1 className="text-2xl font-bold mb-4 p-5 rounded-md bg-slate-500 w-2/3 text-center text-white">
					Transaction Dashboard
				</h1>
				<h2 className="text-xl font-bold mb-6 p-4">
					Welcome to the Transaction Dashboard!
				</h2>
				<p className="mb-4 text-red-500 text-center">
					Please click the "Initialize Database" button before using the options
					below.
				</p>
				<button
					onClick={handleInitializeDatabase}
					className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
					Initialize Database
				</button>
				<Link
					to="/table"
					className="bg-slate-500 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded mb-4">
					Transaction Table
				</Link>
				<Link
					to="/statistics"
					className="bg-slate-500 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded mb-4">
					Transaction Statistics
				</Link>
				<Link
					to="/barchart"
					className="bg-slate-500 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded">
					Transaction Bar Chart
				</Link>
			</div>
		</>
	);
}

export default HomePage;

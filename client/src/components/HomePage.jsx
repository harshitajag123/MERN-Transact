import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
	return (
		<>
			<div className="flex flex-col items-center">
				<h1 className="text-2xl font-bold mb-4 p-5 rounded-md bg-slate-500 w-2/3 text-center text-white">
					Transaction Dashboard
				</h1>
				<h2 className="text-xl font-bold mb-6 p-4">
					Welcome to the Transaction Dashboard!
				</h2>

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

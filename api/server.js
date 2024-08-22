// Importing the required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

//connect to mongodb
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log(err));

// Define the Transaction Schema
const transactionSchema = new mongoose.Schema({
	title: String,
	description: String,
	price: Number,
	dateOfSale: Date,
	category: String,
	sold: Boolean,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

//test api
app.get("/test", async (req, res) => {
	res.status(200).json({ message: "API is working" });
});

// API to initialize the database with data from the third-party API
app.get("/api/init", async (req, res) => {
	try {
		const response = await axios.get(
			"https://s3.amazonaws.com/roxiler.com/product_transaction.json"
		);
		await Transaction.deleteMany({});
		await Transaction.insertMany(response.data);
		res.status(200).json({ message: "Database initialized successfully" });
	} catch (error) {
		res.status(500).json({
			message: "Failed to initialize database",
			error,
		});
	}
});

// API to get all the transactions with search and pagination
app.get("/api/transactions", async (req, res) => {
	const { search = "", page = 1, perPage = 10, month } = req.query;
	const regex = new RegExp(search, "i");

	try {
		const transactions = await Transaction.find({
			$or: [{ title: regex }, { description: regex }],
			$expr: {
				$eq: [{ $month: "$dateOfSale" }, new Date(`${month} 1`).getMonth() + 1], // Matches the month regardless of the year
			},
		})
			.skip((page - 1) * perPage)
			.limit(parseInt(perPage));

		const count = await Transaction.countDocuments({
			$or: [{ title: regex }, { description: regex }],
			$expr: {
				$eq: [{ $month: "$dateOfSale" }, new Date(`${month} 1`).getMonth() + 1],
			},
		});

		res.status(200).json({ transactions, total: count });
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch transactions",
			error,
		});
	}
});

// API to get statistics for the selected month regardless of year
app.get("/api/statistics", async (req, res) => {
	const { month } = req.query;

	if (
		!month ||
		!/^(January|February|March|April|May|June|July|August|September|October|November|December)$/i.test(
			month
		)
	) {
		return res.status(400).json({
			message: "Invalid month format. Use full month name (e.g., 'January').",
		});
	}

	try {
		const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1;

		const totalSoldItems = await Transaction.countDocuments({
			sold: true,
			$expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
		});

		const totalNotSoldItems = await Transaction.countDocuments({
			sold: false,
			$expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
		});

		const totalSaleAmount = await Transaction.aggregate([
			{
				$match: {
					sold: true,
					$expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
				},
			},
			{ $group: { _id: null, total: { $sum: "$price" } } },
		]);

		// Return the result as `totalRevenue` for consistency with the frontend
		res.status(200).json({
			totalRevenue: totalSaleAmount[0]?.total || 0,
			totalTransactions: totalSoldItems + totalNotSoldItems,
			totalSoldItems,
			totalNotSoldItems,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch statistics",
			error,
		});
	}
});

// API to get bar chart data without year
app.get("/api/barchart", async (req, res) => {
	const { month } = req.query;

	const monthMap = {
		January: 1,
		February: 2,
		March: 3,
		April: 4,
		May: 5,
		June: 6,
		July: 7,
		August: 8,
		September: 9,
		October: 10,
		November: 11,
		December: 12,
	};

	try {
		const selectedMonth = monthMap[month];

		if (!selectedMonth) {
			throw new Error("Invalid month format");
		}

		const priceRanges = [
			{ range: "0-100", min: 0, max: 100 },
			{ range: "101-200", min: 101, max: 200 },
			{ range: "201-300", min: 201, max: 300 },
			{ range: "301-400", min: 301, max: 400 },
			{ range: "401-500", min: 401, max: 500 },
			{ range: "501-600", min: 501, max: 600 },
			{ range: "601-700", min: 601, max: 700 },
			{ range: "701-800", min: 701, max: 800 },
			{ range: "801-900", min: 801, max: 900 },
			{ range: "901-above", min: 901, max: Infinity },
		];

		const barChartData = await Promise.all(
			priceRanges.map(async (range) => {
				const count = await Transaction.countDocuments({
					$expr: {
						$eq: [{ $month: "$dateOfSale" }, selectedMonth],
					},
					price: { $gte: range.min, $lte: range.max },
				});
				return { range: range.range, count };
			})
		);

		res.status(200).json(barChartData);
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch bar chart data",
			error: error.message || error,
		});
	}
});

// Helper function to convert month name to number
const getMonthNumber = (month) => {
	return new Date(`${month} 1, 2000`).getMonth() + 1;
};

// API to get pie chart data
app.get("/api/piechart", async (req, res) => {
	const { month } = req.query;

	try {
		// Convert month name to uppercase to ensure compatibility
		const monthUpperCase = month.toUpperCase();

		// Convert month name to number (e.g., "MARCH" -> 3)
		const monthNumber = getMonthNumber(monthUpperCase);

		if (isNaN(monthNumber)) {
			throw new Error("Invalid month format");
		}

		const pieChartData = await Transaction.aggregate([
			{
				$match: {
					$expr: {
						$eq: [{ $month: "$dateOfSale" }, monthNumber],
					},
				},
			},
			{
				$group: {
					_id: "$category",
					count: { $sum: 1 },
				},
			},
		]);

		res.status(200).json(pieChartData);
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch pie chart data",
			error: error.message || error,
		});
	}
});

// API to get combined data
app.get("/api/combined", async (req, res) => {
	const { month } = req.query;

	if (!month) {
		return res.status(400).json({ message: "Month parameter is required." });
	}

	try {
		// Format the month for different API calls
		const monthName =
			month.charAt(0).toUpperCase() + month.slice(1).toLowerCase(); // e.g., 'March', 'April'
		const monthUpperCase = monthName.toUpperCase(); // e.g., 'MARCH'

		// Make the necessary API calls using the correct URLs
		const statistics = await axios.get(
			`http://localhost:5000/api/statistics?month=${monthName}`
		);

		const barChart = await axios.get(
			`http://localhost:5000/api/barchart?month=${monthName}`
		);

		const pieChart = await axios.get(
			`http://localhost:5000/api/piechart?month=${monthUpperCase}`
		);

		// Combine the data from all APIs into one JSON response
		res.status(200).json({
			statistics: statistics.data,
			barChart: barChart.data,
			pieChart: pieChart.data,
		});
	} catch (error) {
		console.error("Error fetching combined data:", error.message);
		if (error.response) {
			console.error("Response data:", error.response.data);
			console.error("Status code:", error.response.status);
		} else if (error.request) {
			console.error("Request made but no response received");
		} else {
			console.error("Error setting up request:", error.message);
		}
		res.status(500).json({
			message: "Failed to fetch combined data",
			error: error.message || "Unknown error",
		});
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

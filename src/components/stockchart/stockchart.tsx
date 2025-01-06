import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockChart = ({stockData}:any) => {
//   // Format the data for chart.js
//   const [stockData, setStockData] = useState<stockData | undefined>(undefined);
//   const [error, setError] = useState(null); // To handle any errors

//   useEffect(() => {
//     const fetchStockData = async () => {
//       const url =
//         "https://yahoo-finance166.p.rapidapi.com/api/stock/get-chart?region=US&range=1d&symbol=AAPL&interval=5m";
//       const options = {
//         method: "GET",
//         headers: {
//           "x-rapidapi-key":
//             "b23d0a1421msh4b046b0fffcc343p1cab12jsnca4fb57c49d9",
//           "x-rapidapi-host": "yahoo-finance166.p.rapidapi.com",
//         },
//       };

//       try {
//         const response = await fetch(url, options);
//         const result = await response.json(); // Parse response as JSON
//         setStockData(result); // Set stock data to state
//       } catch (error: any) {
//         setError(error); // Handle errors
//         console.error("Error fetching stock data:", error);
//       }
//     };

//     fetchStockData(); // Call fetch function when component mounts
//   }, []);
  const chartData = {
    labels: stockData.timestamp.map((ts: number) =>
      new Date(ts * 1000).toLocaleTimeString()
    ), // Convert timestamp to readable time
    datasets: [
      {
        label: "Close Price",
        data: stockData.indicators.quote[0].close, // Close price data
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "High Price",
        data: stockData.indicators.quote[0].high, // High price data
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Low Price",
        data: stockData.indicators.quote[0].low, // Low price data
        borderColor: "rgba(255, 159, 64, 1)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Open Price",
        data: stockData.indicators.quote[0].open, // Open price data
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Apple Stock Price",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (USD)",
        },
      },
    },
  };

  return (
    <>
      {stockData ? (
        <div className="h-[300px] w-[400px]">
          <h2 className="text-[#e8e8e6aa]">{stockData.longName} Stock Chart</h2>
          <Line data={chartData} options={options}/>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default StockChart;

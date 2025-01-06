"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";
import Stock from "@/components/Stock/Stock";
import { Button, Input } from "@nextui-org/react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Page() {
  const [stockResult, setStockresult] = useState<stockResult | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stockData, setStockData] = useState<stockData | undefined>(undefined);
  const [ticker,setTicker]=useState("AAPL");
  const [toggle,setToggle]=useState(true)

  useEffect(() => {
    const url =
      `https://yahoo-finance166.p.rapidapi.com/api/stock/get-price?region=US&symbol=${ticker}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "b23d0a1421msh4b046b0fffcc343p1cab12jsnca4fb57c49d9",
        "x-rapidapi-host": "yahoo-finance166.p.rapidapi.com",
      },
    };
    const get_ds = async (result: any) => {
      const data = {
        companyName: result.longName,
        ticker: result.symbol,
        exchange: result.exchange,
        currentPrice: result.regularMarketPrice.raw,
        change: {
          amount: result.regularMarketChange.raw,
          percentage: result.regularMarketChangePercent.raw,
        },
        marketCap: result.marketCap.raw,
      };
      return data;
    };

    const fetchData = async () => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          setError("No Such Company Found")
          toast.error("No Such Company Found")
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setStockresult(await get_ds(result.quoteSummary.result[0].price));
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toggle]);

  useEffect(() => {
    const fetchStockData = async () => {
      const url =
        `https://yahoo-finance166.p.rapidapi.com/api/stock/get-chart?region=US&range=1d&symbol=${ticker}&interval=5m`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "b23d0a1421msh4b046b0fffcc343p1cab12jsnca4fb57c49d9",
          "x-rapidapi-host": "yahoo-finance166.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json(); // Parse response as JSON

        setStockData(result.chart.result[0]); // Set stock data to state
      } catch (error: any) {
        setError(error); // Handle errors
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData(); // Call fetch function when component mounts
  }, [toggle]);

  return (
    <div className={styles.main}>
      <div className="mt-11">
        <Stock stockResults={stockResult} stockData={stockData} />
      </div>
      <div className="mt-4 mb-4 flex items-center gap-2">
      <Input
        fullWidth
        label=""
        name="text"
        placeholder="Enter ticker of company"
        size="lg"
        onValueChange={(value)=>setTicker(value)}
      />
      <Button color="primary" onPress={()=>setToggle(!toggle)}>Enter</Button>
      </div>
    </div>
  );
}

export default Page;

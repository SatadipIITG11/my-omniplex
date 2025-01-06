"use client";

import React from "react";
import styles from "./Stock.module.css";
import { StockType } from "@/utils/types";
import { AreaChart } from "@tremor/react";
import { Skeleton } from "@nextui-org/skeleton";
import StockChart from "@/components/stockchart/stockchart";
type StockProps = {
  stockResults?: StockType;
};

const skeletonChartData = [
  {
    timestamp: "2024-05-17T00:00:00.000Z",
    price: 100,
  },
  {
    timestamp: "2024-05-16T00:00:00.000Z",
    price: 200,
  },
];

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}`;

const formatChartData = (
  data: {
    timestamp: string;
    price: number;
  }[]
) => {
  return data.map((point) => {
    const date = new Date(point.timestamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear()).slice(-2)}`;
    return {
      ...point,
      date: formattedDate,
    };
  });
};

const formatMarketCap = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)} T`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)} B`;
  } else {
    return `${value.toFixed(2)} M`;
  }
};

const Stock = ({stockResults,stockData}:any) => {
  const CustomTooltip = ({ payload, active }: any) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }
    const { date, price } = payload[0].payload;
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipDate}>{date}</p>
        <p className={styles.tooltipPrice}>${price.toFixed(2)}</p>
      </div>
    );
  };

  return (
    <>
      {stockResults ? (
        <div className={styles.stockContainer}>
          <div className={styles.stockHeader}>
            <div>
              <div className={styles.companyName}>
                {stockResults.companyName}
              </div>
              <div
                className={styles.subText}
              >{`${stockResults.exchange} : ${stockResults.ticker}`}</div>
              
            <div>
              <p className={styles.stockDetailsText}>
                Mkt cap: ${formatMarketCap(stockResults.marketCap)}
              </p>
            </div>
          

            </div>
            <div>
              <div className={styles.currentPrice}>
                ${stockResults.currentPrice}
              </div>
              <div
                className={styles.subText}
                style={{
                  color: stockResults.change.amount >= 0 ? "green" : "red",
                }}
              >
                {stockResults.change.amount >= 0 ? "+" : ""}
                {stockResults.change.amount} ({stockResults.change.percentage}%)
              </div>
            </div>
          </div>
          
          <div className={styles.chart}>
            {stockData?<StockChart stockData={stockData}/>:""}
          </div>
          
        </div>
      ) : (
        <div className={styles.stockContainer}>
          <div className={styles.stockHeader}>
            <div>
              <Skeleton className={styles.skeletonCompanyName} />
              <Skeleton className={styles.skeletonSubText} />
            </div>
            <div>
              <Skeleton className={styles.skeletonCurrentPrice} />
              <Skeleton className={styles.skeletonSubText2} />
            </div>
          </div>
          <div className={styles.chart}>
            <AreaChart
              className="h-80"
              data={formatChartData(skeletonChartData)}
              index="date"
              categories={["price"]}
              colors={["gray"]}
              valueFormatter={dataFormatter}
              showXAxis={false}
              showYAxis={false}
              autoMinValue={true}
              showAnimation={true}
              showLegend={false}
              showTooltip={false}
            />
            <div className={styles.chartOverlay} />
          </div>
          <div className={styles.stockDetails}>
            <div>
              <Skeleton className={styles.skeletonStockDetailsText} />
              <Skeleton className={styles.skeletonStockDetailsText} />
              <Skeleton className={styles.skeletonStockDetailsText} />
            </div>
            <div>
              <Skeleton className={styles.skeletonStockDetailsText} />
              <Skeleton className={styles.skeletonStockDetailsText} />
              <Skeleton className={styles.skeletonStockDetailsText} />
            </div>
            <div>
              <Skeleton className={styles.skeletonStockDetailsText} />
              <Skeleton className={styles.skeletonStockDetailsText} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stock;

import React, { useMemo } from "react";
import { useBinanceSocket } from "../hooks/useBinanceSocket";

const formatNumber = (num: number, decimals = 2) => num.toFixed(decimals);

export const OrderBook: React.FC = () => {
  const { orderBook } = useBinanceSocket("btcusdt");

  const bids = useMemo(() => {
    return Array.from(orderBook.bids.entries())
      .sort((a, b) => b[0] - a[0])
      .slice(0, 15);
  }, [orderBook.bids]);

  const asks = useMemo(() => {
    return Array.from(orderBook.asks.entries())
      .sort((a, b) => a[0] - b[0])
      .slice(0, 15);
  }, [orderBook.asks]);

  const highestBid = bids[0]?.[0] || 0;
  const lowestAsk = asks[0]?.[0] || 0;
  const spread = lowestAsk - highestBid;

  const maxBidTotal = bids.reduce((acc, [_, qty]) => acc + qty, 0);
  const maxAskTotal = asks.reduce((acc, [_, qty]) => acc + qty, 0);

  const renderRows = (
    data: [number, number][],
    type: "bid" | "ask",
    maxTotal: number
  ) => {
    let cumulative = 0;
    return data.map(([price, qty], i) => {
      cumulative += qty;
      const width = (cumulative / maxTotal) * 100;
      return (
        <div
          key={i}
          className={`flex justify-between text-sm relative ${
            type === "bid" ? "text-green-500" : "text-red-500"
          }`}
        >
          <div
            className={`absolute top-0 left-0 h-full opacity-10 ${
              type === "bid" ? "bg-green-500" : "bg-red-500"
            }`}
            style={{ width: `${width}%` }}
          ></div>
          <span>{formatNumber(price)}</span>
          <span>{formatNumber(qty, 4)}</span>
          <span>{formatNumber(cumulative, 4)}</span>
        </div>
      );
    });
  };

  return (
    <div className="grid grid-cols-2 gap-6 p-4 bg-gray-900 text-white rounded-2xl shadow-lg">
      {/* Bids */}
      <div>
        <h2 className="text-lg font-semibold text-green-400 mb-2">Bids</h2>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Price</span>
          <span>Amount</span>
          <span>Total</span>
        </div>
        <div className="space-y-1">{renderRows(bids, "bid", maxBidTotal)}</div>
      </div>

      {/* Asks */}
      <div>
        <h2 className="text-lg font-semibold text-red-400 mb-2">Asks</h2>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Price</span>
          <span>Amount</span>
          <span>Total</span>
        </div>
        <div className="space-y-1">{renderRows(asks, "ask", maxAskTotal)}</div>
      </div>

      {/* Spread */}
      <div className="col-span-2 text-center text-yellow-400 mt-2 font-medium">
        Spread: {spread > 0 ? spread.toFixed(2) : "—"}
      </div>
    </div>
  );
};

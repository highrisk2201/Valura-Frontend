import React, { useEffect, useState } from "react";
import { useBinanceSocket } from "../hooks/useBinanceSocket";

interface Trade {
  price: number;
  quantity: number;
  isBuyerMaker: boolean;
  time: number;
}

export const RecentTrades: React.FC = () => {
  const { trades } = useBinanceSocket("btcusdt");
  const [highlighted, setHighlighted] = useState<number | null>(null);

  useEffect(() => {
    if (trades.length > 0) {
      setHighlighted(trades[0].time);
      const timeout = setTimeout(() => setHighlighted(null), 400);
      return () => clearTimeout(timeout);
    }
  }, [trades]);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold text-yellow-400 mb-2">
        Recent Trades
      </h2>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Price</span>
        <span>Qty</span>
        <span>Time</span>
      </div>
      <div className="space-y-1 max-h-[500px] overflow-y-auto">
        {trades.map((trade) => (
          <div
            key={trade.time}
            className={`flex justify-between text-sm ${
              trade.isBuyerMaker ? "text-red-400" : "text-green-400"
            } ${highlighted === trade.time ? "bg-gray-700" : ""}`}
          >
            <span>{trade.price.toFixed(2)}</span>
            <span>{trade.quantity.toFixed(4)}</span>
            <span>
              {new Date(trade.time).toLocaleTimeString("en-US", {
                hour12: false,
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

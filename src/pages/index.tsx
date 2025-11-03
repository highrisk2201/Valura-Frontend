import React from "react";
import { OrderBook } from "../components/OrderBook";
import { RecentTrades } from "../components/RecentTrades";

const Home: React.FC = () => {
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-center text-yellow-400 mb-6">
        Binance BTC/USDT Live Order Book
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <OrderBook />
        <RecentTrades />
      </div>

      <footer className="text-center text-gray-500 mt-6 text-sm">
        Built with ❤️ using Next.js + Binance API
      </footer>
    </main>
  );
};

export default Home;

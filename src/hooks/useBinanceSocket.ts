import { useEffect, useRef, useState } from "react";

interface Trade {
  price: number;
  quantity: number;
  isBuyerMaker: boolean;
  time: number;
}

interface OrderBookUpdate {
  bids: [string, string][];
  asks: [string, string][];
}

export const useBinanceSocket = (symbol: string = "btcusdt") => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orderBook, setOrderBook] = useState<{ bids: Map<number, number>; asks: Map<number, number> }>({
    bids: new Map(),
    asks: new Map(),
  });

  const tradeSocketRef = useRef<WebSocket | null>(null);
  const bookSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const tradeSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@aggTrade`);
    const bookSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@depth`);

    tradeSocketRef.current = tradeSocket;
    bookSocketRef.current = bookSocket;

    tradeSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newTrade: Trade = {
        price: parseFloat(data.p),
        quantity: parseFloat(data.q),
        isBuyerMaker: data.m,
        time: data.T,
      };

      setTrades((prev) => [newTrade, ...prev.slice(0, 49)]);
    };

    bookSocket.onmessage = (event) => {
      const data: OrderBookUpdate = JSON.parse(event.data);

      setOrderBook((prev) => {
        const bids = new Map(prev.bids);
        const asks = new Map(prev.asks);

        data.bids.forEach(([price, qty]) => {
          const p = parseFloat(price);
          const q = parseFloat(qty);
          if (q === 0) bids.delete(p);
          else bids.set(p, q);
        });

        data.asks.forEach(([price, qty]) => {
          const p = parseFloat(price);
          const q = parseFloat(qty);
          if (q === 0) asks.delete(p);
          else asks.set(p, q);
        });

        return { bids, asks };
      });
    };

    return () => {
      tradeSocket.close();
      bookSocket.close();
    };
  }, [symbol]);

  return { trades, orderBook };
};

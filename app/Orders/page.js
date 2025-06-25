"use client";

import Header from "../Header/page";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./page.css";

function Portfolio() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const walletAddress = address;

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/users?walletAddress=${walletAddress}`);
      const data = await res.json();
      if (data.exists) {
        setOrders(data.orders || []);
      } else {
        alert("No record found");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchOrders();
    }
  }, [walletAddress]);

  // Helper function to format timestamp
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  // Convert Wei to ETH
  const weiToEth = (wei) => {
    const eth = parseFloat(wei) / 10 ** 18;
    return eth.toFixed(6); // Display up to 6 decimal places
  };

  // Convert quantity from milligrams to grams if > 1000
  const formatQuantity = (mg) => {
    const quantity = parseFloat(mg);
    if (quantity > 1000) {
      return {
        value: (quantity / 1000).toFixed(4),
        unit: "g",
      };
    }
    return {
      value: quantity.toFixed(4),
      unit: "mg",
    };
  };

  return (
    <>
      <Header />
      <div className="portfolio-container p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Orders</h1>
      </div>
      <div className="bg-gray-100 min-h-screen">
        <div className="w-9/10 m-auto">
          {orders.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Time</th>
                  <th className="p-2 border">Average Price (ETH)</th>
                  <th className="p-2 border">Quantity</th>
                  <th className="p-2 border">Total Value (ETH)</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...orders].reverse().map((order, index) => {
                  const { date, time } = formatDateTime(order.createdAt);
                  const { value: quantityValue, unit: quantityUnit } =
                    formatQuantity(order.quantity);
                  return (
                    <tr key={order.hash || index} className="hover:bg-gray-50">
                      <td className="p-2 border">
                        <span
                          className={
                            order.type.toLowerCase() === "buy"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {order.type}
                        </span>
                      </td>
                      <td className="p-2 border">{date}</td>
                      <td className="p-2 border">{time}</td>
                      <td className="p-2 border">
                        {weiToEth(order.avgPrice) * 1000} ETH/gm
                      </td>
                      <td className="p-2 border">
                        {quantityValue} {quantityUnit}
                      </td>
                      <td className="p-2 border">
                        {weiToEth(order.totalValue)} ETH
                      </td>
                      <td className="p-2 border">Completed</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="h5 text-center py-8">No orders found.</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Portfolio;

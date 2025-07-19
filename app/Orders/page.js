"use client";

import Header from "../Header/page";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./page.css";
import Footer from "../Footer/page";
import { useTheme } from "../context/ThemeContext";

function Portfolio() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const walletAddress = address;

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/users?walletAddress=${walletAddress}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
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
    if (quantity >= 1000) {
      return {
        value: (quantity / 1000).toFixed(3),
        unit: "g",
      };
    }
    return {
      value: quantity.toFixed(0),
      unit: "mg",
    };
  };
  console.log(orders);
  const [ascending, setAscending] = useState(false);
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <Header />
      <div
        className={`${theme === "light" ? "bg-gray-50 text-gray-700" : "bg-gray-800 text-gray-300"} min-h-[calc(100vh-64px)]`}
      >
        <div className="portfolio-container p-8 w-full md:w-92/100 m-auto">
          <h1 className="text-[38px] font-[550] mb-4">Orders</h1>
          <div className="horizontalRule"></div>
        </div>
        <div
          className={`${theme === "light" ? "bg-gray-50 text-gray-700" : "bg-gray-800 text-gray-300"} w-full md:w-92/100 m-auto`}
        >
          <div
            className={`w-92/100 m-auto text-right ${theme === "light" ? "bg-gray-50 text-gray-700" : "bg-gray-800 text-gray-300"}`}
          >
            Sort by:&nbsp;
            <select
              value={ascending ? "oldest" : "latest"}
              onChange={(e) => setAscending(e.target.value === "oldest")}
              className="border px-2 py-1 rounded"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
        <div
          className={`${theme === "light" ? "bg-gray-50 text-gray-700" : "bg-gray-800 text-gray-300"} w-92/100 m-auto mt-2`}
        >
          <div className="w-full overflow-y-auto md:w-92/100 m-auto">
            {orders.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr
                    className={`${theme === "light" ? "bg-gray-50 text-gray-700" : "bg-gray-700 text-gray-300"}`}
                  >
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Time</th>
                    <th className="p-2 border">Average Price (ETH)</th>
                    <th className="p-2 border">Quantity</th>
                    <th className="p-2 border">Total Value (ETH)</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">View on Etherscan</th>
                  </tr>
                </thead>
                <tbody>
                  {(ascending ? [...orders] : [...orders].reverse()).map(
                    (order, index) => {
                      const { date, time } = formatDateTime(order.createdAt);
                      const { value: quantityValue, unit: quantityUnit } =
                        formatQuantity(order.quantity);
                      return (
                        <tr
                          key={index}
                          className={`${theme === "light" ? "hover:bg-gray-50" : "hover:bg-gray-700"}`}
                        >
                          <td className="p-2 border text-center">
                            <span
                              className={`
                              ${
                                order.type.toLowerCase() === "buy"
                                  ? "text-green-600"
                                  : null
                              } 
                              ${
                                order.type.toLowerCase() === "sell"
                                  ? "text-red-600"
                                  : null
                              } 
                              ${
                                order.type.toLowerCase() === "gift-from"
                                  ? "text-red-600"
                                  : null
                              } 
                              ${
                                order.type.toLowerCase() === "gift received"
                                  ? "text-green-600"
                                  : null
                              } 
                            `}
                            >
                              {order.type.toLowerCase() === "buy"
                                ? "Buy"
                                : null}
                              {order.type.toLowerCase() === "sell"
                                ? "Sell"
                                : null}
                              {order.type.toLowerCase() === "gift-from" ||
                              order.type.toLowerCase() === "gift received"
                                ? "Gift"
                                : null}
                            </span>
                          </td>
                          <td className="p-2 border text-center">{date}</td>
                          <td className="p-2 border text-center">{time}</td>
                          <td className="p-2 border text-right">
                            {(weiToEth(order.avgPrice) * 1000).toFixed(4)}{" "}
                            ETH/gm
                          </td>
                          <td className="p-2 border text-right">
                            {quantityValue} {quantityUnit}
                          </td>
                          <td className="p-2 border text-right">
                            {weiToEth(order.totalValue)} ETH
                          </td>
                          <td className="p-2 border text-center">
                            <span className="rounded-lg py-1 px-2 bg-green-600 text-white text-sm">
                              Completed
                            </span>
                          </td>
                          <td className="p-2 border text-center">
                            <div className="flex justify-center items-center hover:cursor-pointer">
                              <div>
                                <span className="no-underline hover:no-underline rounded text-sm">
                                  <a
                                    className="no-underline hover:no-underline"
                                    target="_blank"
                                    href={`https://sepolia.etherscan.io/tx/${order.hash}`}
                                  >
                                    View on Etherscan
                                  </a>
                                  &nbsp;
                                </span>
                              </div>
                              <div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24px"
                                  viewBox="0 -960 960 960"
                                  width="24px"
                                  fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                                >
                                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
                                </svg>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            ) : (
              <div className="h5 text-center py-8">No orders found.</div>
            )}
          </div>
        </div>
      </div>
      <div className={`${theme === "light" ? "bg-gray-50 text-gray-50" : "bg-gray-800 text-gray-800"}`}>Hello</div>
      <Footer></Footer>
    </>
  );
}

export default Portfolio;

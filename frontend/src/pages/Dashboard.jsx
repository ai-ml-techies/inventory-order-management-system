import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_products: 0,
    total_customers: 0,
    total_orders: 0,
    low_stock_products: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard/");
      setStats(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Products",
      value: stats.total_products,
    },
    {
      title: "Customers",
      value: stats.total_customers,
    },
    {
      title: "Orders",
      value: stats.total_orders,
    },
    {
      title: "Low Stock",
      value: stats.low_stock_products,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-slate-500">
            Inventory & Order Management
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-lg shadow">
          Admin
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-lg transition"
          >
            <p className="text-slate-500 mb-2">
              {card.title}
            </p>

            <p className="text-4xl font-bold text-slate-900">
              {loading ? "..." : card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
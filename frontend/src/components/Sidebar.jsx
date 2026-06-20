import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Customers", path: "/customers" },
    { name: "Orders", path: "/orders" },
  ];

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white fixed">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold text-blue-400">
          InventoryPro
        </h1>

        <p className="text-slate-400 text-sm mt-2">
          Admin Dashboard
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-3 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
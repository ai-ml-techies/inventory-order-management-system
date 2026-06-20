import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [formData, setFormData] = useState({
    customer_id: "",
    product_id: "",
    quantity: 1,
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/");
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/customers/");
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createOrder = async () => {
    setError("");
    setSuccess("");

    if (
      !formData.customer_id ||
      !formData.product_id ||
      !formData.quantity
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      await api.post("/orders/", {
        customer_id: Number(formData.customer_id),
        items: [
          {
            product_id: Number(formData.product_id),
            quantity: Number(formData.quantity),
          },
        ],
      });

      setSuccess("Order created successfully.");

      setFormData({
        customer_id: "",
        product_id: "",
        quantity: 1,
      });

      fetchOrders();
      fetchProducts();
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Unable to create order."
      );
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) {
      return;
    }

    try {
      await api.delete(`/orders/${id}`);

      setSuccess("Order deleted successfully.");

      fetchOrders();
      fetchProducts();
    } catch (error) {
      setError("Unable to delete order.");
    }
  };

  const viewOrderDetails = async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);

      setSelectedOrder(response.data);

      setShowDetails(true);
    } catch (error) {
      console.error(error);
      setError("Unable to load order details.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Orders
        </h1>

        <p className="text-slate-500">
          Create and manage orders
        </p>
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Create Order */}
      <div className="bg-white p-6 rounded-2xl shadow border mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Create Order
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <select
            className="border p-3 rounded-lg"
            value={formData.customer_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                customer_id: e.target.value,
              })
            }
          >
            <option value="">
              Select Customer
            </option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.full_name}
              </option>
            ))}
          </select>

          <select
            className="border p-3 rounded-lg"
            value={formData.product_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                product_id: e.target.value,
              })
            }
          >
            <option value="">
              Select Product
            </option>

            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            className="border p-3 rounded-lg"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity: e.target.value,
              })
            }
          />
        </div>

        <button
          onClick={createOrder}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Create Order
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">
                Order ID
              </th>

              <th className="text-left p-4">
                Customer
              </th>

              <th className="text-left p-4">
                Total Amount
              </th>

              <th className="text-left p-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t"
              >
                <td className="p-4">
                  #{order.id}
                </td>

                <td className="p-4">
                  {order.customer}
                </td>

                <td className="p-4">
                  ₹{order.total_amount}
                </td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() =>
                      viewOrderDetails(order.id)
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      deleteOrder(order.id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[650px] max-w-[95%]">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Order Details
              </h2>

              <button
                onClick={() =>
                  setShowDetails(false)
                }
                className="text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <p>
                <strong>Customer:</strong>{" "}
                {selectedOrder.customer}
              </p>

              <p>
                <strong>Total Amount:</strong>{" "}
                ₹{selectedOrder.total_amount}
              </p>
            </div>

            <h3 className="font-semibold mb-3">
              Ordered Products
            </h3>

            <table className="w-full border">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left p-3">
                    Product
                  </th>

                  <th className="text-left p-3">
                    Quantity
                  </th>

                  <th className="text-left p-3">
                    Unit Price
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedOrder.items?.map(
                  (item, index) => (
                    <tr
                      key={index}
                      className="border-t"
                    >
                      <td className="p-3">
                        {item.product}
                      </td>

                      <td className="p-3">
                        {item.quantity}
                      </td>

                      <td className="p-3">
                        ₹{item.unit_price}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
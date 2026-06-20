import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Products() {
const [products, setProducts] = useState([]);
const [showForm, setShowForm] = useState(false);
const [editingId, setEditingId] = useState(null);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [selectedProduct, setSelectedProduct] = useState(null);

const [formData, setFormData] = useState({
name: "",
sku: "",
price: "",
stock_quantity: "",
});

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

useEffect(() => {
fetchProducts();
}, []);


const fetchProducts = async () => {
  try {
    setLoading(true);

    const response = await api.get("/products/");

    setProducts(response.data);
  } catch (err) {
    setError("Failed to load products");
  } finally {
    setLoading(false);
  }
};

const resetForm = () => {
setFormData({
name: "",
sku: "",
price: "",
stock_quantity: "",
});


setEditingId(null);
setShowForm(false);


};

const handleSubmit = async () => {
  setError("");
  setSuccess("");

  if (!formData.name.trim()) {
    setError("Product name is required");
    return;
  }

  if (!formData.sku.trim()) {
    setError("SKU is required");
    return;
  }

  if (Number(formData.price) <= 0) {
    setError("Price must be greater than 0");
    return;
  }

  if (Number(formData.stock_quantity) < 0) {
    setError("Stock quantity cannot be negative");
    return;
  }

  try {
    const payload = {
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      price: Number(formData.price),
      stock_quantity: Number(formData.stock_quantity),
    };

    if (editingId) {
      await api.put(`/products/${editingId}`, payload);
      setSuccess("Product updated successfully");
    } else {
      await api.post("/products/", payload);
      setSuccess("Product created successfully");
    }

    fetchProducts();
    resetForm();
  } catch (err) {
    const detail = err?.response?.data?.detail;

    if (Array.isArray(detail)) {
      setError(detail[0]?.msg || "Validation error");
    } else if (typeof detail === "string") {
      setError(detail);
    } else {
      setError("Something went wrong");
    }
  }
};

const editProduct = (product) => {
setEditingId(product.id);


setFormData({
  name: product.name,
  sku: product.sku,
  price: product.price,
  stock_quantity: product.stock_quantity,
});

setShowForm(true);


};

const deleteProduct = async (id) => {
const confirmDelete = window.confirm(
"Are you sure you want to delete this product?"
);


if (!confirmDelete) return;

try {
  await api.delete(`/products/${id}`);

  fetchProducts();

  setSuccess("Product deleted successfully.");
} catch (err) {
  setError("Unable to delete product.");
}


};

return ( <div>
{/* Header */} <div className="flex justify-between items-center mb-8"> <div> <h1 className="text-3xl font-bold">
Products </h1>

      <p className="text-slate-500">
        Manage inventory products
      </p>
    </div>

    <button
      onClick={() => {
        setShowForm(!showForm);
        setEditingId(null);
      }}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
    >
      {showForm ? "Close" : "+ Add Product"}
    </button>
  </div>

  {/* Alerts */}
  {success && (
    <div className="bg-green-100 text-green-700 border border-green-300 p-3 rounded-lg mb-4">
      {success}
    </div>
  )}

  {error && (
    <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded-lg mb-4">
      {error}
    </div>
  )}

  {/* Form */}
  {showForm && (
    <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingId
          ? "Update Product"
          : "Create Product"}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Product Name"
          className="border rounded-lg p-3"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="SKU"
          className="border rounded-lg p-3"
          value={formData.sku}
          onChange={(e) =>
            setFormData({
              ...formData,
              sku: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Price"
          className="border rounded-lg p-3"
          value={formData.price}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Stock Quantity"
          className="border rounded-lg p-3"
          value={formData.stock_quantity}
          onChange={(e) =>
            setFormData({
              ...formData,
              stock_quantity: e.target.value,
            })
          }
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          {editingId
            ? "Update Product"
            : "Create Product"}
        </button>

        <button
          onClick={resetForm}
          className="bg-slate-200 px-5 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  )}

  {/* Table */}
  <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
    <table className="w-full">
      <thead className="bg-slate-100">
        <tr>
          <th className="text-left p-4">Name</th>
          <th className="text-left p-4">SKU</th>
          <th className="text-left p-4">Price</th>
          <th className="text-left p-4">Stock</th>
          <th className="text-left p-4">Actions</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <tr
            key={product.id}
            className="border-t"
          >
            <td className="p-4">
              {product.name}
            </td>

            <td className="p-4">
              {product.sku}
            </td>

            <td className="p-4">
              ₹{product.price}
            </td>

            <td className="p-4">
              {product.stock_quantity}
            </td>

            <td className="p-4 flex gap-2">
              <button
                onClick={() =>
                  editProduct(product)
                }
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteProduct(product.id)
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
</div>

);
}

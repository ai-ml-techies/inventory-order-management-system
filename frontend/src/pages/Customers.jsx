import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Customers() {
const [customers, setCustomers] = useState([]);
const [showForm, setShowForm] = useState(false);

const [formData, setFormData] = useState({
full_name: "",
email: "",
phone: "",
});

const [success, setSuccess] = useState("");
const [error, setError] = useState("");

useEffect(() => {
fetchCustomers();
}, []);

const fetchCustomers = async () => {
try {
const response = await api.get("/customers/");
setCustomers(response.data);
} catch (err) {
console.error(err);
}
};

const resetForm = () => {
setFormData({
full_name: "",
email: "",
phone: "",
});

setShowForm(false);


};

const handleSubmit = async () => {
setSuccess("");
setError("");


if (
  !formData.full_name ||
  !formData.email ||
  !formData.phone
) {
  setError("All fields are required.");
  return;
}

try {
  await api.post("/customers/", formData);

  setSuccess("Customer created successfully.");

  fetchCustomers();

  resetForm();
} catch (err) {
  setError(
    err?.response?.data?.detail ||
      "Unable to create customer."
  );
}


};

const deleteCustomer = async (id) => {
const confirmDelete = window.confirm(
"Delete this customer?"
);


if (!confirmDelete) return;

try {
  await api.delete(`/customers/${id}`);

  setSuccess("Customer deleted successfully.");

  fetchCustomers();
} catch (err) {
  setError("Unable to delete customer.");
}


};

return ( <div>
{/* Header */} <div className="flex justify-between items-center mb-8"> <div> <h1 className="text-3xl font-bold">
Customers </h1>


      <p className="text-slate-500">
        Manage customers
      </p>
    </div>

    <button
      onClick={() => setShowForm(!showForm)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
    >
      {showForm ? "Close" : "+ Add Customer"}
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
        Create Customer
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="border rounded-lg p-3"
          value={formData.full_name}
          onChange={(e) =>
            setFormData({
              ...formData,
              full_name: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="border rounded-lg p-3"
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Phone"
          className="border rounded-lg p-3"
          value={formData.phone}
          onChange={(e) =>
            setFormData({
              ...formData,
              phone: e.target.value,
            })
          }
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Save Customer
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

  {/* Customer Table */}
  <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
    <table className="w-full">
      <thead className="bg-slate-100">
        <tr>
          <th className="text-left p-4">
            Name
          </th>

          <th className="text-left p-4">
            Email
          </th>

          <th className="text-left p-4">
            Phone
          </th>

          <th className="text-left p-4">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {customers.map((customer) => (
          <tr
            key={customer.id}
            className="border-t"
          >
            <td className="p-4">
              {customer.full_name}
            </td>

            <td className="p-4">
              {customer.email}
            </td>

            <td className="p-4">
              {customer.phone}
            </td>

            <td className="p-4">
              <button
                onClick={() =>
                  deleteCustomer(customer.id)
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

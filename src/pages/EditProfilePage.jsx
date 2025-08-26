import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedInUser } from "../utils/security";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const loggedInUser = getLoggedInUser();
  const token = localStorage.getItem("token");
  const userId = loggedInUser?.id;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [message, setMessage] = useState("");

  // Fetch user details on mount
  useEffect(() => {
    if (!userId || !token) return;

    const fetchUserDetails = async () => {
      try {
        const res = await fetch(
          `https://papaiaapi.onrender.com/api/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch user details");

        const data = await res.json();
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUserDetails();
  }, [userId, token]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://papaiaapi.onrender.com/api/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser = await res.json();

      // Update localStorage so ProfilePage shows new data
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("Profile updated successfully!");

      // Redirect after short delay
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error("Update error:", err);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

      {message && (
        <p className="mb-4 text-center text-green-600 font-medium">{message}</p>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-white text-orange-500 px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

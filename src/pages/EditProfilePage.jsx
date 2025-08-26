import { useState, useEffect } from "react";
import {
  User,
  AtSign,
  Mail,
  Phone,
  Calendar,
  Lock,
  Power,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLoggedInUser } from "../utils/security";
import HeaderMain from "../components/Header/HeaderMain";
import Footer from "../components/Footer/FooterMain";
import defaultUserPic from "../assets/default-user.png";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null); // "deactivate" | "delete" | null
  const [confirmationInput, setConfirmationInput] = useState("");

  const loggedInUser = getLoggedInUser();
  const token = localStorage.getItem("token");

  // Fetch latest user details
  useEffect(() => {
    if (!loggedInUser?._id) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `https://papaiaapi.onrender.com/api/user/${loggedInUser._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            username: data.username || "",
            email: data.email || "",
            phone: data.phone || data.contactNumber || "",
            birthDate: data.dateOfBirth || data.birthDate || "",
            profilePicture: data.profilePicture || null,
          });
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [loggedInUser, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!token || !loggedInUser?._id) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://papaiaapi.onrender.com/api/user/${loggedInUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        console.error("Failed to update profile");
        return;
      }

      const updatedUser = await res.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      navigate("/profile"); // back to profile page
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = () => {
    if (
      popup === "deactivate" &&
      confirmationInput.toLowerCase() === "deactivate"
    ) {
      console.log("Account deactivated"); // replace with real API call
      setPopup(null);
    }
    if (popup === "delete" && confirmationInput.toLowerCase() === "delete") {
      console.log("Account deleted"); // replace with real API call
      setPopup(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderMain />

      <main className="flex-1 mt-16 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Edit Profile
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={
                  formData.profilePicture
                    ? `https://papaiaapi.onrender.com${formData.profilePicture}`
                    : defaultUserPic
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                onError={(e) => (e.currentTarget.src = defaultUserPic)}
              />
              <p className="text-gray-500 mt-2 text-sm">
                Profile picture cannot be changed here.
              </p>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "firstName",
                  label: "First Name",
                  icon: <User className="w-4 h-4" />,
                },
                {
                  name: "lastName",
                  label: "Last Name",
                  icon: <User className="w-4 h-4" />,
                },
                {
                  name: "username",
                  label: "Username",
                  icon: <AtSign className="w-4 h-4" />,
                },
                {
                  name: "email",
                  label: "Email",
                  icon: <Mail className="w-4 h-4" />,
                },
                {
                  name: "phone",
                  label: "Contact Number",
                  icon: <Phone className="w-4 h-4" />,
                },
                {
                  name: "birthDate",
                  label: "Birth Date",
                  icon: <Calendar className="w-4 h-4" />,
                  type: "date",
                },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    {field.icon} {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="w-full md:w-auto bg-gradient-to-r from-[#FF8C42] to-[#F97316] hover:from-[#F97316] hover:to-[#FF8C42] text-white px-6 py-2 rounded-lg font-medium shadow-md transition-all"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button className="w-full md:w-auto bg-[#F97316] hover:bg-[#FF8C42] text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-md">
                <Lock className="w-4 h-4" /> Change Password
              </button>

              <button
                onClick={() => setPopup("deactivate")}
                className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-md"
              >
                <Power className="w-4 h-4" /> Deactivate Account
              </button>

              <button
                onClick={() => setPopup("delete")}
                className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-md"
              >
                <Trash2 className="w-4 h-4" /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Popup Modal */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setPopup(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {popup === "deactivate" ? "Deactivate Account" : "Delete Account"}
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              To confirm, please type{" "}
              <span className="font-semibold">
                {popup === "deactivate" ? "deactivate" : "delete"}
              </span>{" "}
              below.
            </p>

            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder={`Type "${popup}" here`}
              className="w-full px-3 py-2 border rounded-lg mb-4"
            />

            <button
              onClick={handleConfirmAction}
              disabled={confirmationInput.toLowerCase() !== popup.toLowerCase()}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium shadow-md"
            >
              Confirm {popup === "deactivate" ? "Deactivation" : "Deletion"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

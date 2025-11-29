import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState("Alex Greyson");
  const [email, setEmail] = useState("alex.greyson@example.com");
  const [contact, setContact] = useState("+1 (555) 123-4567");
  const [company, setCompany] = useState("Greyson Logistics Inc.");
  const [job, setJob] = useState("Business Owner");

  const [plan, setPlan] = useState("starter");
  const [image, setImage] = useState(null);

  // Load saved image on mount
  useEffect(() => {
    const saved = localStorage.getItem("profileImage");
    if (saved) setImage(saved);
  }, []);

  // Convert image to Base64 and save globally
  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setImage(base64);

      // Save so navbar also updates
      localStorage.setItem("profileImage", base64);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full min-h-screen bg-[#0b1623] text-white flex flex-col">
      {/* NAVBAR */}
      <Navbar isLoggedIn={true} />

      {/* MAIN CONTENT */}
      <div className="flex justify-center w-full pt-24 pb-10 px-6">
        <div className="w-full max-w-5xl space-y-8">

          {/* PAGE HEADER */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-wide">Profile</h1>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-[#5fb9f2] text-[#07101c] rounded-lg hover:bg-[#4aacdf] transition"
              >
                Edit Details
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-[#5fb9f2] text-[#07101c] rounded-lg hover:bg-[#4aacdf] transition"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* PHOTO CARD */}
          <div className="bg-[#122030] p-6 rounded-xl border border-white/10 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
              {image ? (
                <img src={image} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm">No Image</span>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold">Profile Image</h2>
              <p className="text-gray-400 text-sm">Upload a professional picture.</p>
            </div>

            {isEditing && (
              <>
                <button
                  onClick={() => {
                    setImage(null);
                    localStorage.removeItem("profileImage");
                  }}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                  Delete
                </button>

                <label className="px-4 py-2 bg-[#5fb9f2] text-[#07101c] rounded-lg hover:bg-[#4aacdf] cursor-pointer transition">
                  Upload
                  <input type="file" className="hidden" onChange={uploadImage} />
                </label>
              </>
            )}
          </div>

          {/* DETAILS CARD */}
          <div className="bg-[#122030] p-6 rounded-xl border border-white/10 grid grid-cols-2 gap-6">

            <div>
              <label className="text-gray-400 text-sm">Full Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full mt-1 p-2 rounded-lg bg-[#0f1b29] border ${
                  isEditing ? "border-[#5fb9f2]" : "border-white/10 text-gray-400"
                }`}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm">Job Title</label>
              <input
                type="text"
                disabled={!isEditing}
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className={`w-full mt-1 p-2 rounded-lg bg-[#0f1b29] border ${
                  isEditing ? "border-[#5fb9f2]" : "border-white/10 text-gray-400"
                }`}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm">Email</label>
              <input
                type="text"
                disabled={!isEditing}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full mt-1 p-2 rounded-lg bg-[#0f1b29] border ${
                  isEditing ? "border-[#5fb9f2]" : "border-white/10 text-gray-400"
                }`}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm">Contact</label>
              <input
                type="text"
                disabled={!isEditing}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={`w-full mt-1 p-2 rounded-lg bg-[#0f1b29] border ${
                  isEditing ? "border-[#5fb9f2]" : "border-white/10 text-gray-400"
                }`}
              />
            </div>

            <div className="col-span-2">
              <label className="text-gray-400 text-sm">Company</label>
              <input
                type="text"
                disabled={!isEditing}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={`w-full mt-1 p-2 rounded-lg bg-[#0f1b29] border ${
                  isEditing ? "border-[#5fb9f2]" : "border-white/10 text-gray-400"
                }`}
              />
            </div>
          </div>

          {/* PLAN SECTION */}
          <div className="bg-[#122030] p-6 rounded-xl border border-white/10 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Subscription Plan</h2>
              <p className="text-gray-400 text-sm">
                {plan === "starter"
                  ? "Starter: You can list up to 5 shipments."
                  : "Enterprise: Unlimited shipments + advanced analytics."}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                disabled={!isEditing}
                className={`px-4 py-2 rounded-lg border ${
                  plan === "starter"
                    ? "bg-[#5fb9f2] text-black"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => setPlan("starter")}
              >
                Starter
              </button>

              <button
                disabled={!isEditing}
                className={`px-4 py-2 rounded-lg border ${
                  plan === "enterprise"
                    ? "bg-[#5fb9f2] text-black"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => setPlan("enterprise")}
              >
                Enterprise
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;

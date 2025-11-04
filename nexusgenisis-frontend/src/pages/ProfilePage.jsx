import { useState, useEffect } from "react";
import { Calendar, Bookmark } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "John@nexusgenisis.ai",
    joined: "August 2025",
    savedTopics: [
      "AI in Healthcare",
      "Sustainable Fashion",
      "Quantum Computing Trends",
      "FinTech Market Analysis",
    ],
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email });

  useEffect(() => {
    // In future: Fetch user info from backend (/api/user/me)
    // setUser(await fetchUserData());
  }, []);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...user, ...form });
    setEditing(false);
  };

  const handleLogout = () => {
    alert("You have been logged out!"); // Replace with real logout logic
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-50 to-white">
      <div className="py-10 px-4 flex justify-center">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-extrabold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              User Profile
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your personal information and saved interests
            </p>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-8 transform transition-all hover:shadow-2xl">
            {/* Profile Info */}
            {!editing ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="relative">
                    <img
                      src="https://i.pinimg.com/736x/8e/3f/8c/8e3f8c4c0aa6ecc10c674973e1d9f7dd.jpg"
                      alt="Profile Avatar"
                      className="w-24 h-24 rounded-full shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full border-4 border-white flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h2 className="text-3xl font-bold text-gray-800">
                      {user.name}
                    </h2>
                    <p className="text-gray-600 mt-1">{user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-linear-to-r from-indigo-50 to-purple-50 rounded-full">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-gray-600">
                        Member since {user.joined}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Saved Topics */}
                <div className="mt-8 bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-indigo-600" />
                    Saved Topics
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {user.savedTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-white text-indigo-700 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all border border-indigo-200"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={handleEdit}
                    className="px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-8 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-md border border-gray-300 font-semibold"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              /* Edit Form */
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Edit Your Profile</h2>
                  <p className="text-gray-500 text-sm mt-1">Update your information below</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="flex justify-center gap-4 mt-8 pt-4">
                  <button
                    onClick={handleSave}
                    className="px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-8 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-md border border-gray-300 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
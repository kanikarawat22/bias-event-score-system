import { useState } from "react";
import axios from "axios";
function RegisterPage() {
  const [formData, setFormData] = useState({
    societyName: "",
    societyEmail: "",
    password: "",
    confirmPassword: "",
    secretaryName: "",
    secretaryNumber: "",
    societyLogo: null,
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  if (
    !formData.societyName ||
    !formData.societyEmail ||
    !formData.password ||
    !formData.confirmPassword ||
    !formData.secretaryName ||
    !formData.secretaryNumber ||
    !formData.societyLogo
  ) {
    alert("Please fill all fields");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const data = new FormData();

    data.append("societyName", formData.societyName);
    data.append("societyEmail", formData.societyEmail);
    data.append("password", formData.password);
    data.append("secretaryName", formData.secretaryName);
    data.append("secretaryNumber", formData.secretaryNumber);
    data.append("societyLogo", formData.societyLogo);

    const response = await axios.post(
      "http://localhost:5000/api/societies/register",
      data
    );

    alert(response.data.message);

    setFormData({
      societyName: "",
      societyEmail: "",
      password: "",
      confirmPassword: "",
      secretaryName: "",
      secretaryNumber: "",
      societyLogo: null,
    });

  } catch (error) {
    alert(
      error.response?.data?.message || "Registration failed"
    );
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 flex items-center justify-center px-6 py-10">
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-full max-w-2xl border border-white/20">
        
        <h1 className="text-white text-3xl font-bold text-center mb-8">
          Society Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="societyName"
            placeholder="Society Name"
            value={formData.societyName}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-blue-200 outline-none"
          />

          <input
            type="email"
            name="societyEmail"
            placeholder="Society Email"
            value={formData.societyEmail}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-blue-200 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-blue-200 outline-none"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-blue-200 outline-none"
          />

          <input
            type="text"
            name="secretaryName"
            placeholder="Society Secretary Name"
            value={formData.secretaryName}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-blue-200 outline-none"
          />

          <input
            type="tel"
            name="secretaryNumber"
            placeholder="Secretary Contact Number"
            value={formData.secretaryNumber}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-blue-200 outline-none"
          />

          <div>
            <label className="text-blue-100 block mb-2">
              Upload Society Logo
            </label>

            <input
              type="file"
              name="societyLogo"
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/20 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold hover:scale-105 transition"
          >
            Register Society
          </button>

        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
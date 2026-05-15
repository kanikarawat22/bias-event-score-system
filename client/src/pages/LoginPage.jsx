import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [loginData, setLoginData] = useState({
    societyEmail: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  if (!loginData.societyEmail || !loginData.password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await axios.post(
      "https://bias-backend-h3so.onrender.com/api/societies/login",
      loginData
    );

    localStorage.setItem(
  "society",
  JSON.stringify(response.data.society)
);

alert(response.data.message);

navigate("/dashboard");

  } catch (error) {
    alert(
      error.response?.data?.message || "Login failed"
    );
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 flex items-center justify-center px-6">
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-full max-w-lg border border-white/20">
        
        <h1 className="text-white text-3xl font-bold text-center mb-8">
          Society Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <input
            type="email"
            name="societyEmail"
            placeholder="Society Email"
            value={loginData.societyEmail}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-blue-200 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-blue-200 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-white text-blue-900 py-4 rounded-xl font-semibold hover:scale-105 transition"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default LoginPage;
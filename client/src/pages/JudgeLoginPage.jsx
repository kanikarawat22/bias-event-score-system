import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function JudgeLoginPage() {
  const [judgePin, setJudgePin] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!judgePin) {
      alert("Please enter Judge PIN");
      return;
    }

    try {
      const response = await axios.post(
        "https://bias-backend-h3so.onrender.com/api/societies/judge-login",
        {
          judgePin,
        }
      );

      localStorage.setItem(
        "judge",
        JSON.stringify(response.data.judge)
      );

      alert(response.data.message);

      navigate("/judge-dashboard");

    } catch (error) {
      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 via-blue-800 to-cyan-700 flex items-center justify-center px-6">
      
      <div className="bg-gradient-to-br from-blue-900/40 via-blue-700/20 to-cyan-500/20 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-lg border border-blue-200/20">
        
        <h1 className="text-white text-4xl font-bold text-center mb-8">
          Judge Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            placeholder="Enter Judge PIN"
            value={judgePin}
            onChange={(e) => setJudgePin(e.target.value)}
            className="w-full p-4 rounded-2xl bg-blue-200/10 text-white placeholder-blue-100 outline-none border border-blue-300/20"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 text-white py-4 rounded-2xl font-semibold hover:scale-105 transition"
          >
            Login as Judge
          </button>

        </form>

      </div>
    </div>
  );
}

export default JudgeLoginPage;
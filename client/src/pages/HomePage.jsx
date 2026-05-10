import logo from "../assets/bias-logo.png";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 flex flex-col items-center justify-center px-6">
      
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-10 flex flex-col items-center max-w-xl w-full border border-white/20">
        
        <img
          src={logo}
          alt="BIAS Logo"
          className="w-32 h-32 object-contain mb-6"
        />

        <h1 className="text-white text-4xl font-bold text-center mb-4">
          BIAS Event Score Management System
        </h1>

        <p className="text-blue-100 text-center text-lg mb-8">
          Paperless scoring platform for college events, competitions, and society management.
        </p>

        <div className="flex gap-4">
          <Link to="/login">
  <button className="bg-white text-blue-900 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
    Society Login
  </button>
</Link>

          <Link to="/register">
    <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
      Register Society
    </button>
  </Link>

  <Link to="/judge-login">
  <button className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
    Judge Login
  </button>
</Link>

        </div>

      </div>
    </div>
  );
}

export default HomePage;
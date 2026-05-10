import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function JudgeDashboardPage() {
  const judge = JSON.parse(localStorage.getItem("judge"));

  const [dashboardData, setDashboardData] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState("");
  const [marks, setMarks] = useState({});
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("judge");
  navigate("/");
};

  useEffect(() => {
    fetchJudgeDashboard();
  }, []);

  const fetchJudgeDashboard = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/societies/judge-dashboard/${judge.id}`
      );

      setDashboardData(response.data);

    } catch (error) {
      console.log(error);
      alert("Failed to load judge dashboard");
    }
  };

  const handleMarksChange = (criterionName, value) => {
    setMarks({
      ...marks,
      [criterionName]: value,
    });
  };

  const totalMarks = Object.values(marks).reduce(
    (sum, mark) => sum + Number(mark || 0),
    0
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedEntry) {
      alert("Please select an entry");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/societies/submit-score",
        {
          judgeId: judge.id,
          entryId: selectedEntry,
          marks,
          totalMarks,
        }
      );

      alert("Score submitted successfully");

      setSelectedEntry("");
      setMarks({});

    } catch (error) {
      console.log(error);
      alert("Failed to submit score");
    }
  };

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-950 text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 via-blue-800 to-cyan-700 px-6 py-10">
      
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/40 via-blue-700/20 to-cyan-500/20 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-blue-200/20">
        
        <div className="flex justify-between items-center mb-6">
  <h1 className="text-white text-4xl font-bold">
    Welcome, {dashboardData.judgeName}
  </h1>

  <button
    onClick={handleLogout}
    className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 rounded-2xl text-white font-semibold hover:scale-105 transition"
  >
    Logout
  </button>
</div>

        <h2 className="text-blue-100 text-2xl mb-8">
          Event: {dashboardData.event.eventName}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <select
            value={selectedEntry}
            onChange={(e) => setSelectedEntry(e.target.value)}
            className="w-full p-4 rounded-2xl bg-blue-200/10 text-white"
          >
            <option value="">Select Entry</option>

            {dashboardData.event.entries.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.entryName}
              </option>
            ))}
          </select>

          {dashboardData.event.criteria.map((criterion) => (
            <div key={criterion.id}>
              <label className="block text-white mb-2 text-lg">
                {criterion.name} (/ {criterion.maxMarks})
              </label>

              <input
                type="number"
                min="0"
                max={criterion.maxMarks}
                value={marks[criterion.name] || ""}
                onChange={(e) =>
                  handleMarksChange(
                    criterion.name,
                    e.target.value
                  )
                }
                className="w-full p-4 rounded-2xl bg-blue-200/10 text-white"
              />
            </div>
          ))}

          <div className="text-white text-3xl font-bold">
            Total: {totalMarks}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 py-4 rounded-2xl text-white font-semibold hover:scale-105 transition"
          >
            Submit Score
          </button>

        </form>
      </div>
    </div>
  );
}

export default JudgeDashboardPage;
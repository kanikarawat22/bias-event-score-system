import { useState, useEffect } from "react";
import axios from "axios";

function LeaderboardPage() {
  const society = JSON.parse(localStorage.getItem("society"));
  const [leaderboards, setLeaderboards] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(
        `https://bias-event-score-system.onrender.com/api/societies/leaderboard/${society.id}`
      );

      setLeaderboards(response.data);

    } catch (error) {
      console.log(error);
      alert("Failed to load leaderboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 via-blue-800 to-cyan-700 px-6 py-10">
      
      <div className="max-w-6xl mx-auto">

        <h1 className="text-white text-4xl font-bold mb-10">
          Society Leaderboards 🏆
        </h1>

        {leaderboards.length === 0 ? (
          <div className="text-white text-xl">
            No judged events yet.
          </div>
        ) : (
          <div className="space-y-8">
            {leaderboards.map((event, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-900/40 via-blue-700/20 to-cyan-500/20 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-blue-200/20"
              >
                <h2 className="text-white text-3xl font-bold mb-6">
                  {event.eventName}
                </h2>

                <div className="space-y-4">
                  {event.rankings.map((entry, rankIndex) => (
                    <div
                      key={rankIndex}
                      className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 flex justify-between items-center text-white"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold">
                          {rankIndex === 0
                            ? "🥇"
                            : rankIndex === 1
                            ? "🥈"
                            : rankIndex === 2
                            ? "🥉"
                            : `#${rankIndex + 1}`}
                        </span>

                        <span className="text-xl font-semibold">
                          {entry.entryName}
                        </span>
                      </div>

                      <span className="text-2xl font-bold text-cyan-200">
                        {entry.total}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default LeaderboardPage;
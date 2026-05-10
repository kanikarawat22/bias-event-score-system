import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function DashboardPage() {
  const society = JSON.parse(localStorage.getItem("society"));
  const [events, setEvents] = useState([]);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const [selectedTheme, setSelectedTheme] = useState(
    localStorage.getItem("dashboardTheme") || "midnight"
  );

  const themes = {
    midnight: {
      pageBg: "bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700",
      cardBg:
        "bg-gradient-to-br from-blue-800/30 via-sky-700/20 to-cyan-500/20 border-blue-200/10",
    },

    purple: {
      pageBg: "bg-gradient-to-br from-purple-950 via-fuchsia-900 to-violet-600",
      cardBg:
        "bg-gradient-to-br from-purple-800/30 via-fuchsia-700/20 to-violet-500/20 border-purple-200/10",
    },

    cyan: {
      pageBg: "bg-gradient-to-br from-cyan-950 via-sky-900 to-cyan-500",
      cardBg:
        "bg-gradient-to-br from-cyan-800/30 via-sky-700/20 to-cyan-400/20 border-cyan-200/10",
    },

    green: {
      pageBg: "bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-500",
      cardBg:
        "bg-gradient-to-br from-emerald-800/30 via-green-700/20 to-emerald-400/20 border-emerald-200/10",
    },

    orange: {
      pageBg: "bg-gradient-to-br from-orange-950 via-amber-800 to-orange-500",
      cardBg:
        "bg-gradient-to-br from-orange-800/30 via-amber-700/20 to-orange-400/20 border-orange-200/10",
    },

    pink: {
      pageBg: "bg-gradient-to-br from-pink-950 via-fuchsia-800 to-rose-500",
      cardBg:
        "bg-gradient-to-br from-pink-800/30 via-fuchsia-700/20 to-rose-400/20 border-pink-200/10",
    },
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("society");
    navigate("/");
  };

  const handleThemeChange = (themeName) => {
    setSelectedTheme(themeName);
    localStorage.setItem("dashboardTheme", themeName);
    setShowThemeModal(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/societies/events/${society.id}`
      );

      setEvents(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/societies/delete-event/${eventId}`
      );

      alert("Event deleted successfully");
      fetchEvents();

    } catch (error) {
      console.log(error);
      alert("Failed to delete event");
    }
  };

  return (
    <div
      className={`min-h-screen ${themes[selectedTheme].pageBg} p-8`}
    >
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-5">
          <img
            src={`http://localhost:5000/${society.societyLogo.replace(/\\/g, "/")}`}
            alt="Society Logo"
            className="w-20 h-20 rounded-full object-cover border-4 border-cyan-300 shadow-xl"
          />

          <h1 className="text-white text-4xl font-bold">
            Welcome, {society?.societyName}
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 rounded-2xl text-white font-semibold hover:scale-105 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

        <Link to="/create-event">
          <div
            className={`${themes[selectedTheme].cardBg} backdrop-blur-lg rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition cursor-pointer border`}
          >
            <h2 className="text-2xl font-semibold mb-3">
              Create Event
            </h2>
            <p>Create new college events and competitions.</p>
          </div>
        </Link>

        <Link to="/manage-judges">
          <div
            className={`${themes[selectedTheme].cardBg} backdrop-blur-lg rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition cursor-pointer border`}
          >
            <h2 className="text-2xl font-semibold mb-3">
              Manage Judges
            </h2>
            <p>Add judges and assign scoring access.</p>
          </div>
        </Link>

        <Link to="/manage-entries">
          <div
            className={`${themes[selectedTheme].cardBg} backdrop-blur-lg rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition cursor-pointer border`}
          >
            <h2 className="text-2xl font-semibold mb-3">
              Participants
            </h2>
            <p>Add teams and participants.</p>
          </div>
        </Link>

        <Link to="/leaderboard">
          <div
            className={`${themes[selectedTheme].cardBg} backdrop-blur-lg rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition cursor-pointer border`}
          >
            <h2 className="text-2xl font-semibold mb-3">
              Leaderboard
            </h2>
            <p>View live event rankings.</p>
          </div>
        </Link>

        <Link to="/certificate">
          <div
            className={`${themes[selectedTheme].cardBg} backdrop-blur-lg rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition cursor-pointer border`}
          >
            <h2 className="text-2xl font-semibold mb-3">
              Certificate Generation
            </h2>
            <p>Generate participant certificates instantly.</p>
          </div>
        </Link>

        <div
          onClick={() => setShowThemeModal(true)}
          className={`${themes[selectedTheme].cardBg} backdrop-blur-lg rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition cursor-pointer border`}
        >
          <h2 className="text-2xl font-semibold mb-3">
            Theme Customization 🎨
          </h2>
          <p>Personalize your dashboard appearance.</p>
        </div>

      </div>

      <div>
        <h2 className="text-white text-3xl font-bold mb-6">
          My Event History
        </h2>

        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white shadow-xl"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-semibold">
                      {event.eventName}
                    </h3>

                    <p className="text-blue-200 mt-2">
                      {event.eventDescription}
                    </p>

                    <p className="mt-2">
                      Venue: {event.venue}
                    </p>

                    <p>
                      Judges: {event.numberOfJudges}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 items-end">
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-xl">
                      {event.status}
                    </span>

                    <Link to={`/edit-event/${event.id}`}>
                      <button className="bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 rounded-xl hover:scale-105 transition">
                        Edit
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 rounded-xl hover:scale-105 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-blue-200">
              No events created yet.
            </p>
          )}
        </div>
      </div>

      {showThemeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[500px] shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-6">
              Choose Dashboard Theme 🎨
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <button
                onClick={() => handleThemeChange("midnight")}
                className="bg-gradient-to-r from-blue-900 to-cyan-600 text-white py-4 rounded-2xl font-semibold"
              >
                🌌 Midnight Blue
              </button>

              <button
                onClick={() => handleThemeChange("purple")}
                className="bg-gradient-to-r from-purple-900 to-violet-500 text-white py-4 rounded-2xl font-semibold"
              >
                💜 Royal Purple
              </button>

              <button
                onClick={() => handleThemeChange("cyan")}
                className="bg-gradient-to-r from-cyan-900 to-sky-500 text-white py-4 rounded-2xl font-semibold"
              >
                🩵 Ocean Cyan
              </button>

              <button
                onClick={() => handleThemeChange("green")}
                className="bg-gradient-to-r from-emerald-900 to-green-500 text-white py-4 rounded-2xl font-semibold"
              >
                🌿 Emerald Green
              </button>

              <button
                onClick={() => handleThemeChange("orange")}
                className="bg-gradient-to-r from-orange-900 to-amber-500 text-white py-4 rounded-2xl font-semibold"
              >
                🌅 Sunset Orange
              </button>

              <button
                onClick={() => handleThemeChange("pink")}
                className="bg-gradient-to-r from-pink-900 to-rose-500 text-white py-4 rounded-2xl font-semibold"
              >
                💖 Blush Pink
              </button>
            </div>

            <button
              onClick={() => setShowThemeModal(false)}
              className="mt-6 w-full bg-gray-200 py-3 rounded-2xl font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default DashboardPage;
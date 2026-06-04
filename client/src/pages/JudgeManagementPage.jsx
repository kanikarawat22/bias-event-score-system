import { useState, useEffect } from "react";
import axios from "axios";

function JudgeManagementPage() {
  const society = JSON.parse(localStorage.getItem("society"));

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [judges, setJudges] = useState([]);
  const [judgeData, setJudgeData] = useState({
    judgeName: "",
    judgePin: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `https://bias-event-score-system.onrender.com/api/societies/events/${society.id}`
      );

      setEvents(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchJudges = async (eventId) => {
    try {
      const response = await axios.get(
        `https://bias-event-score-system.onrender.com/api/societies/judges/${eventId}`
      );

      setJudges(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteJudge = async (judgeId) => {
  try {
    await axios.delete(
      `https://bias-event-score-system.onrender.com/api/societies/delete-judge/${judgeId}`
    );

    alert("Judge deleted successfully");

    fetchJudges(selectedEvent);

  } catch (error) {
    console.log(error);
    alert("Failed to delete judge");
  }
};

  const handleEventChange = (event) => {
    const eventId = event.target.value;

    setSelectedEvent(eventId);

    if (eventId) {
      fetchJudges(eventId);
    }
  };

  const handleInputChange = (event) => {
    setJudgeData({
      ...judgeData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !judgeData.judgeName ||
      !judgeData.judgePin ||
      !selectedEvent
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(
        "https://bias-event-score-system.onrender.com/api/societies/add-judge",
        {
          ...judgeData,
          eventId: selectedEvent,
        }
      );

      alert("Judge added successfully");

      setJudgeData({
        judgeName: "",
        judgePin: "",
      });

      fetchJudges(selectedEvent);

    } catch (error) {
      console.log(error);
      alert("Failed to add judge");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 via-blue-800 to-cyan-700 px-6 py-10">
      
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-white text-4xl font-bold mb-8">
          Judge Management
        </h1>

        <div className="bg-gradient-to-br from-blue-900/40 via-blue-700/20 to-cyan-500/20 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-blue-200/20 mb-10">

          <select
            value={selectedEvent}
            onChange={handleEventChange}
            className="w-full p-4 rounded-2xl bg-blue-200/10 text-white outline-none border border-blue-300/20 mb-6"
          >
            <option value="">Select Event</option>

            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.eventName}
              </option>
            ))}
          </select>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="judgeName"
              placeholder="Judge Name"
              value={judgeData.judgeName}
              onChange={handleInputChange}
              className="w-full p-4 rounded-2xl bg-blue-200/10 text-white placeholder-blue-100 outline-none border border-blue-300/20"
            />

            <input
              type="text"
              name="judgePin"
              placeholder="Judge PIN"
              value={judgeData.judgePin}
              onChange={handleInputChange}
              className="w-full p-4 rounded-2xl bg-blue-200/10 text-white placeholder-blue-100 outline-none border border-blue-300/20"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 text-white py-4 rounded-2xl font-semibold hover:scale-105 transition"
            >
              Add Judge
            </button>

          </form>
        </div>

        <div>
          <h2 className="text-white text-3xl font-bold mb-6">
            Event Judges
          </h2>

          <div className="space-y-4">
            {judges.map((judge) => (
              <div
                key={judge.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white shadow-xl"
              >
                <div className="flex justify-between items-center">
  <div>
    <h3 className="text-2xl font-semibold">
      {judge.judgeName}
    </h3>
  </div>

  <div className="flex gap-3 items-center">
    <span className="bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 rounded-xl">
      PIN: {judge.judgePin}
    </span>

    <button
      onClick={() => handleDeleteJudge(judge.id)}
      className="bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 rounded-xl hover:scale-105 transition"
    >
      Delete
    </button>
  </div>
</div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

export default JudgeManagementPage;
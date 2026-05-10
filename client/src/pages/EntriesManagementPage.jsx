import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EntriesManagementPage() {
  const society = JSON.parse(localStorage.getItem("society"));
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [entries, setEntries] = useState([]);
  const [entryName, setEntryName] = useState("");

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

  const fetchEntries = async (eventId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/societies/entries/${eventId}`
      );

      setEntries(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const handleEventChange = (event) => {
    const eventId = event.target.value;

    setSelectedEvent(eventId);

    if (eventId) {
      fetchEntries(eventId);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!entryName || !selectedEvent) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/societies/add-entry",
        {
          entryName,
          eventId: selectedEvent,
        }
      );

      alert("Entry added successfully");

      setEntryName("");

      fetchEntries(selectedEvent);

    } catch (error) {
      console.log(error);
      alert("Failed to add entry");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 via-blue-800 to-cyan-700 px-6 py-10">
      
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-white text-4xl font-bold mb-8">
          Entries Management
        </h1>

        <div className="bg-gradient-to-br from-blue-900/40 via-blue-700/20 to-cyan-500/20 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-blue-200/20 mb-10">

          <select
            value={selectedEvent}
            onChange={handleEventChange}
            className="w-full p-4 rounded-2xl bg-blue-200/10 text-white mb-6"
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
              placeholder="Entry Name (Participant / Team)"
              value={entryName}
              onChange={(e) => setEntryName(e.target.value)}
              className="w-full p-4 rounded-2xl bg-blue-200/10 text-white placeholder-blue-100"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 text-white py-4 rounded-2xl font-semibold hover:scale-105 transition"
            >
              Add Entry
            </button>
            <button
  type="button"
  onClick={() => navigate("/dashboard")}
  className="w-full bg-gradient-to-r from-sky-500 to-blue-700 text-white py-4 rounded-2xl font-semibold hover:scale-105 transition"
>
  Done
</button>

          </form>
        </div>

        <div>
          <h2 className="text-white text-3xl font-bold mb-6">
            Event Entries
          </h2>

          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white shadow-xl"
              >
                <h3 className="text-2xl font-semibold">
                  {entry.entryName}
                </h3>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

export default EntriesManagementPage;
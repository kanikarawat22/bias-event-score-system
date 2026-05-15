import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    eventName: "",
    eventDescription: "",
    eventDate: "",
    venue: "",
    numberOfJudges: "",
    status: "",
  });

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(
        `https://bias-backend-h3so.onrender.com/api/societies/event/${eventId}`
      );

      const event = response.data;

      setEventData({
        eventName: event.eventName,
        eventDescription: event.eventDescription,
        eventDate: event.eventDate.slice(0, 16),
        venue: event.venue,
        numberOfJudges: event.numberOfJudges,
        status: event.status,
      });

    } catch (error) {
      console.log(error);
      alert("Failed to load event details");
    }
  };

  const handleChange = (event) => {
    setEventData({
      ...eventData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.put(
        `https://bias-backend-h3so.onrender.com/api/societies/update-event/${eventId}`,
        eventData
      );

      alert("Event updated successfully");

      navigate("/dashboard");

    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 via-blue-800 to-cyan-700 flex items-center justify-center px-6 py-10">
      
      <div className="bg-gradient-to-br from-blue-900/40 via-blue-700/20 to-cyan-500/20 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-2xl border border-blue-200/20">
        
        <h1 className="text-white text-4xl font-bold text-center mb-8">
          Edit Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="eventName"
            placeholder="Event Name"
            value={eventData.eventName}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-blue-200/10 text-white placeholder-blue-100 outline-none border border-blue-300/20"
          />

          <textarea
            name="eventDescription"
            placeholder="Event Description"
            value={eventData.eventDescription}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-blue-200/10 text-white placeholder-blue-100 outline-none border border-blue-300/20"
          />

          <input
            type="datetime-local"
            name="eventDate"
            value={eventData.eventDate}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-blue-200/10 text-white outline-none border border-blue-300/20"
          />

          <input
            type="text"
            name="venue"
            placeholder="Venue"
            value={eventData.venue}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-blue-200/10 text-white placeholder-blue-100 outline-none border border-blue-300/20"
          />

          <input
            type="number"
            name="numberOfJudges"
            placeholder="Number of Judges"
            value={eventData.numberOfJudges}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-blue-200/10 text-white placeholder-blue-100 outline-none border border-blue-300/20"
          />

          <select
            name="status"
            value={eventData.status}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-blue-200/10 text-white outline-none border border-blue-300/20"
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 text-white py-4 rounded-2xl font-semibold hover:scale-105 transition"
          >
            Update Event
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditEventPage;
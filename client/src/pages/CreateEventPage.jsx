import { useState } from "react";
import axios from "axios";

function CreateEventPage() {
  const society = JSON.parse(localStorage.getItem("society"));

  const [eventData, setEventData] = useState({
    eventName: "",
    eventDescription: "",
    eventDate: "",
    venue: "",
    numberOfJudges: "",
    status: "Upcoming",
  });

  const [criteria, setCriteria] = useState([
    { name: "", maxMarks: "" }
  ]);

  const handleChange = (event) => {
    setEventData({
      ...eventData,
      [event.target.name]: event.target.value,
    });
  };

  const handleCriteriaChange = (index, field, value) => {
    const updatedCriteria = [...criteria];
    updatedCriteria[index][field] = value;
    setCriteria(updatedCriteria);
  };

  const addCriterion = () => {
    setCriteria([
      ...criteria,
      { name: "", maxMarks: "" }
    ]);
  };

  const removeCriterion = (index) => {
    const updatedCriteria = criteria.filter(
      (_, i) => i !== index
    );
    setCriteria(updatedCriteria);
  };

  const totalMarks = criteria.reduce(
    (sum, criterion) => sum + Number(criterion.maxMarks || 0),
    0
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://bias-backend-h3so.onrender.com/api/societies/create-event",
        {
          ...eventData,
          societyId: society.id,
          criteria,
        }
      );

      alert(response.data.message);

      setEventData({
        eventName: "",
        eventDescription: "",
        eventDate: "",
        venue: "",
        numberOfJudges: "",
        status: "Upcoming",
      });

      setCriteria([{ name: "", maxMarks: "" }]);

    } catch (error) {
      alert("Event creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 via-blue-800 to-cyan-700 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/40 via-blue-700/20 to-cyan-500/20 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-blue-200/20">
        
        <h1 className="text-white text-4xl font-bold mb-8">
          Create New Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="eventName"
            placeholder="Event Name"
            value={eventData.eventName}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-blue-200/10 text-white placeholder-blue-100"
          />

          <textarea
            name="eventDescription"
            placeholder="Event Description"
            value={eventData.eventDescription}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-blue-200/10 text-white placeholder-blue-100"
          />

          <input
            type="datetime-local"
            name="eventDate"
            value={eventData.eventDate}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-blue-200/10 text-white"
          />

          <input
            type="text"
            name="venue"
            placeholder="Venue"
            value={eventData.venue}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-blue-200/10 text-white placeholder-blue-100"
          />

          <input
            type="number"
            name="numberOfJudges"
            placeholder="Number of Judges"
            value={eventData.numberOfJudges}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-blue-200/10 text-white placeholder-blue-100"
          />

          <select
            name="status"
            value={eventData.status}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-blue-200/10 text-white"
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>

          <div>
            <h2 className="text-white text-2xl font-semibold mb-4">
              Scoring Criteria
            </h2>

            {criteria.map((criterion, index) => (
              <div
                key={index}
                className="flex gap-4 mb-4"
              >
                <input
                  type="text"
                  placeholder="Criterion Name"
                  value={criterion.name}
                  onChange={(e) =>
                    handleCriteriaChange(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  className="flex-1 p-4 rounded-2xl bg-blue-200/10 text-white placeholder-blue-100"
                />

                <input
                  type="number"
                  placeholder="Max Marks"
                  value={criterion.maxMarks}
                  onChange={(e) =>
                    handleCriteriaChange(
                      index,
                      "maxMarks",
                      e.target.value
                    )
                  }
                  className="w-40 p-4 rounded-2xl bg-blue-200/10 text-white placeholder-blue-100"
                />

                <button
                  type="button"
                  onClick={() => removeCriterion(index)}
                  className="bg-red-500 px-4 rounded-2xl text-white"
                >
                  X
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addCriterion}
              className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 rounded-2xl text-white"
            >
              + Add Criterion
            </button>
          </div>

          <div className="text-white text-2xl font-bold">
            Total Marks: {totalMarks}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 py-4 rounded-2xl text-white font-semibold"
          >
            Create Event
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateEventPage;
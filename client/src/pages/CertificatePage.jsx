import { useState } from "react";
import axios from "axios";

function CertificatePage() {
  const society = JSON.parse(localStorage.getItem("society"));

  const [participantName, setParticipantName] = useState("");
  const [eventName, setEventName] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");

  const [facultyHeadSignature, setFacultyHeadSignature] = useState(null);
  const [directorSignature, setDirectorSignature] = useState(null);
  const [convenerSignature, setConvenerSignature] = useState(null);

  const handleGenerateCertificate = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("participantName", participantName);
    formData.append("eventName", eventName);
    formData.append("position", position);
    formData.append("description", description);
    formData.append("societyLogo", society.societyLogo);

    formData.append("facultyHeadSignature", facultyHeadSignature);
    formData.append("directorSignature", directorSignature);
    formData.append("convenerSignature", convenerSignature);

    try {
      const response = await axios.post(
        "https://bias-event-score-system.onrender.com/api/societies/generate-certificate",
        formData,
        {
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], {
        type: "application/pdf",
      });

      const fileURL = window.URL.createObjectURL(file);

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "certificate.pdf";
      link.click();

      alert("Certificate generated successfully");

    } catch (error) {
      console.log(error);
      alert("Failed to generate certificate");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 p-8">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10">

        <h1 className="text-white text-4xl font-bold mb-8 text-center">
          Certificate Generation
        </h1>

        <form
          onSubmit={handleGenerateCertificate}
          className="space-y-6"
        >
          <input
            type="text"
            placeholder="Participant Name"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 text-white"
            required
          />

          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 text-white"
            required
          />

          <input
            type="text"
            placeholder="Position / Achievement"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 text-white"
            required
          />

          <textarea
            placeholder="Certificate Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 text-white"
            rows="4"
          />

          <div className="space-y-4 text-white">
            <div>
              <label>Faculty Head Signature</label>
              <input
                type="file"
                onChange={(e) =>
                  setFacultyHeadSignature(e.target.files[0])
                }
                required
              />
            </div>

            <div>
              <label>Director Signature</label>
              <input
                type="file"
                onChange={(e) =>
                  setDirectorSignature(e.target.files[0])
                }
                required
              />
            </div>

            <div>
              <label>Faculty Convener Signature</label>
              <input
                type="file"
                onChange={(e) =>
                  setConvenerSignature(e.target.files[0])
                }
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-700 py-4 rounded-2xl text-white font-bold hover:scale-105 transition"
          >
            Generate Certificate
          </button>
        </form>
      </div>
    </div>
  );
}

export default CertificatePage;